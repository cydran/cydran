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
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import InternalComponentOptions from "component/InternalComponentOptions";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Machine from "machine/Machine";
import MachineState from "machine/MachineState";
import Mediator from "mediator/Mediator";
import MediatorImpl from "mediator/MediatorImpl";
import Messagable from "interface/ables/Messagable";
import PropertyKeys from "const/PropertyKeys";
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
import { INTERNAL_CHANNEL_NAME, DEFAULT_CLONE_DEPTH, DEFAULT_EQUALS_DEPTH, VALID_ID, ANONYMOUS_REGION_PREFIX } from "Constants";
import { EMPTY_OBJECT_FN } from "const/Functions";
import { UnknownRegionError, TemplateError, UnknownElementError, SetComponentError, ValidationError, UndefinedContextError, ContextUnavailableError } from "error/Errors";
import { isDefined, requireNotNull, merge, requireValid, equals, clone, extractClassName, defaulted } from 'util/Utils';
import TagNames from "const/TagNames";
import RegionBehavior from "behavior/core/RegionBehavior";
import MediatorTransitions from "mediator/MediatorTransitions";
import InternalBehaviorFlags from "behavior/InternalBehaviorFlags";
import DigestionActions from "const/DigestionActions";
import JSType from "const/JSType";
import FormOperations from "component/FormOperations";
import FormOperationsImpl from "component/FormOperationsImpl";
import MultipleFormOperationsImpl from "component/MultipleFormOperationsImpl";
import { FilterBuilder } from "filter/Filter";
import FilterBuilderImpl from "filter/FilterBuilderImpl";
import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import WatcherImpl from "digest/WatcherImpl";
import Invoker from "mediator/Invoker";
import ActionContinuationImpl from "continuation/ActionContinuationImpl";
import { ActionContinuation, Nestable } from "interface/ComponentInterfaces";
import Actionable from "interface/ables/Actionable";
import Intervals from "interval/Intervals";
import IntervalsImpl from "interval/IntervalsImpl";
import { IdGenerator } from "util/IdGenerator";
import DigesterImpl from "digest/DigesterImpl";
import { Context } from "context/Context";
import DomWalker from 'component/DomWalker';
import GlobalContextHolder from "context/GlobalContextHolder";

const VALID_PREFIX_REGEX: RegExp = /^([a-z]+\-)*[a-z]+$/;

class ComponentInternalsImpl implements ComponentInternals, Tellable {

	private id: string;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private parent: Nestable;

	private pubSub: PubSubImpl;

	private scope: ScopeImpl;

	private options: InternalComponentOptions;

	private renderer: Renderer;

	private machineState: MachineState<ComponentInternalsImpl>;

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

	private invoker: Invoker;

	private intervals: Intervals;

	private context: Context;

	constructor(component: Nestable, template: string | HTMLElement | Renderer, options: InternalComponentOptions) {
		this.template = requireNotNull(template, TagNames.TEMPLATE);
		this.context = null;
		this.component = requireNotNull(component, "component");
		this.options = options;
		this.machineState = COMPONENT_MACHINE.create(this);
	}

	public getStyles(): string {
		return defaulted(this.options.styles, "");
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().message(channelName, messageName, payload);
	}

	public sendToParent(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendToParent(channelName, messageName, payload);
	}

	public sendToParents(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendToParents(channelName, messageName, payload);
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendToRoot(channelName, messageName, payload);
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendToImmediateChildren(channelName, messageName, payload);
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendToDescendants(channelName, messageName, payload);
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getMessagingContext().sendGlobally(channelName, messageName, payload);
	}

	public isMounted(): boolean {
		return this.machineState.isState(ComponentStates.MOUNTED);
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

		this.id = IdGenerator.generate();
		this.logger = LoggerFactory.getLogger(`Component[${ this.getName() }] ${ this.id }`);

		if (!isDefined(this.options.name) || this.options.name.trim().length === 0) {
			this.options.name = extractClassName(this.component);
		}

		this.initFields();
		this.initRenderer();
		this.render();
		this.validateEl();
		const walker: DomWalker<ComponentInternals> = this.getObject("cydran:domWalker");
		walker.walk(this.el, this);
	}

	public isValidated(): boolean {
		return this.validated;
	}

	public initialize(): void {
		this.initProperties();
		this.initScope();
		this.invoker = new Invoker(this.scope);
		this.pubSub.setContext(this.getContext());
		this.digester = DigesterImpl.create(this, this.id, extractClassName(this.component), this.maxEvaluations);
		this.init();
	}

	public init(): void {
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

	public sync(): void {
		if (this.isMounted()) {
			this.digest();
		}
	}

	public digest(): void {
		this.digester.digest();
	}

	public onMount(): void {
		this.behaviors.setContext(this.getContext());
		this.component.onMount();
		this.pubSub.setContext(this.getContext());
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellBehaviors(ComponentTransitions.MOUNT);
		this.tellMediators(MediatorTransitions.MOUNT);
		this.intervals.enable();
	}

	public onUnmount(): void {
		this.behaviors.setContext(null);
		this.component.onUnmount();
		this.pubSub.setContext(null);
		this.tellChildren(ComponentTransitions.UNMOUNT);
		this.tellBehaviors(ComponentTransitions.UNMOUNT);
		this.tellMediators(MediatorTransitions.UNMOUNT);
		this.intervals.disable();
	}

	public onRemount(): void {
		this.behaviors.setContext(this.getContext());
		this.component.onRemount();
		this.pubSub.setContext(this.getContext());
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellBehaviors(ComponentTransitions.MOUNT);
		this.tellMediators(MediatorTransitions.MOUNT);
		this.digest();
		this.intervals.enable();
	}

	public evaluate<T>(expression: string): T {
		const getterLogger: Logger = LoggerFactory.getLogger(`Getter: ${ expression }`);

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
		requireNotNull(componentId, "componentId");

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError(`Region '${name}' is unknown and must be declared in component template.`);
		}

		let component: Nestable = this.getObject(componentId);

		if (!component && defaultComponentName) {
			component = this.getObject(defaultComponentName);
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

			case "setContext":
				this.setContext(payload as Context);
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
				COMPONENT_MACHINE.submit(name, this.machineState, payload);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		this.pubSub.message(channelName, messageName, payload);
	}

	public getEl(): HTMLElement {
		return this.el;
	}

	public getComponent(): Nestable {
		return this.component;
	}

	public getObject<T>(id: string): T {
		requireNotNull(id, "id");

		return this.getObjectContext().getObject(id);
	}

	public getPrefix(): string {
		return this.options.prefix;
	}

	public isConnected(): boolean {
		return (this.options.alwaysConnected || (this.parent !== null && this.parent !== undefined && this.parent.$c().isConnected()));
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch<T>(expression: string, callback: (previous: T, current: T) => void, reducerFn?: (input: any) => T, targetThis?: any): void {
		requireNotNull(expression, "expression");
		requireNotNull(callback, "callback");
		const actualTargetThis: any = isDefined(targetThis) ? targetThis : this.component;
		this.mediate(expression, reducerFn).watch(actualTargetThis, callback);
	}

	public on(callback: (payload: any) => void, messageName: string, channel?: string): void {
		this.pubSub.on(messageName).forChannel(channel || INTERNAL_CHANNEL_NAME).invoke((payload: any) => {
			callback.apply(this.component, [payload]);
			this.sync();
		});
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

	public getContext(): Context {
		return this.context;
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

	public getWatchScope(): any {
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
		try {
			this.invoker.invoke(expression, params);
			this.digest();
		} catch (e) {
			this.logger.ifError(() => `\n(${e.name}) thrown invoking behavior expression: ${expression}\n\nMessage: ${e.message}`, e);
		}
	}

	public mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T> {
		const mediator: Mediator<T> = new MediatorImpl<T>(
			expression,
			this.scope,
			reducerFn,
			(value: any) => clone(this.cloneDepth, value),
			(first: any, second: any) => equals(this.equalsDepth, first, second)
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
			sources.push(this.parent.$c());
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

	public getMessagables(): Actionable<Messagable>[] {
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

	public withFilter(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression, LoggerFactory.getLogger(`Watcher: ${ expression }`));
		return new FilterBuilderImpl(watchable, watcher);
	}

	public $c(): ActionContinuation {
		return new ActionContinuationImpl(this.component, this);
	}

	public addInterval(callback: () => void, delay?: number): void {
		this.intervals.add(callback, delay);
	}

	public postConstruct(): void {
		this.tell(ComponentTransitions.BOOTSTRAP);
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

	private getMessagingContext(): Context {
		const context: Context = this.getContext();

		if (!isDefined(context)) {
			throw new ContextUnavailableError("Context is not available for messaging.");
		}

		return context;
	}

	private getObjectContext(): Context {
		return defaulted(this.getContext(), GlobalContextHolder.getContext());
	}

	private initScope(): void {
		const localModelFn: () => any = () => this.component;
		this.modelFn = isDefined(this.options.parentModelFn) ? this.options.parentModelFn : localModelFn;
		this.itemFn = () => this.getData();

		const parentScope: ScopeImpl = new ScopeImpl();
		parentScope.setParent(this.getContext().getScope() as ScopeImpl);
		this.scope.setParent(parentScope);
		this.scope.setMFn(this.modelFn);
		this.scope.setVFn(this.itemFn);
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
		this.intervals = new IntervalsImpl(this.component, () => this.sync());
		this.pubSub = new PubSubImpl(this.component, this.getContext());
	}

	private initRenderer(): void {
		const templateType: string = typeof this.template;

		if (templateType === JSType.STR) {
			this.renderer = new StringRendererImpl(this.template as string);
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
		this.validated = this.getContext().getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);
		const configuredCloneDepth: number = this.getContext().getProperties().get(PropertyKeys.CYDRAN_CLONE_MAX_EVALUATIONS);
		const configuredEqualsDepth: number = this.getContext().getProperties().get(PropertyKeys.CYDRAN_EQUALS_MAX_EVALUATIONS);
		this.maxEvaluations = this.getContext().getProperties().get(PropertyKeys.CYDRAN_DIGEST_MAX_EVALUATIONS);
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
		this.regions.each((region) => region.messageComponent(channelName, messageName, payload));
	}

	private messageBehaviors(channelName: string, messageName: string, payload?: any): void {
		this.behaviors.message(channelName, messageName, payload);
	}

	private messageSubordinates(channelName: string, messageName: string, payload?: any): void {
		this.messageBehaviors(channelName, messageName, payload);
		this.messageChildren(channelName, messageName, payload);
	}

	private setContext(context: Context): void {
		this.context = context;
	}

	private setParent(parent: Nestable): void {
		const changed: boolean = this.bothPresentButDifferent(parent, this.parent) || this.exactlyOneDefined(parent, this.parent);
		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);
		this.messageInternalIf(parentAdded, Events.BEFORE_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.BEFORE_PARENT_REMOVED, {});
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;

		if (parentAdded && parent.$c().isMounted()) {
			this.tell(ComponentTransitions.MOUNT);
		} else if (parentRemoved) {
			this.tell(ComponentTransitions.UNMOUNT);
		} else if (changed) {
			this.tell(ComponentTransitions.UNMOUNT);

			if (parent.$c().isMounted()) {
				this.tell(ComponentTransitions.MOUNT);
			}
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});
		this.messageInternalIf(parentAdded, Events.AFTER_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.AFTER_PARENT_REMOVED, {});
	}

	private bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
		return isDefined(first) && isDefined(second) && first.$c().getId() !== second.$c().getId();
	}

	private exactlyOneDefined(first: any, second: any): boolean {
		return isDefined(first) ? !isDefined(second) : isDefined(second);
	}

}

// -----------------------------------------------------
// -- To Review
// -----------------------------------------------------



// -----------------------------------------------------

const COMPONENT_MACHINE: Machine<ComponentInternalsImpl> = stateMachineBuilder<ComponentInternalsImpl>(ComponentStates.UNINITIALIZED)
	.withState(ComponentStates.UNINITIALIZED, [])
	.withState(ComponentStates.BOOTSTRAPPED, [])
	.withState(ComponentStates.READY, [])
	.withState(ComponentStates.MOUNTED, [])
	.withState(ComponentStates.UNMOUNTED, [])
	.withTransition(ComponentStates.UNINITIALIZED, ComponentTransitions.BOOTSTRAP, ComponentStates.BOOTSTRAPPED, [ComponentInternalsImpl.prototype.bootstrap])
	.withTransition(ComponentStates.BOOTSTRAPPED, ComponentTransitions.INIT, ComponentStates.READY, [ComponentInternalsImpl.prototype.initialize])
	.withTransition(ComponentStates.READY, ComponentTransitions.MOUNT, ComponentStates.MOUNTED, [ComponentInternalsImpl.prototype.onMount])
	.withTransition(ComponentStates.MOUNTED, ComponentTransitions.UNMOUNT, ComponentStates.UNMOUNTED, [ComponentInternalsImpl.prototype.onUnmount])
	.withTransition(ComponentStates.UNMOUNTED, ComponentTransitions.MOUNT, ComponentStates.MOUNTED, [ComponentInternalsImpl.prototype.onRemount])
	.build();

export default ComponentInternalsImpl;
