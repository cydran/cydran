import Behavior from 'behavior/Behavior';
import Context from 'context/Context';
import { Nestable } from 'interface/ComponentInterfaces';
import Type from 'interface/Type';
import Scope from 'scope/Scope';
import StageInternals from 'stage/StageInternals';
import Stage from './Stage';
import { requireNotNull } from 'util/Utils';

class StageInternalsImpl implements StageInternals {

	private internals: StageInternals;

	private rootSelector: string;

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private properties: MutableProperties;

	private scope: ScopeImpl;

	private registry: Registry;

	private machineState: MachineState<StageImpl>;

	private parent: GlobalContext;

	private context: Context;

	private logger: Logger;

	constructor(context: Context) {
		this.context = requireNotNull(context, "context");
	}


	constructor(parent: GlobalContext, rootSelector: string, properties: SimpleMap<any> = {}) {
		this.parent = requireNotNull(parent, "parent");
		const windowInstance: Window = properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW];
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.machineState = CONTEXT_MACHINE.create(this);
		this.registry = this.parent.getRegistry().extend(this);

		this.properties = this.parent.getProperties()
			.extend()
			.load(properties);

		this.scope = this.parent.getScope().extend() as ScopeImpl;
		this.transitionTo(ContextTransitions.BOOTSTRAP);
	}


	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.context.registerBehavior(name, supportedTags, behaviorClass);
	}

	public registerBehaviorFunction(name: string,
									supportedTags: string[],
									behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.context.registerBehaviorFunction(name, supportedTags, behaviorFunction);
	}

	public getContext(): Context {
		return this.internals.getContext();
	}

	private transitionTo(transition: ContextTransitions): void {
		CONTEXT_MACHINE.submit(transition, this.machineState);
	}

	public getParent(): Context {
		return this.context;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public getRegistry(): Registry {
		return this.registry;
	}

	public addComponentBefore(component: Nestable): Stage {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentBefore", component);

		return this;
	}

	public addComponentAfter(component: Nestable): Stage {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentAfter", component);

		return this;
	}

	public start(): Stage {
		this.transitionTo(ContextTransitions.START);

		return this;
	}

	public setComponent(component: Nestable): Stage {
		if (isDefined(component)) {
			this.logger.ifTrace(() => `Set component: ${extractClassName(component)}`);
		}

		this.root.$c().regions().set("body", component);

		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.logger.ifInfo(() => `Set component from registry: ${ componentName }`);
		this.root.$c().regions().setFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public $dispose(): void {
		this.transitionTo(ContextTransitions.DISPOSE);
		this.transitionTo(ContextTransitions.DISPOSAL_COMPLETE);
	}

	public isStarted(): boolean {
		return this.machineState.getState() === ContextStates.READY;
	}

	public onBootstrap(): void {
		LoggerFactory.init(this.properties);
		this.root = null;
		this.addPreInitializer(behaviorsPreinitializer);
		this.addDisposer((stage: Stage) => {
			stage.sendGlobally(CYDRAN_PUBLIC_CHANNEL, Events.CYDRAN_PREAPP_DISPOSAL);
			this.$dispose();
		});
	}

	public onStart(): void {
		Factories.importFactories(this.getProperties());
		this.logger.ifTrace(() => "Start Requested");
		this.logger.ifDebug(() => "Cydran Starting");
		this.logger.ifDebug(() => "Running preInitializers");
		this.runPreInitializers();
		this.publishMode();

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS)) {
			this.domReady();
		} else {
			DomUtils.onReady(this.domReady, this);
		}
	}

	public onStarted(): void {
		this.logger.ifInfo(() => "Already Started");
	}

	public onDomReady(): void {
		this.logger.ifInfo(() => "DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new StageComponent(renderer);
		this.root.$c().tell("setContext", this);
		this.root.$c().tell("setParent", null);
		this.root.$c().tell(ComponentTransitions.INIT);
		this.root.$c().tell(ComponentTransitions.MOUNT);

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
			new Styles(DomUtils.getDocument().head).add();
		}

		this.logger.ifDebug(() => "Running initializers");
		this.runInitializers();
		this.logger.ifInfo(() => "Adding event listeners");

		DomUtils.getWindow().addEventListener("beforeunload", () => {
			this.$dispose();
		});

		this.logger.ifInfo(() => "Startup Complete");
	}

	public onDisposing(): void {
		this.root.$c().tell(ComponentTransitions.UNMOUNT);

		// TODO - Implement
	}

	public onDisposed(): void {
		// TODO - Implement
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------

	private workingContextName(contextName: string): string {
		const retval = contextName || DEFAULT_CONTEXT_KEY;
		return retval;
	}

	private domReady(): void {
		this.completeStartup();
	}

	private publishMode(): void {
		const isStrict: boolean = this.getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);

		const modeLabel: string = isStrict ? CydranMode.STRICT : CydranMode.LAZY;
		let extra: string = "";

		if (isStrict) {
			extra = `${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_STARTPHRASE) } - ${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_MESSAGE) }`;
		} else {
			extra = this.getProperties().getAsString(PropertyKeys.CYDRAN_LAZY_STARTPHRASE);
		}

		this.logger.ifInfo(() => `MODE: ${ modeLabel.toUpperCase() } - ${ extra }`);
	}

	private completeStartup(): void {
		this.transitionTo(ContextTransitions.DOMREADY);
	}

	addComponentBefore(component: Nestable): Stage {
		throw new Error('Method not implemented.');
	}

	addComponentAfter(component: Nestable): Stage {
		throw new Error('Method not implemented.');
	}

	setComponent(component: Nestable): Stage {
		throw new Error('Method not implemented.');
	}

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void {
		throw new Error('Method not implemented.');
	}

	start(): Stage {
		throw new Error('Method not implemented.');
	}

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		throw new Error('Method not implemented.');
	}

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		throw new Error('Method not implemented.');
	}

	getScope(): Scope {
		throw new Error('Method not implemented.');
	}

	isStarted(): boolean {
		throw new Error('Method not implemented.');
	}

	getContext(): Context {
		return this.context;
	}

	$dispose(): void {
		throw new Error('Method not implemented.');
	}

}

const CONTEXT_MACHINE: Machine<StageImpl> = stateMachineBuilder<StageImpl>(ContextStates.UNINITIALIZED)
	.withState(ContextStates.UNINITIALIZED, [])
	.withState(ContextStates.BOOTSTRAPPED, [])
	.withState(ContextStates.STARTING, [])
	.withState(ContextStates.READY, [])
	.withState(ContextStates.DISPOSING, [])
	.withState(ContextStates.DISPOSED, [])
	.withTransition(ContextStates.UNINITIALIZED, ContextTransitions.BOOTSTRAP, ContextStates.BOOTSTRAPPED, [StageImpl.prototype.onBootstrap])
	.withTransition(ContextStates.BOOTSTRAPPED, ContextTransitions.START, ContextStates.STARTING, [StageImpl.prototype.onStart])
	.withTransition(ContextStates.STARTING, ContextTransitions.DOMREADY, ContextStates.READY, [StageImpl.prototype.onDomReady])
	.withTransition(ContextStates.STARTING, ContextTransitions.START, ContextStates.STARTING, [StageImpl.prototype.onStarted])
	.withTransition(ContextStates.READY, ContextTransitions.START, ContextStates.READY, [StageImpl.prototype.onStarted])
	.withTransition(ContextStates.READY, ContextTransitions.DISPOSE, ContextStates.DISPOSING, [StageImpl.prototype.onDisposing])
	.withTransition(ContextStates.DISPOSING, ContextTransitions.DISPOSAL_COMPLETE, ContextStates.DISPOSED, [StageImpl.prototype.onDisposed])
	.build();

export default StageInternalsImpl;
