import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import Attributes from "component/Attributes";
import AttributesImpl from "component/AttributesImpl";
import Behavior from "behavior/Behavior";
import DigestableSource from "behavior/DigestableSource";
import Behaviors from "behavior/Behaviors";
import BehaviorsImpl from "behavior/BehaviorsImpl";
import ComponentStates from "component/ComponentStates";
import ComponentTransitions from "component/ComponentTransitions";
import DEFAULT_COMPONENT_OPTIONS from "component/DefaultComponentOptions";
import Digester from "digest/Digester";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";
import ElementOperations from "component/ElementOperations";
import ElementOperationsImpl from "component/ElementOperationsImpl";
import Events from "const/EventsFields";
import Getter from "mediator/Getter";
import IdGenerator from "util/IdGenerator";
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import InternalComponentOptions from "component/InternalComponentOptions";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Machine from "machine/Machine";
import MachineContext from "machine/MachineContext";
import Mediator from "mediator/Mediator";
import MediatorImpl from "mediator/MediatorImpl";
import Messagable from "interface/ables/Messagable";
import Module from "module/Module";
import ModulesContextImpl from "module/ModulesContextImpl";
import Nestable from "interface/ables/Nestable";
import PropertyKeys from "const/PropertyKeys";
import PubSub from "message/PubSub";
import PubSubImpl from "message/PubSubImpl";
import Region from "component/Region";
import Renderer from "component/Renderer";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";
import SimpleMap from "interface/SimpleMap";
import StringRendererImpl from "component/renderer/StringRendererImpl";
import Tellable from "interface/ables/Tellable";
import stateMachineBuilder from "machine/StateMachineBuilder";
import ComponentInternals from "component/ComponentInternals";
import { INTERNAL_CHANNEL_NAME, DEFAULT_CLONE_DEPTH, MODULE_FIELD_NAME, DEFAULT_EQUALS_DEPTH, VALID_ID, ANONYMOUS_REGION_PREFIX } from "Constants";
import { NO_OP_FN, EMPTY_OBJECT_FN } from "const/Functions";
import { UnknownRegionError, TemplateError, ModuleAffinityError, UnknownElementError, SetComponentError, ValidationError } from "error/Errors";
import { isDefined, requireNotNull, merge, requireValid, equals, clone, extractClassName } from "util/Utils";
import TagNames from "const/TagNames";
import RegionBehavior from "behavior/core/RegionBehavior";
import MediatorTransitions from "mediator/MediatorTransitions";
import ModuleImpl from "module/ModuleImpl";
import InternalBehaviorFlags from "behavior/InternalBehaviorFlags";
import DigestionActions from "const/DigestionActions";
import CydranContext from "context/CydranContext";
import JSType from "const/JSType";
import FormOperations from "component/FormOperations";
import FormOperationsImpl from "component/FormOperationsImpl";
import MultipleFormOperationsImpl from "component/MultipleFormOperationsImpl";

const VALID_PREFIX_REGEX: RegExp = /^([a-z]+\-)*[a-z]+$/;

class ComponentInternalsImpl implements ComponentInternals, Tellable {

	private id: string;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private parent: Nestable;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private options: InternalComponentOptions;

	private renderer: Renderer;

	private context: MachineContext<ComponentInternalsImpl>;

	private behaviors: Behaviors;

	private mediators: MediatorImpl<any>[];

	private propagatingBehaviors: Behavior<any, HTMLElement | Text, any>[];

	private components: Nestable[];

	private namedElements: SimpleMap<HTMLElement>;

	private namedForms: SimpleMap<HTMLFormElement>;

	private forms: HTMLFormElement[];

	private modelFn: () => any;

	private itemFn: () => any;

	private itemLookupFn: () => any;

	private externalItemLookup: boolean;

	private digester: Digester;

	private anonymousRegionNameIndex: number;

	private extractor: Attributes;

	private cloneDepth: number;

	private equalsDepth: number;

	private maxEvaluations: number;

	private regions: AdvancedMap<Region>;

	private validated: boolean;

	private template: string | HTMLElement | Renderer;

	private cydranContext: CydranContext;

	constructor(component: Nestable, template: string | HTMLElement | Renderer, options: InternalComponentOptions) {
		this.template = requireNotNull(template, TagNames.TEMPLATE);
		this.component = requireNotNull(component, "component");
		this.options = options;
		this.context = COMPONENT_MACHINE.create(this);
		this.tell(ComponentTransitions.BOOTSTRAP);
		this.initFields();

		if (this.validated) {
			this.tell(ComponentTransitions.VALIDATE);
		}
	}

	public getLoggerFactory(): LoggerFactory {
		return this.cydranContext.logFactory();
	}

	public validate(): void {
		const moduleInstance: Module = this.getModule();

		if (!isDefined(moduleInstance)) {
			if (ModulesContextImpl.getInstances().length === 0) {
				throw new ModuleAffinityError(`Component ${extractClassName(this.component)} does not have affinity with a module and no stages are active.  Unable to determine component affinity`);
			}

			if (ModulesContextImpl.getInstances().length > 1) {
				throw new ModuleAffinityError(`Component ${extractClassName(this.component)} does not have affinity with a module and multiple stages are active.  Unable to determine component affinity`);
			}
		}

		// TODO - Implement option object validation
	}

	public isMounted(): boolean {
		return this.context.isState("MOUNTED");
	}

	public getParent(): Nestable {
		return this.parent;
	}

	public bootstrap(): void {
		this.options = merge([DEFAULT_COMPONENT_OPTIONS, this.options], { metadata: (existingValue: any, newValue: any) => merge([existingValue, newValue])});
		this.options.prefix = this.options.prefix.toLowerCase();

		if (!VALID_PREFIX_REGEX.test(this.options.prefix)) {
			throw new ValidationError("Invalid prefix defined in options.  Prefix values must only contain letters and single dashes.");
		}

		if (!isDefined(this.options.name) || this.options.name.trim().length === 0) {
			this.options.name = extractClassName(this.component);
		}

		if (isDefined(this.options.module)) {
			this.component[MODULE_FIELD_NAME] = this.options.module;
		}

		const moduleInstance: Module = this.component[MODULE_FIELD_NAME] as Module;

		if (!isDefined(moduleInstance) && ModulesContextImpl.getInstances().length === 1) {
			this.component[MODULE_FIELD_NAME] = ModulesContextImpl.getInstances()[0].getDefaultModule();
		}

		this.initProperties();
	}

	public isValidated(): boolean {
		return this.validated;
	}

	public initialize(): void {
		this.cydranContext = this.getModule().getCydranContext();
		this.id = this.getModule().getCydranContext().idGenerator().generate();
		this.logger = this.getLoggerFactory().getLogger(`Component[${ this.getName() }] ${ this.id }`);
		this.initScope();
		this.initRenderer();
		this.pubSub = new PubSubImpl(this.component, this.getModule());
		this.digester = this.cydranContext.getFactories().createDigester(this, this.id, extractClassName(this.component), this.maxEvaluations);
		this.init();
	}

	public init(): void {
		this.render();
		this.validateEl();
		(this.getModule() as ModuleImpl).getDomWalker().walk(this.el, this);

		if (isDefined(this.options.parent)) {
			this.setParent(this.options.parent);
		}
	}

	public hasMetadata(name: string): boolean {
		return this.getMetadata(name) ? true : false;
	}

	public getMetadata(name: string): any {
		requireNotNull(name, "name");

		return this.options.metadata[name];
	}

	public hasRegion(name: string): boolean {
		requireNotNull(name, "name");

		return this.regions.has(name);
	}

	public $apply(fn: Function, args: any[]): void {
		const actualFn: Function = fn || NO_OP_FN;
		const actualArgs = args || [];

		actualFn.apply(this.component, actualArgs);

		if (this.isMounted()) {
			this.digest();
		}
	}

	public digest(): void {
		this.digester.digest();
	}

	public onMount(): void {
		this.component.onMount();
		this.pubSub.enableGlobal();
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellBehaviors(ComponentTransitions.MOUNT);
		this.tellMediators(MediatorTransitions.MOUNT);
	}

	public onUnmount(): void {
		this.component.onUnmount();
		this.pubSub.disableGlobal();
		this.tellChildren(ComponentTransitions.UNMOUNT);
		this.tellBehaviors(ComponentTransitions.UNMOUNT);
		this.tellMediators(MediatorTransitions.UNMOUNT);
	}

	public onRemount(): void {
		this.component.onRemount();
		this.pubSub.enableGlobal();
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellBehaviors(ComponentTransitions.MOUNT);
		this.tellMediators(MediatorTransitions.MOUNT);
		this.digest();
	}

	public evaluate<T>(expression: string): T {
		const getterLogger: Logger = this.cydranContext.logFactory().getLogger(`Getter: ${ expression }`);
		return new Getter<T>(expression, getterLogger).get(this.getScope() as ScopeImpl) as T;
	}

	public getChild<N extends Nestable>(name: string): N {
		requireNotNull(name, "name");

		return this.hasRegion(name) ? this.getRegion(name).getComponent() : null;
	}

	public setChild(name: string, component: Nestable): void {
		requireNotNull(name, "name");

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError(`Region '${name}' is unknown and must be declared in component template.`);
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
		this.messageSubordinates(INTERNAL_CHANNEL_NAME, Events.COMPONENT_NESTING_CHANGED);
	}

	public setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void {
		requireNotNull(name, "name");
		requireValid(componentId, "componentId", VALID_ID);

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError(`Region '${name}' is unknown and must be declared in component template.`);
		}

		let component: Nestable = this.get(componentId);

		if (!component && defaultComponentName) {
			component = this.get(defaultComponentName);
		}

		if (component) {
			this.setChild(name, component);
		} else {
			const error = new SetComponentError(`Unable to set component ${componentId} on region ${name}`);
			this.getLogger().error(error);
		}
	}

	public tell(name: string, payload?: any): void {
		switch (name) {

			case "addNamedElement":
				const id: string = payload["name"];
				const el: HTMLElement = payload["element"];
				this.addNamedElement(id, el);
				break;

			case "digest":
				this.digest();
				break;

			case "setParent":
				this.setParent(payload as Nestable);
				break;

			case "setItemFn":
				this.setItemFn(payload);
				break;

			case DigestionActions.REQUEST_DIGESTION_SOURCES:
				this.requestDigestionSources(payload);
				break;

			case DigestionActions.REQUEST_DIGESTION_CANDIDATES:
				this.requestDigestionCandidates(payload);
				break;

			default:
				COMPONENT_MACHINE.evaluate(name, this.context, payload);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		this.pubSub.message(channelName, messageName, payload);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcastGlobally(channelName, messageName, payload);
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
		return this.options.prefix;
	}

	public isConnected(): boolean {
		return (this.options.alwaysConnected || (this.parent !== null && this.parent !== undefined && this.parent.isConnected()));
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		requireNotNull(expression, "expression");
		requireNotNull(target, "target");
		const actualContext: any = isDefined(context) ? context : this.component;
		this.mediate(expression, reducerFn).watch(actualContext, target);
	}

	public on(target: (payload: any) => void, messageName: string, channel?: string): void {
		this.pubSub.on(messageName).forChannel(channel || INTERNAL_CHANNEL_NAME).invoke((payload: any) => this.$apply(target, [payload]));
	}

	public getName(): string {
		return this.options.name;
	}

	public forElement<E extends HTMLElement>(name: string): ElementOperations<E> {
		requireNotNull(name, "name");
		const element: E = this.getNamedElement(name) as E;

		if (!isDefined(element)) {
			throw new UnknownElementError(`Unknown element: ${name}`);
		}

		return new ElementOperationsImpl<E>(element);
	}

	public forForm(name: string): FormOperations {
		requireNotNull(name, "name");
		const form: HTMLFormElement = this.getNamedForm(name);

		if (!isDefined(form)) {
			throw new UnknownElementError(`Unknown form: ${name}`);
		}

		return new FormOperationsImpl(form);
	}

	public forForms(): FormOperations {
		return new MultipleFormOperationsImpl(this.forms);
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getModule(): Module {
		return this.component[MODULE_FIELD_NAME] as Module;
	}

	public setItemFn(itemFn: () => any): void {
		this.externalItemLookup = isDefined(itemFn);
		this.itemLookupFn = this.externalItemLookup ? itemFn : EMPTY_OBJECT_FN;
	}

	public getData(): any {
		return this.itemLookupFn();
	}

	public getId(): string {
		return this.id;
	}

	public getWatchContext(): any {
		return this.getScope();
	}

	public getNamedElement<E extends HTMLElement>(name: string): E {
		const element: E = this.namedElements[name] as E;
		return isDefined(element) ? element: null;
	}

	public getNamedForm(name: string): HTMLFormElement {
		const form: HTMLFormElement = this.namedForms[name] as HTMLFormElement;
		return isDefined(form) ? form : null;
	}

	public invoke(expression: string, params: any = {}): void {
		const aggregateScope: SimpleMap<any> = {};
		const scopeItems: SimpleMap<any> = this.scope.getItems();

		for (const key in scopeItems) {
			if (!scopeItems.hasOwnProperty(key)) {
				continue;
			}

			aggregateScope[key] = scopeItems[key];
		}

		if (isDefined(params)) {
			for (const key in params) {
				if (!params.hasOwnProperty(key)) {
					continue;
				}

				aggregateScope[key] = params[key];
			}
		}

		let aggregateScopeCode: string = "";

		for (const key in aggregateScope) {
			if (!aggregateScope.hasOwnProperty(key)) {
				continue;
			}

			const statement: string = `var ${ key } = arguments[0]['${ key }'];\n`;
			aggregateScopeCode += statement;
		}

		const code: string = `'use strict'; ${ aggregateScopeCode } (${ expression });`;

		try {
			Function(code).apply({}, [aggregateScope]);
		} catch (e) {
			this.logger.ifError(() => `\n(${ e.name }) thrown invoking behavior expression: ${ expression }\n\nContext:\n${ code }\nMessage: ${ e.message }`, e);
		}

		this.digest();
	}

	public mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T> {
		const mediator: Mediator<T> = new MediatorImpl<T>(
			expression,
			this.scope,
			reducerFn,
			(value: any) => clone(this.cloneDepth, value),
			(first: any, second: any) => equals(this.equalsDepth, first, second),
			this.cydranContext.logFactory()
		);

		this.mediators.push(mediator as MediatorImpl<any>);

		mediator.tell(MediatorTransitions.INIT);

		return mediator;
	}

	public requestDigestionCandidates(consumer: DigestionCandidateConsumer): void {
		consumer.add(this.getId(), this.mediators);
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		if (this.externalItemLookup && isDefined(this.parent)) {
			sources.push(this.parent);
		}

		for (const source of this.propagatingBehaviors) {
			sources.push(source);
		}
	}

	public getExtractor(): Attributes {
		return this.extractor;
	}

	public getModelFn(): () => any {
		return this.modelFn;
	}

	public getItemFn(): () => any {
		return this.itemFn;
	}

	public getMessagables(): Messagable[] {
		return this.components;
	}

	public getModel(): any {
		return this.component;
	}

	private validateEl(): void {
		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Templates must not have a script tag as the top level tag.");
		}
	}

	public addRegion(name: string, region: RegionBehavior): Region {
		if (!this.regions.has(name)) {
			this.regions.put(name, region);
		}

		return this.regions.get(name);
	}

	public createRegionName(): string {
		const name: string = ANONYMOUS_REGION_PREFIX + this.anonymousRegionNameIndex;
		++this.anonymousRegionNameIndex;

		return name;
	}

	public addBehavior(behavior: any): void {
		this.behaviors.add(behavior as Behavior<any, HTMLElement | Text, any>);

		if ((behavior as Behavior<any, HTMLElement | Text, any>).isFlagged(InternalBehaviorFlags.PROPAGATION)) {
			this.propagatingBehaviors.push(behavior as Behavior<any, HTMLElement | Text, any>);
		}
	}

	public addNamedElement(name: string, element: HTMLElement): void {
		if (isDefined(name) && isDefined(element)) {
			this.namedElements[name] = element;

			if (element.tagName.toLowerCase() === "form") {
				this.namedForms[name] = element as HTMLFormElement;
			}
		}
	}

	public addForm(form: HTMLFormElement): void {
		this.forms.push(form);
	}

	protected getOptions(): InternalComponentOptions {
		return this.options;
	}

	protected getRegion(name: string): Region {
		return this.regions.get(name);
	}

	protected render(): void {
		this.el = this.renderer.render();

		this.logger.ifTrace(() => "Rendered elements:\n" + this.el.outerHTML);

		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Component template must not use a script tag as top-level element in component " + extractClassName(this.component));
		}
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	private initScope(): void {
		const localModelFn: () => any = () => this.component;
		this.modelFn = isDefined(this.options.parentModelFn) ? this.options.parentModelFn : localModelFn;
		this.itemFn = () => this.getData();

		const parentScope: ScopeImpl = new ScopeImpl(false);
		parentScope.setParent(this.getModule().getScope() as ScopeImpl);
		parentScope.add("m", this.modelFn);
		parentScope.add("v", this.itemFn);
		this.scope.setParent(parentScope);
	}

	private initFields(): void {
		this.regions = new AdvancedMapImpl<Region>();
		this.anonymousRegionNameIndex = 0;
		this.propagatingBehaviors = [];
		this.behaviors = new BehaviorsImpl();
		this.namedForms = {};
		this.namedElements = {};
		this.forms = [];
		this.mediators = [];
		this.parent = null;
		this.itemLookupFn = EMPTY_OBJECT_FN;
		this.externalItemLookup = false;
		this.components = [];
		this.renderer = null;
		this.extractor = new AttributesImpl(this.options.prefix);
		this.scope = new ScopeImpl();
	}

	private initRenderer(): void {
		const templateType: string = typeof this.template;

		if (templateType === JSType.STR) {
			this.renderer = new StringRendererImpl(this.cydranContext.getDom(), this.template as string);
		} else if (templateType === JSType.OBJ && isDefined(this.template["render"] && typeof this.template["render"] === JSType.FN)) {
			this.renderer = this.template as Renderer;
		} else if (this.template instanceof HTMLElement) {
			// TODO - Correctly check for HTMLElement
			this.renderer = new IdentityRendererImpl(this.template as HTMLElement);
		}

		if (!isDefined(this.renderer)) {
			throw new TemplateError(`Template must be a string, HTMLElement or Renderer - ${templateType}`);
		}
	}

	private initProperties(): void {
		this.validated = !this.getModule().getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);
		const configuredCloneDepth: number = this.getModule().getProperties().get(PropertyKeys.CYDRAN_CLONE_MAX_EVALUATIONS);
		const configuredEqualsDepth: number = this.getModule().getProperties().get(PropertyKeys.CYDRAN_EQUALS_MAX_EVALUATIONS);
		this.maxEvaluations = this.getModule().getProperties().get(PropertyKeys.CYDRAN_DIGEST_MAX_EVALUATIONS);
		this.cloneDepth = isDefined(configuredCloneDepth) ? configuredCloneDepth : DEFAULT_CLONE_DEPTH;
		this.equalsDepth = isDefined(configuredEqualsDepth) ? configuredEqualsDepth : DEFAULT_EQUALS_DEPTH;
	}

	private messageInternalIf(condition: boolean, messageName: string, payload?: any): void {
		if (condition) {
			this.message(INTERNAL_CHANNEL_NAME, messageName, payload);
		}
	}

	private tellChildren(name: string, payload?: any): void {
		this.regions.each((region) => (region as unknown as Region).tellComponent(name, payload));
	}

	private tellBehaviors(name: string, payload?: any): void {
		this.behaviors.tell(name, payload);
	}

	private tellMediators(name: string, payload?: any): void {
		for (const mediator of this.mediators) {
			mediator.tell(name, payload);
		}
	}

	private messageChildren(channelName: string, messageName: string, payload?: any): void {
		this.regions.each((region) => region.message(channelName, messageName, payload));
	}

	private messageBehaviors(channelName: string, messageName: string, payload?: any): void {
		this.behaviors.message(channelName, messageName, payload);
	}

	private messageSubordinates(channelName: string, messageName: string, payload?: any): void {
		this.messageBehaviors(channelName, messageName, payload);
		this.messageChildren(channelName, messageName, payload);
	}

	private setParent(parent: Nestable): void {
		const changed: boolean = this.bothPresentButDifferent(parent, this.parent) || this.exactlyOneDefined(parent, this.parent);
		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);
		this.messageInternalIf(parentAdded, Events.BEFORE_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.BEFORE_PARENT_REMOVED, {});
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;

		if (parentAdded && parent.isMounted()) {
			this.tell(ComponentTransitions.MOUNT);
		} else if (parentRemoved) {
			this.tell(ComponentTransitions.UNMOUNT);
		} else if (changed) {
			this.tell(ComponentTransitions.UNMOUNT);

			if (parent.isMounted()) {
				this.tell(ComponentTransitions.MOUNT);
			}
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});
		this.messageInternalIf(parentAdded, Events.AFTER_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.AFTER_PARENT_REMOVED, {});
	}

	private bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
		return isDefined(first) && isDefined(second) && first.getId() !== second.getId();
	}

	private exactlyOneDefined(first: any, second: any): boolean {
		return isDefined(first) ? !isDefined(second) : isDefined(second);
	}

}

const COMPONENT_MACHINE: Machine<ComponentInternalsImpl> = stateMachineBuilder<ComponentInternalsImpl>(ComponentStates.UNINITIALIZED)
	.withState(ComponentStates.UNINITIALIZED, [])
	.withState(ComponentStates.BOOTSTRAPPED, [])
	.withState(ComponentStates.VALIDATED, [])
	.withState(ComponentStates.READY, [])
	.withState(ComponentStates.MOUNTED, [])
	.withState(ComponentStates.UNMOUNTED, [])
	.withTransition(ComponentStates.UNINITIALIZED, ComponentTransitions.BOOTSTRAP, ComponentStates.BOOTSTRAPPED, [ComponentInternalsImpl.prototype.bootstrap])
	.withTransition(ComponentStates.BOOTSTRAPPED, ComponentTransitions.VALIDATE, ComponentStates.VALIDATED, [ComponentInternalsImpl.prototype.validate])
	.withTransition(ComponentStates.BOOTSTRAPPED, ComponentTransitions.INIT, ComponentStates.READY, [ComponentInternalsImpl.prototype.initialize])
	.withTransition(ComponentStates.VALIDATED, ComponentTransitions.INIT, ComponentStates.READY, [ComponentInternalsImpl.prototype.initialize])
	.withTransition(ComponentStates.READY, ComponentTransitions.MOUNT, ComponentStates.MOUNTED, [ComponentInternalsImpl.prototype.onMount])
	.withTransition(ComponentStates.MOUNTED, ComponentTransitions.UNMOUNT, ComponentStates.UNMOUNTED, [ComponentInternalsImpl.prototype.onUnmount])
	.withTransition(ComponentStates.UNMOUNTED, ComponentTransitions.MOUNT, ComponentStates.MOUNTED, [ComponentInternalsImpl.prototype.onRemount])
	.build();

export default ComponentInternalsImpl;
