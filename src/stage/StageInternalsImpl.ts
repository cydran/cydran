import { Context } from 'context/Context';
import { Nestable } from 'interface/ComponentInterfaces';
import StageInternals from 'stage/StageInternals';
import Stage from 'stage/StageImpl';
import { extractClassName, isDefined, requireNotNull } from 'util/Utils';
import Component from 'component/Component';
import ComponentIdPair from 'component/CompnentIdPair';
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
import Initializers from 'context/Initializers';
import InitializersImpl from 'context/InitializersImpl';

class StageInternalsImpl implements StageInternals {

	private rootSelector: string;

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private machineState: MachineState<StageInternalsImpl>;

	private context: Context;

	private logger: Logger;

	private initializers: Initializers<Stage>;

	private stage: Stage;

	constructor(context: Context, logger: Logger, stage: Stage, rootSelector: string, properties: SimpleMap<any> = {}) {
		this.logger = requireNotNull(logger, "logger");
		this.stage = requireNotNull(stage, "stage");
		this.initializers = new InitializersImpl<Stage>();
		this.context = requireNotNull(context, "context");
		const windowInstance: Window = properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW];
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.machineState = CONTEXT_MACHINE.create(this);
		this.context.getProperties().load(properties);
		this.context.getRegistry().registerConstant("cydran:stage", stage);
		this.transitionTo(ContextTransitions.BOOTSTRAP);
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

	public addComponentBefore(component: Nestable): void {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentBefore", component);
	}

	public addComponentAfter(component: Nestable): void {
		requireNotNull(component, "component");
		this.root.$c().tell("addComponentAfter", component);
	}

	public start(): void {
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
		LoggerFactory.init(this.getContext().getProperties());
		this.root = null;
	}

	public onStart(): void {
		Factories.importFactories(this.getContext().getProperties());
		this.logger.ifTrace(() => "Start Requested");
		this.logger.ifDebug(() => "Cydran Starting");
		this.logger.ifDebug(() => "Running preInitializers");
		this.publishMode();

		if (this.getContext().getProperties().isTruthy(PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS)) {
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

		if (this.getContext().getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
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
		const isStrict: boolean = this.getContext().getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);

		const modeLabel: string = isStrict ? CydranMode.STRICT : CydranMode.LAZY;
		let extra: string = "";

		if (isStrict) {
			extra = `${ this.getContext().getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_STARTPHRASE) } - ${ this.getContext().getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_MESSAGE) }`;
		} else {
			extra = this.getContext().getProperties().getAsString(PropertyKeys.CYDRAN_LAZY_STARTPHRASE);
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
