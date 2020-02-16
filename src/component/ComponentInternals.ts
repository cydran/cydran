import TemplateError from "@/error/TemplateError";
import Properties from "@/config/Properties";
import Region from "@/component/Region";
import Logger from "@/logger/Logger";
import Scope from "@/model/Scope";
import UnknownRegionError from "@/error/UnknownRegionError";
import { VALID_ID } from "@/constant/ValidationRegExp";
import Digestable from "@/mvvm/Digestable";
import ObjectUtils from "@/util/ObjectUtils";
import SimpleMap from "@/pattern/SimpleMap";
import ScopeImpl from "@/model/ScopeImpl";
import PubSub from "@/messaging/PubSub";
import SequenceGenerator from "@/pattern/SequenceGenerator";
import LoggerFactory from "@/logger/LoggerFactory";
import SetComponentError from "@/error/SetComponentError";
import { INTERNAL_DIRECT_CHANNEL_NAME, INTERNAL_CHANNEL_NAME, MODULE_FIELD_NAME } from "@/constant/Constants";
import { ComponentConfigBuilder, ComponentConfig, ComponentConfigImpl } from "@/component/ComponentConfig";
import Events from "@/constant/Events";
import ComponentFlags from "@/component/ComponentFlags";
import Mvvm from "@/mvvm/Mvvm";
import ExternalMediator from "@/model/ExternalMediator";
import MvvmImpl from "@/mvvm/MvvmImpl";
import ExternalAttributeDetail from "@/model/ExternalAttributeDetail";
import Modules from "@/module/Modules";
import Module from "@/module/Module";
import Nestable from "@/component/Nestable";
import MediatorSource from "@/mvvm/MediatorSource";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = new ComponentConfigBuilder().build();

class ComponentInternals implements Digestable {

	private flags: ComponentFlags;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private regions: { [id: string]: Region; };

	private parent: Nestable;

	private data: any;

	private id: number;

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

	constructor(component: Nestable, template: string, config: ComponentConfig) {
		requireNotNull(template, "template");

		if (typeof template !== "string") {
			throw new TemplateError("Template must be a string");
		}

		this.config = (config || DEFAULT_COMPONENT_CONFIG) as ComponentConfigImpl;
		this.hasExternals = false;
		this.parentModelFn = this.config.getParentModelFn();
		this.data = {};
		this.id = SequenceGenerator.INSTANCE.next();
		this.logger = LoggerFactory.getLogger(component.constructor.name + " Component " + this.id);
		this.parent = null;
		this.component = component;
		this.prefix = this.config.getPrefix().toLowerCase();
		this.template = template.trim();
		this.scope = new ScopeImpl();
		this.externalMediators = {};
		this.externalCache = {};
		this.externalFields = {};

		const effectiveExternalAttributes: string[] = this.config.getAttributes();

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
		this.pubSub = new PubSub(this.component, this.getModule());
	}

	public init() {
		this.component.reset();
		this.mvvm = new MvvmImpl(this.component, this.getModule(), this.prefix, this.scope, this.parentModelFn);
		this.render();
		this.mvvm.init(this.el, this, (name: string) => this.getRegion(name));
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
		requireNotNull(fn, "fn");
		requireNotNull(args, "args");
		this.mvvm.$apply(fn, args);
	}

	public setChild(name: string, component: Nestable): void {
		requireNotNull(name, "name");

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError("Region \'%rName%\' is unknown and must be declared in component template.", { "%rName%": name });
		}

		const hasComponent: boolean = this.getRegion(name).hasComponent();

		const childAdded: boolean = !!(component !== null && !hasComponent);
		const childRemoved: boolean = !!(component === null && hasComponent);

		if (childAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_ADDED, {
				name: name
			});
		}

		if (childRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_REMOVED, {
				name: name
			});
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_CHANGED, {
			name: name
		});

		this.getRegion(name).setComponent(component);

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_CHANGED, {
			name: name
		});

		if (childAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_ADDED, {
				name: name
			});
		}

		if (childRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_REMOVED, {
				name: name
			});
		}

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
			const error = new SetComponentError("Unable to set component %cName% on region %name%", { "%cName%": componentId, "%name%": name });
			this.getLogger().error(error);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (channelName === INTERNAL_DIRECT_CHANNEL_NAME) {
			if (messageName === "setMode") {
				switch (payload) {
					case "repeatable":
						this.flags.repeatable = true;
						break;

					default:
						this.flags.repeatable = false;
				}
			} else if (messageName === "consumeDigestionCandidates") {
				(payload as MediatorSource[]).push(this.mvvm);
			} else if (messageName === "disableGlobal") {
				this.pubSub.message(INTERNAL_DIRECT_CHANNEL_NAME, "disableGlobal");
				this.mvvm.disableGlobal();
				this.messageChildren(INTERNAL_DIRECT_CHANNEL_NAME, "disableGlobal", null);
			} else if (messageName === "enableGlobal") {
				this.pubSub.message(INTERNAL_DIRECT_CHANNEL_NAME, "enableGlobal");
				this.mvvm.enableGlobal();
				this.messageChildren(INTERNAL_DIRECT_CHANNEL_NAME, "enableGlobal", null);
			} else if (messageName === "digest") {
				this.digest();
			} else if (messageName === "setParent") {
				this.setParent(payload as Nestable);
			} else if (messageName === "setParentScope") {
				this.setParentScope(payload as ScopeImpl);
			} else if (messageName === "setData") {
				this.setData(payload);
			} else if (messageName === "addExternalAttribute") {
				this.addExternalAttribute(payload as ExternalAttributeDetail);
			}
		} else {
			this.pubSub.message(channelName, messageName, payload);
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public dispose(): void {
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_DISPOSE, {});
		this.pubSub.dispose();
		this.parent = null;
		this.parentScope = null;
		this.scope = null;
	}

	public getId(): number {
		return this.id;
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
		if (this.parent === null || this.parent === undefined) {
			return false;
		}

		return this.parent.isConnected();
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch(expression: string, target: (previous: any, current: any) => void): void {
		requireNotNull(expression, "expression");
		requireNotNull(target, "target");
		this.mvvm.mediate(expression).watch(this.component, target);
	}

	public on(target: (payload: any) => void, messageName: string, channel?: string): void {
		const targetChannel: string = channel || INTERNAL_CHANNEL_NAME;

		this.pubSub.on(messageName).forChannel(targetChannel).invoke((payload: any) => {
			this.$apply(target, [payload]);
		});
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

	public setData(data: any): void {
		this.data = (data === null || data === undefined) ? {} : data;
	}

	public getData(): any {
		return this.data;
	}

	public importExternals(): void {
		this.externalCache = {};

		for (const key in this.externalMediators) {
			if (this.externalMediators.hasOwnProperty(key)) {
				const mediator: ExternalMediator<any> = this.externalMediators[key];
				this.externalCache[key] = mediator.get(this.parentScope);
			}
		}
	}

	public exportExternals(): void {
		for (const key in this.externalMediators) {
			if (this.externalMediators.hasOwnProperty(key)) {
				const mediator: ExternalMediator<any> = this.externalMediators[key];
				mediator.set(this.parentScope, this.externalCache[key]);
			}
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

	protected getConfig(): ComponentConfig {
		return this.config;
	}

	protected getRegion(name: string): Region {
		if (!this.regions[name]) {
			this.getLogger().trace("Creating region " + name);
			this.regions[name] = new Region(name, this);
		}

		return this.regions[name];
	}

	protected getTemplate(): string {
		return this.template;
	}

	protected render(): void {
		this.getLogger().trace("Rendering");
		const templateEl: HTMLTemplateElement = Properties.getWindow().document.createElement("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());
		const count: number = templateEl.childElementCount;

		if (count !== 1) {
			const parmObj = { "%count%": "" + count, "%template%": this.template };
			const errmsg = "Component template must have a single top level element, but had %count% top level elements:\n\n%template%\n\n";
			const error = new TemplateError(errmsg, parmObj);
			this.getLogger().fatal(error);
			throw error;
		}

		this.el = templateEl.firstElementChild as HTMLElement;
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	private messageChildren(channelName: string, messageName: string, payload: any): void {
		for (const id in this.regions) {
			if (this.regions.hasOwnProperty(id)) {
				this.regions[id].message(channelName, messageName, payload);
			}
		}
	}

	private externalize(name: string): void {
		const key: string = name.toLowerCase();
		const value: string = key;

		// TODO - add guard code
		this.externalFields[key] = value;
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
		if (parent === null) {
			this.message(INTERNAL_DIRECT_CHANNEL_NAME, "disableGlobal", null);
			this.getLogger().trace("Clearing parent view");
		} else if (parent.isConnected()) {
			this.message(INTERNAL_DIRECT_CHANNEL_NAME, "enableGlobal", null);
		}

		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);

		if (parentAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_ADDED, {});
		}

		if (parentRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_REMOVED, {});
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;
		this.digest();
		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});

		if (parentAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_ADDED, {});
		}

		if (parentRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_REMOVED, {});
		}
	}

	private digest(): void {
		this.$apply(() => {
			// Intentionally do nothing
		}, []);
	}

}

export default ComponentInternals;
