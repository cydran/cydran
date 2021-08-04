import Module from "module/Module";
import ModulesContextImpl from "module/ModulesContextImpl";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import Messagable from "interface/ables/Messagable";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Region from "element/Region";
import RegionImpl from "element/RegionImpl";
import ScopeImpl from "scope/ScopeImpl";
import ElementMediator from "mediator/ElementMediator";
import InternalComponentOptions from "component/InternalComponentOptions";
import SimpleMap from "interface/SimpleMap";
import ModelMediator from "mediator/ModelMediator";
import ModelMediatorImpl from "mediator/ModelMediatorImpl";
import Renderer from "element/Renderer";
import AttributeExtractor from "element/AttributeExtractor";
import Digester from "digest/Digester";
import DigesterImpl from "digest/DigesterImpl";
import IdGenerator from "util/IdGenerator";
import DEFAULT_COMPONENT_OPTIONS from "component/DefaultComponentOptions";
import AttributeExtractorImpl from "element/AttributeExtractorImpl";
import Events from "const/EventsFields";
import StringRendererImpl from "element/render/StringRendererImpl";
import IdentityRendererImpl from "element/render/IdentityRendererImpl";
import Getter from "mediator/Getter";
import PropertyKeys from "const/PropertyKeys";
import MediatorSource from "mediator/MediatorSource";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";
import NamedElementOperations from "element/NamedElementOperations";
import NamedElementOperationsImpl from "element/NamedElementOperationsImpl";
import Scope from "scope/Scope";
import MachineContext from "machine/MachineContext";
import PubSub from "message/PubSub";
import PubSubImpl from "message/PubSubImpl";
import stateMachineBuilder from "machine/StateMachineBuilder";
import Machine from "machine/Machine";
import { NO_OP_FN, EMPTY_OBJECT_FN } from "const/Functions";
import { ComponentInternals, Mvvm } from "internals/Shuttle";
import { isDefined, requireNotNull, merge, requireValid, equals, clone } from "util/Utils";
import { UnknownRegionError, TemplateError, ModuleAffinityError, UnknownElementError, SetComponentError } from "error/Errors";
import { NESTING_CHANGED, INTERNAL_CHANNEL_NAME, DEFAULT_CLONE_DEPTH, MODULE_FIELD_NAME, DEFAULT_EQUALS_DEPTH, VALID_ID, ANONYMOUS_REGION_PREFIX } from "Constants";
import DomWalker from "element/DomWalker";
import MvvmDomWalkerImpl from "internals/MvvmDomWalkerImpl";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import ElementMediators from "component/ElementMediators";
import ElementMediatorsImpl from "component/ElementMediatorsImpl";
import ComponentTransition from "component/ComponentTransitions";
import ComponentState from "machine/states/ComponentState";
import ComponentTransitions from "component/ComponentTransitions";

const WALKER: DomWalker<Mvvm> = new MvvmDomWalkerImpl();

class ComponentInternalsImpl implements ComponentInternals, Mvvm, Tellable {

	private id: string;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private parent: Nestable;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private options: InternalComponentOptions;

	private parentSeen: boolean;

	private renderer: Renderer;

	private context: MachineContext<ComponentInternalsImpl>;

	private elementMediators: ElementMediators;

	private mediators: ModelMediatorImpl<any>[];

	private propagatingElementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private components: Nestable[];

	private namedElements: SimpleMap<HTMLElement>;

	private regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region;

	private modelFn: () => any;

	private itemFn: () => any;

	private digester: Digester;

	private anonymousRegionNameIndex: number;

	private extractor: AttributeExtractor;

	private cloneDepth: number;

	private equalsDepth: number;

	private mediatorsInitialized: boolean;

	private maxEvaluations: number;

	private regions: AdvancedMap<Region>;

	private validated: boolean;

	constructor(component: Nestable, template: string | HTMLElement | Renderer, options: InternalComponentOptions) {
		requireNotNull(template, "template");
		this.component = requireNotNull(component, "component");
		this.options = options;
		this.context = COMPONENT_MACHINE.create(this);
		this.tell(ComponentTransition.BOOTSTRAP);
		this.initFields();
		this.initRenderer(template);

		if (this.validated) {
			this.tell(ComponentTransition.VALIDATE);
		}

		this.tell(ComponentTransition.INIT);
	}

	public validate(): void {
		const moduleInstance: Module = this.getModule();

		if (!isDefined(moduleInstance)) {
			if (ModulesContextImpl.getInstances().length === 0) {
				throw new ModuleAffinityError(`Component ${this.component.constructor.name} does not have affinity with a module and no stages are active.  Unable to determine component affinity`);
			}

			if (ModulesContextImpl.getInstances().length > 1) {
				throw new ModuleAffinityError(`Component ${this.component.constructor.name} does not have affinity with a module and multiple stages are active.  Unable to determine component affinity`);
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
		this.initScope();
		this.pubSub = new PubSubImpl(this.component, this.getModule());
		this.digester = new DigesterImpl(this, this.id, () => this.component.constructor.name, () => this.components, this.maxEvaluations);
	}

	public init(): void {
		this.render();
		this.regionAddFn = (name: string, element: HTMLElement, locked: boolean) => this.addRegion(name, element, locked);
		this.validateEl();
		WALKER.walk(this.el, this);

		if (isDefined(this.options.skipId)) {
			this.skipId(this.options.skipId);
		}

		this.regions.each((region) => (region as RegionImpl).populate());

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

		if (this.parentSeen) {
			this.digest();
		}
	}

	public digest(): void {
		// TODO - Revisit this
		if (!this.mediatorsInitialized || this.elementMediators.isPopulated()) {
			this.elementMediators.tell("populate");
			this.mediatorsInitialized = true;
		}

		if (this.isRepeatable()) {
			this.parent.tell("digest");
		} else {
			this.digester.digest();
		}
	}

	public onMount(): void {
		this.getLogger().info("Mounted");
		this.pubSub.enableGlobal();
		this.init();
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellElementMediators(ComponentTransitions.MOUNT);
	}

	public onUnmount(): void {
		this.getLogger().info("Unmount");
		this.pubSub.disableGlobal();
		this.tellChildren(ComponentTransitions.UNMOUNT);
		this.tellElementMediators(ComponentTransitions.UNMOUNT);
	}

	public onRemount(): void {
		this.getLogger().info("Remount");
		this.pubSub.enableGlobal();
		this.tellChildren(ComponentTransitions.MOUNT);
		this.tellElementMediators(ComponentTransitions.MOUNT);
	}

	public evaluate<T>(expression: string): T {
		return new Getter<T>(expression).get(this.getScope() as ScopeImpl) as T;
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
		this.broadcastGlobally(INTERNAL_CHANNEL_NAME, Events.COMPONENT_NESTING_CHANGED);
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
			case "setMode":
				switch (payload) {
					case "repeatable":
						this.options.repeatable = true;
						break;

					default:
						this.options.repeatable = false;
				}
				break;

			case "consumeRegionDigestionCandidates":
				this.regions.each((region) => {
					if (region.hasExpression() && region.hasComponent()) {
						region.getComponent().tell("consumeDigestionCandidates", payload);
					}
				});

				break;

			case "consumeDigestionCandidates":
				(payload as MediatorSource[]).push(this);
				break;

			case NESTING_CHANGED:
				this.nestingChanged();
				break;

			case "digest":
				this.digest();
				break;

			case "setParent":
				this.setParent(payload as Nestable);
				break;

			case "skipId":
				this.skipId(payload as string);
				break;

			case "setItemFn":
				this.setItemFn(payload);
				break;

			case "requestMediatorSources":
				this.requestMediatorSources(payload);
				break;

			case "requestMediators":
				this.requestMediators(payload);
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

	public isRepeatable(): boolean {
		return this.options.repeatable;
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

	public forElement<E extends HTMLElement>(name: string): NamedElementOperations<E> {
		requireNotNull(name, "name");
		const element: E = this.getNamedElement(name) as E;

		if (!isDefined(element)) {
			throw new UnknownElementError(`Unknown element: ${name}`);
		}

		return new NamedElementOperationsImpl<E>(element);
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getModule(): Module {
		return this.component[MODULE_FIELD_NAME] as Module;
	}

	public setItemFn(itemFn: () => any): void {
		this.options.itemFn = isDefined(itemFn) ? itemFn : EMPTY_OBJECT_FN;
	}

	public getData(): any {
		return this.options.itemFn();
	}

	public getId(): string {
		return this.id;
	}

	public getWatchContext(): any {
		return this.getScope();
	}

	public $dispose(): void {
		this.elementMediators.$dispose();
		this.components = [];

		for (const component of this.components) {
			component.$dispose();
		}

		this.parent = null;
		this.namedElements = null;
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_DISPOSE, {});
		this.pubSub.$dispose();
		this.scope = null;
		this.regions.clear();
	}

	public getNamedElement<E extends HTMLElement>(name: string): E {
		const element: E = this.namedElements[name] as E;
		return element === undefined ? null : element;
	}

	public mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(
			this.component,
			expression,
			this.scope,
			reducerFn,
			(value: any) => clone(this.cloneDepth, value),
			(first: any, second: any) => equals(this.equalsDepth, first, second)
		);
		this.mediators.push(mediator as ModelMediatorImpl<any>);

		return mediator;
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		consumer.add(this.getId(), this.mediators);
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		if (this.isRepeatable()) {
			if (isDefined(this.getParent())) {
				this.getParent().tell("consumeDigestionCandidates", sources);
			}
		}

		this.tell("consumeRegionDigestionCandidates", sources);

		for (const source of this.propagatingElementMediators) {
			sources.push(source);
		}
	}

	public getExtractor(): AttributeExtractor {
		return this.extractor;
	}

	public getModelFn(): () => any {
		return this.modelFn;
	}

	public getItemFn(): () => any {
		return this.itemFn;
	}

	public skipId(id: string): void {
		this.digester.skipId(id);
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

	public addRegion(name: string, element: HTMLElement, locked: boolean): Region {
		return this.regions.computeIfAbsent(name, (key: string) => new RegionImpl(name, this, element, locked));
	}

	public createRegionName(): string {
		const name: string = ANONYMOUS_REGION_PREFIX + this.anonymousRegionNameIndex;
		++this.anonymousRegionNameIndex;

		return name;
	}

	public addMediator(mediator: any): void {
		this.elementMediators.add(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public addPropagatingElementMediator(mediator: any): void {
		this.propagatingElementMediators.push(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public addNamedElement(name: string, element: HTMLElement): void {
		this.namedElements[name] = element;
	}

	protected getOptions(): InternalComponentOptions {
		return this.options;
	}

	protected getRegion(name: string): Region {
		return this.regions.get(name);
	}

	protected render(): void {
		this.el = this.renderer.render();

		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Component template must not use a script tag as top-level element in component " + this.component.constructor.name);
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
		this.id = IdGenerator.INSTANCE.generate();
		this.logger = LoggerFactory.getLogger(`${this.component.constructor.name} Component ${this.id}`);
		this.regions = new AdvancedMapImpl<Region>();
		this.anonymousRegionNameIndex = 0;
		this.propagatingElementMediators = [];
		this.elementMediators = new ElementMediatorsImpl();
		this.namedElements = {};
		this.mediators = [];
		this.parentSeen = false;
		this.parent = null;
		this.components = [];
		this.renderer = null;
		this.extractor = new AttributeExtractorImpl(this.options.prefix);
		this.mediatorsInitialized = false;
		this.scope = new ScopeImpl();
	}

	private initRenderer(template: string | HTMLElement | Renderer): void {
		const templateType: string = typeof template;

		if (templateType === "string") {
			this.renderer = new StringRendererImpl(template as string);
		} else if (templateType === "object" && isDefined(template["render"] && typeof template["render"] === "function")) {
			this.renderer = template as Renderer;
		} else if (template instanceof HTMLElement) {
			// TODO - Correctly check for HTMLElement
			this.renderer = new IdentityRendererImpl(template as HTMLElement);
		}

		if (!isDefined(this.renderer)) {
			throw new TemplateError(`Template must be a string, HTMLElement or Renderer - ${templateType}`);
		}
	}

	private initProperties(): void {
		this.validated = !this.getModule().getProperties().isTruthy(PropertyKeys.CYDRAN_PRODUCTION_ENABLED);
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
		this.regions.each((region) => (region as unknown as Tellable).tell(name, payload));
	}

	private tellElementMediators(name: string, payload?: any): void {
		this.elementMediators.tell(name, payload);
	}

	private messageChildren(channelName: string, messageName: string, payload?: any): void {
		this.regions.each((region) => region.message(channelName, messageName, payload));
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

		if (parentAdded && parent.isMounted()) {
			this.tell(ComponentTransition.MOUNT);
		} else if (parentRemoved) {
			this.tell(ComponentTransition.UNMOUNT);
		} else if (changed) {
			this.tell(ComponentTransition.UNMOUNT);

			if (parent.isMounted()) {
				this.tell(ComponentTransition.MOUNT);
			}
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

		this.elementMediators.tell(NESTING_CHANGED);

		for (const component of this.components) {
			component.tell(NESTING_CHANGED);
		}

		this.tellChildren(NESTING_CHANGED);
	}

	private bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
		return isDefined(first) && isDefined(second) && first.getId() !== second.getId();
	}

	private exactlyOneDefined(first: any, second: any): boolean {
		return isDefined(first) ? !isDefined(second) : isDefined(second);
	}

}

const COMPONENT_MACHINE: Machine<ComponentInternalsImpl> = stateMachineBuilder<ComponentInternalsImpl>(ComponentState.UNINITIALIZED)
	.withState(ComponentState.UNINITIALIZED, [])
	.withState(ComponentState.BOOTSTRAPPED, [])
	.withState(ComponentState.VALIDATED, [])
	.withState(ComponentState.READY, [])
	.withState(ComponentState.MOUNTED, [])
	.withState(ComponentState.UNMOUNTED, [])
	.withState(ComponentState.DISPOSED, [])
	.withTransition(ComponentState.UNINITIALIZED, ComponentTransition.BOOTSTRAP, ComponentState.BOOTSTRAPPED, [ComponentInternalsImpl.prototype.bootstrap])
	.withTransition(ComponentState.BOOTSTRAPPED, ComponentTransition.VALIDATE, ComponentState.VALIDATED, [ComponentInternalsImpl.prototype.validate])
	.withTransition(ComponentState.BOOTSTRAPPED, ComponentTransition.INIT, ComponentState.READY, [ComponentInternalsImpl.prototype.initialize])
	.withTransition(ComponentState.VALIDATED, ComponentTransition.INIT, ComponentState.READY, [ComponentInternalsImpl.prototype.initialize])
	.withTransition(ComponentState.READY, ComponentTransition.DISPOSE, ComponentState.DISPOSED, [ComponentInternalsImpl.prototype.$dispose])
	.withTransition(ComponentState.READY, ComponentTransition.MOUNT, ComponentState.MOUNTED, [ComponentInternalsImpl.prototype.onMount])
	.withTransition(ComponentState.MOUNTED, ComponentTransition.UNMOUNT, ComponentState.UNMOUNTED, [ComponentInternalsImpl.prototype.onUnmount])
	.withTransition(ComponentState.UNMOUNTED, ComponentTransition.MOUNT, ComponentState.MOUNTED, [ComponentInternalsImpl.prototype.onRemount])
	.withTransition(ComponentState.UNMOUNTED, ComponentTransition.DISPOSE, ComponentState.DISPOSED, [ComponentInternalsImpl.prototype.$dispose])
	.build();

export default ComponentInternalsImpl;
