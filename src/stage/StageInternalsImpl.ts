import Behavior from 'behavior/Behavior';
import { Context } from 'context/Context';
import { Nestable } from 'interface/ComponentInterfaces';
import Type from 'interface/Type';
import Scope from 'scope/Scope';
import StageInternals from 'stage/StageInternals';
import Stage from 'stage/StageImpl';
import { extractClassName, isDefined, requireNotNull } from 'util/Utils';
import { GlobalContext } from 'context/GlobalContext';
import Component from 'component/Component';
import ComponentIdPair from 'component/CompnentIdPair';
import { MutableProperties } from 'properties/Property';
import ScopeImpl from 'scope/ScopeImpl';
import Registry from 'registry/Registry';
import MachineState from 'machine/MachineState';
import Logger from 'log/Logger';
import SimpleMap from 'interface/SimpleMap';
import PropertyKeys from 'const/PropertyKeys';
import ContextTransitions from 'component/ContextTransitions';
import CydranMode from 'const/CydranMode';
import ContextStates from 'component/ContextStates';
import LoggerFactory from 'log/LoggerFactory';
import DomUtils from 'dom/DomUtils';
import Factories from 'factory/Factories';
import stateMachineBuilder from 'machine/StateMachineBuilder';
import Machine from 'machine/Machine';
import { DEFAULT_CONTEXT_KEY } from 'const/HardValues';
import ComponentTransitions from 'component/ComponentTransitions';
import StageRendererImpl from 'component/renderer/StageRendererImpl';
import StageComponent from 'stage/StageComponent';
import Renderer from 'component/Renderer';
import Styles from 'style/Styles';
import behaviorsPreinitializer from 'behavior/core/behaviorsPreinitializer';
import Initializers from 'context/Initializers';
import InitializersImpl from 'context/InitializersImpl';

class StageInternalsImpl implements StageInternals {

	private rootSelector: string;

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private properties: MutableProperties;

	private scope: ScopeImpl;

	private registry: Registry;

	private machineState: MachineState<StageInternalsImpl>;

	private parent: GlobalContext;

	private context: Context;

	private logger: Logger;

	private initializers: Initializers<Stage>;

	private stage: Stage;

	constructor(context: Context, rootSelector: string, properties: SimpleMap<any> = {}) {
		this.stage = null;
		this.initializers = new InitializersImpl<Stage>();
		this.context = requireNotNull(context, "context");
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
		return this.context;
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

	public addComponentBefore(component: Nestable): void {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentBefore", component);
	}

	public addComponentAfter(component: Nestable): void {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentAfter", component);
	}

	public start(stage: Stage): void {
		this.stage = requireNotNull(stage, "stage");
		this.transitionTo(ContextTransitions.START);
	}

	public setComponent(component: Nestable): void {
		if (isDefined(component)) {
			this.logger.ifTrace(() => `Set component: ${extractClassName(component)}`);
		}

		this.root.$c().regions().set("body", component);
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): void {
		requireNotNull(componentName, "componentName");
		this.logger.ifInfo(() => `Set component from registry: ${ componentName }`);
		this.root.$c().regions().setFromRegistry("body", componentName, defaultComponentName);
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
		this.addInitializer(behaviorsPreinitializer);
	}

	public onStart(): void {
		Factories.importFactories(this.getProperties());
		this.logger.ifTrace(() => "Start Requested");
		this.logger.ifDebug(() => "Cydran Starting");
		this.logger.ifDebug(() => "Running preInitializers");
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

	public addInitializer(callback: (context? : Stage) => void): void {
		this.initializers.add(callback);
	}

	public onDisposing(): void {
		this.root.$c().tell(ComponentTransitions.UNMOUNT);

		// TODO - Implement
	}

	public onDisposed(): void {
		// TODO - Implement
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------

	private runInitializers(): void {
		this.initializers.execute(this.stage);
	}

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

}

const CONTEXT_MACHINE: Machine<StageInternalsImpl> = stateMachineBuilder<StageInternalsImpl>(ContextStates.UNINITIALIZED)
	.withState(ContextStates.UNINITIALIZED, [])
	.withState(ContextStates.BOOTSTRAPPED, [])
	.withState(ContextStates.STARTING, [])
	.withState(ContextStates.READY, [])
	.withState(ContextStates.DISPOSING, [])
	.withState(ContextStates.DISPOSED, [])
	.withTransition(ContextStates.UNINITIALIZED, ContextTransitions.BOOTSTRAP, ContextStates.BOOTSTRAPPED, [StageInternalsImpl.prototype.onBootstrap])
	.withTransition(ContextStates.BOOTSTRAPPED, ContextTransitions.START, ContextStates.STARTING, [StageInternalsImpl.prototype.onStart])
	.withTransition(ContextStates.STARTING, ContextTransitions.DOMREADY, ContextStates.READY, [StageInternalsImpl.prototype.onDomReady])
	.withTransition(ContextStates.STARTING, ContextTransitions.START, ContextStates.STARTING, [StageInternalsImpl.prototype.onStarted])
	.withTransition(ContextStates.READY, ContextTransitions.START, ContextStates.READY, [StageInternalsImpl.prototype.onStarted])
	.withTransition(ContextStates.READY, ContextTransitions.DISPOSE, ContextStates.DISPOSING, [StageInternalsImpl.prototype.onDisposing])
	.withTransition(ContextStates.DISPOSING, ContextTransitions.DISPOSAL_COMPLETE, ContextStates.DISPOSED, [StageInternalsImpl.prototype.onDisposed])
	.build();

export default StageInternalsImpl;
