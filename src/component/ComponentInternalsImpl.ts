import TemplateError from "@/error/TemplateError";
import Region from "@/component/Region";
import Logger from "@/logger/Logger";
import Scope from "@/model/Scope";
import UnknownRegionError from "@/error/UnknownRegionError";
import { VALID_ID } from "@/constant/ValidationRegExp";
import SimpleMap from "@/pattern/SimpleMap";
import ScopeImpl from "@/model/ScopeImpl";
import PubSub from "@/message/PubSub";
import LoggerFactory from "@/logger/LoggerFactory";
import SetComponentError from "@/error/SetComponentError";
import { INTERNAL_DIRECT_CHANNEL_NAME, INTERNAL_CHANNEL_NAME, MODULE_FIELD_NAME, NO_OP_FN, EMPTY_OBJECT_FN } from "@/constant/Constants";
import { ComponentConfigBuilder, ComponentConfig, ComponentConfigImpl } from "@/component/ComponentConfig";
import Events from "@/constant/Events";
import ComponentFlags from "@/component/ComponentFlags";
import Mvvm from "@/mvvm/Mvvm";
import ExternalMediator from "@/model/ExternalMediator";
import MvvmImpl from "@/mvvm/MvvmImpl";
import ExternalAttributeDetail from "@/model/ExternalAttributeDetail";
import Module from "@/module/Module";
import Nestable from "@/component/Nestable";
import MediatorSource from "@/mvvm/MediatorSource";
import ComponentInternals from "@/component/ComponentInternals";
import DirectEvents from "@/constant/DirectEvents";
import IdGenerator from "@/pattern/IdGenerator";
import NamedElementOperationsImpl from "@/component/NamedElementOperationsImpl";
import NamedElementOperations from "@/component/NamedElementOperations";
import UnknownElementError from "@/error/UnknownElementError";
import Getter from "@/model/Getter";
import ModuleAffinityError from "@/error/ModuleAffinityError";
import PubSubImpl from "@/message/PubSubImpl";
import ModulesContextImpl from "@/module/ModulesContextImpl";
import { requireNotNull, isDefined, requireValid } from "@/util/ObjectUtils";
import { createElementOffDom } from "@/util/DomUtils";

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = new ComponentConfigBuilder().build();

class ComponentInternalsImpl implements ComponentInternals {

	private id: string;

	private flags: ComponentFlags;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private regions: { [id: string]: Region; };

	private regionsAsArray: Region[];

	private parent: Nestable;

	private itemFn: () => any;

	private template: string;

	private mvvm: Mvvm;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private parentScope: ScopeImpl;

	private externalCache: any;

	private externalMediators: SimpleMap<ExternalMediator<any>>;

	private externalFields: SimpleMap<string>;

	private readonly prefix: string;

	private hasExternals: boolean;

	private config: ComponentConfigImpl;

	private parentModelFn: () => any;

	private parentSeen: boolean;

	constructor(component: Nestable, template: string, config: ComponentConfig) {
		requireNotNull(template, "template");

		if (typeof template !== "string") {
			throw new TemplateError("Template must be a string");
		}

		this.parentSeen = false;
		this.id = IdGenerator.INSTANCE.generate();
		this.config = (config || DEFAULT_COMPONENT_CONFIG) as ComponentConfigImpl;
		this.hasExternals = false;
		this.parentModelFn = this.config.getParentModelFn();
		this.itemFn = EMPTY_OBJECT_FN;
		this.parent = null;
		this.component = component;
		this.prefix = this.config.getPrefix().toLowerCase();
		this.template = template.trim();
		this.scope = new ScopeImpl();
		this.externalMediators = {};
		this.externalCache = {};
		this.externalFields = {};
		const effectiveExternalAttributes: string[] = this.config.getAttributes();

		if (isDefined(this.config.getModule())) {
			this.component[MODULE_FIELD_NAME] = this.config.getModule();
		}

		this.validateModulePresent();

		for (const attribute of effectiveExternalAttributes) {
			this.externalize(attribute);
		}

		this.flags = {
			repeatable: false
		};

		if (this.getModule()) {
			this.scope.setParent(this.getModule().getScope() as ScopeImpl);
		}

		this.regions = {};
		this.regionsAsArray = [];
		this.pubSub = new PubSubImpl(this.component, this.getModule());
	}

	public init(): void {
		this.mvvm = new MvvmImpl(this.id, this.component, this.getModule(), this.prefix, this.scope, this.parentModelFn);
		this.render();
		this.mvvm.init(this.el, this, (name: string) => this.getRegion(name));
		this.logger = LoggerFactory.getLogger(this.component.constructor.name + " Component " + this.mvvm.getId());
	}

	public hasMetadata(name: string): boolean {
		return this.getMetadata(name) ? true : false;
	}

	public getMetadata(name: string): any {
		requireNotNull(name, "name");
		return this.config.getMetadata(name);
	}

	public hasRegion(name: string): boolean {
		requireNotNull(name, "name");
		return ((this.regions[name]) ? true : false);
	}

	public $apply(fn: Function, args: any[]): void {
		const actualFn: Function = fn || NO_OP_FN;
		const actualArgs = args || [];

		if (this.parentSeen) {
			this.mvvm.$apply(actualFn, actualArgs);
		} else {
			actualFn.apply(this.component, actualArgs);
		}
	}

	public evaluate<T>(expression: string): T {
		return new Getter<T>(expression).get(this.mvvm.getScope()) as T;
	}

	public getChild<N extends Nestable>(name: string): N {
		requireNotNull(name, "name");

		return this.hasRegion(name) ? this.getRegion(name).getComponent() : null;
	}

	public setChild(name: string, component: Nestable): void {
		requireNotNull(name, "name");

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError("Region \'%rName%\' is unknown and must be declared in component template.",
				{ "%rName%": name });
		}

		const hasComponent: boolean = this.getRegion(name).hasComponent();
		const childAdded: boolean = !!(component !== null && !hasComponent);
		const childRemoved: boolean = !!(component === null && hasComponent);
		this.messageInternalIf(childAdded, Events.BEFORE_CHILD_ADDED, { name: name });
		this.messageInternalIf(childRemoved, Events.BEFORE_CHILD_REMOVED, { name: name });
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_CHANGED, { name: name });
		this.getRegion(name).setComponent(component);
		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_CHANGED, { name: name });
		this.messageInternalIf(childAdded, Events.AFTER_CHILD_ADDED, { name: name });
		this.messageInternalIf(childRemoved, Events.AFTER_CHILD_REMOVED, { name: name });
		this.broadcastGlobally(INTERNAL_CHANNEL_NAME, Events.COMPONENT_NESTING_CHANGED);
	}

	public setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void {
		requireNotNull(name, "name");
		requireValid(componentId, "componentId", VALID_ID);

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError("Region \'%rName%\' is unknown and must be declared in component template.", { "%rName%": name });
		}

		let component: Nestable = this.get(componentId);

		if (!component && defaultComponentName) {
			component = this.get(defaultComponentName);
		}

		if (component) {
			this.setChild(name, component);
		} else {
			const error = new SetComponentError("Unable to set component %cName% on region %name%",
				{ "%cName%": componentId, "%name%": name });
			this.getLogger().error(error);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (channelName !== INTERNAL_DIRECT_CHANNEL_NAME) {
			this.pubSub.message(channelName, messageName, payload);

			return;
		}

		switch (messageName) {
			case "setMode":
				switch (payload) {
					case "repeatable":
						this.flags.repeatable = true;
						break;

					default:
						this.flags.repeatable = false;
				}
				break;

			case "consumeRegionDigestionCandidates":
				for (const region of this.regionsAsArray) {
					if (region.hasExpression() && region.hasComponent()) {
						region.getComponent().message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", payload);
					}
				}

				break;

			case "consumeDigestionCandidates":
				(payload as MediatorSource[]).push(this.mvvm);
				break;

			case DirectEvents.NESTING_CHANGED:
				this.nestingChanged();
				break;

			case "digest":
				this.digest();
				break;

			case "setParent":
				this.setParent(payload as Nestable);
				break;

			case "skipId":
				this.mvvm.skipId(payload as string);
				break;

			case "setParentScope":
				this.setParentScope(payload as ScopeImpl);
				break;

			case "setItemFn":
				this.setItemFn(payload);
				break;

			case "addExternalAttribute":
				this.addExternalAttribute(payload as ExternalAttributeDetail);
				break;

			default:
				// Intentionally do nothing
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcastGlobally(channelName, messageName, payload);
	}

	public dispose(): void {
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_DISPOSE, {});
		this.pubSub.dispose();
		this.parent = null;
		this.parentScope = null;
		this.scope = null;
		this.regions = null;
		this.regionsAsArray = [];
	}

	public getEl(): HTMLElement {
		return this.el;
	}

	public getComponent(): Nestable {
		return this.component;
	}

	public get<T>(id: string): T {
		return this.getModule().get(id);
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public isConnected(): boolean {
		return this.parent !== null && this.parent !== undefined && this.parent.isConnected();
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		requireNotNull(expression, "expression");
		requireNotNull(target, "target");
		const actualContext: any = isDefined(context) ? context : this.component;
		this.mvvm.mediate(expression, reducerFn).watch(actualContext, target);
	}

	public on(target: (payload: any) => void, messageName: string, channel?: string): void {
		this.pubSub.on(messageName).forChannel(channel || INTERNAL_CHANNEL_NAME).invoke((payload: any) => this.$apply(target, [payload]));
	}

	public forElement<E extends HTMLElement>(name: string): NamedElementOperations<E> {
		requireNotNull(name, "name");
		const element: E = this.mvvm.getNamedElement(name) as E;

		if (!isDefined(element)) {
			throw new UnknownElementError("Unknown element: " + name);
		}

		return new NamedElementOperationsImpl<E>(element);
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getModule(): Module {
		return this.component[MODULE_FIELD_NAME] as Module;
	}

	public getParent(): Nestable {
		return this.parent;
	}

	public setItemFn(itemFn: () => any): void {
		this.itemFn = isDefined(itemFn) ? itemFn : EMPTY_OBJECT_FN;
	}

	public getData(): any {
		return this.itemFn();
	}

	public importExternals(): void {
		this.externalCache = {};

		for (const key in this.externalMediators) {
			if (!this.externalMediators.hasOwnProperty(key)) {
				continue;
			}

			const mediator: ExternalMediator<any> = this.externalMediators[key];
			this.externalCache[key] = mediator.get(this.parentScope);
		}
	}

	public exportExternals(): void {
		for (const key in this.externalMediators) {
			if (!this.externalMediators.hasOwnProperty(key)) {
				continue;
			}

			const mediator: ExternalMediator<any> = this.externalMediators[key];
			mediator.set(this.parentScope, this.externalCache[key]);
		}

		this.externalCache = {};
	}

	public hasExternalMediators(): boolean {
		return this.hasExternals;
	}

	public getExternalCache(): any {
		return this.externalCache;
	}

	public getFlags(): ComponentFlags {
		return this.flags;
	}

	public getId(): string {
		return this.id;
	}

	public 	getWatchContext(): any {
		return this.mvvm.getScope();
	}

	protected getConfig(): ComponentConfig {
		return this.config;
	}

	protected getRegion(name: string): Region {
		if (!this.regions[name]) {
			const created: Region = new Region(name, this);
			this.regions[name] = created;
			this.regionsAsArray.push(created);
		}

		return this.regions[name];
	}

	protected getTemplate(): string {
		return this.template;
	}

	protected render(): void {
		const templateEl: HTMLTemplateElement = createElementOffDom("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());
		const count: number = templateEl.childElementCount;

		if (count !== 1) {
			const parmObj = { "%count%": "" + count, "%template%": this.template };
			const errmsg = "Component template must have a single top level element, but had %count% top level elements:\n\n%template%\n\n";
			const error = new TemplateError(errmsg, parmObj);
			throw error;
		}

		this.el = templateEl.firstElementChild as HTMLElement;
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	protected validateModulePresent(): void {
		const moduleInstance: Module = this.component[MODULE_FIELD_NAME] as Module;

		if (!isDefined(moduleInstance)) {
			if (ModulesContextImpl.getInstances().length === 0) {
				throw new ModuleAffinityError("Component "+ this.component.constructor.name + " does not have affinity with a module and no stages are active.  Unable to determine component affinity");
			} else if (ModulesContextImpl.getInstances().length === 1) {
				this.component[MODULE_FIELD_NAME] = ModulesContextImpl.getInstances()[0].getDefaultModule();
			} else {
				throw new ModuleAffinityError("Component "+ this.component.constructor.name + " does not have affinity with a module and multiple stages are active.  Unable to determine component affinity");
			}
		}
	}

	private messageInternalIf(condition: boolean, messageName: string, payload?: any): void {
		if (condition) {
			this.message(INTERNAL_CHANNEL_NAME, messageName, payload);
		}
	}

	private messageChildren(channelName: string, messageName: string, payload?: any): void {
		for (const id in this.regions) {
			if (!this.regions.hasOwnProperty(id)) {
				continue;
			}

			this.regions[id].message(channelName, messageName, payload);
		}
	}

	private externalize(name: string): void {
		this.externalFields[name.toLowerCase()] = name.toLowerCase();
	}

	private addExternalAttribute(detail: ExternalAttributeDetail): void {
		const fieldName: string = this.externalFields[detail.attributeName];
		this.hasExternals = true;

		if (fieldName) {
			this.externalMediators[fieldName] = new ExternalMediator(detail.expression);
		}
	}

	private setParentScope(scope: ScopeImpl): void {
		this.parentScope = scope;
	}

	private setParent(parent: Nestable): void {
		this.parentSeen = true;
		const changed: boolean = this.bothPresentButDifferent(parent, this.parent) || this.exactlyOneDefined(parent, this.parent);
		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);
		this.messageInternalIf(parentAdded, Events.BEFORE_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.BEFORE_PARENT_REMOVED, {});
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;

		if (changed) {
			this.nestingChanged();
		}

		if (isDefined(this.parent)) {
			this.digest();
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});
		this.messageInternalIf(parentAdded, Events.AFTER_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.AFTER_PARENT_REMOVED, {});
	}

	private nestingChanged(): void {
		if (this.isConnected() && !this.pubSub.isGlobalEnabled()) {
			this.pubSub.enableGlobal();
		} else if (!this.isConnected() && this.pubSub.isGlobalEnabled()) {
			this.pubSub.disableGlobal();
		}

		this.mvvm.nestingChanged();
		this.messageChildren(INTERNAL_DIRECT_CHANNEL_NAME, DirectEvents.NESTING_CHANGED);
	}

	private digest(): void {
		this.$apply(NO_OP_FN, []);
	}

	private bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
		return isDefined(first) && isDefined(second) && first.getId() !== second.getId();
	}

	private exactlyOneDefined(first: any, second: any): boolean {
		return isDefined(first) ? !isDefined(second) : isDefined(second);
	}

}

export default ComponentInternalsImpl;
