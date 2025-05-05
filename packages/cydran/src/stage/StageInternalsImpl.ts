import { Context, Nestable, SeriesOperations } from 'context/Context';
import StageInternals from 'stage/StageInternals';
import Stage from 'stage/StageImpl';
import { defaulted, extractClassName, isDefined, requireNotNull } from 'util/Utils';
import Component from 'component/Component';
import MachineState from 'machine/MachineState';
import Logger from 'log/Logger';
import SimpleMap from 'interface/SimpleMap';
import { CydranMode, PropertyKeys, Ids, STAGE_BODY_REGION_NAME, CYDRAN_PUBLIC_CHANNEL, Events, To, StageComponentSeries } from 'CydranConstants';
import ContextTransitions from 'component/ContextTransitions';
import ContextStates from 'component/ContextStates';
import DomUtils from 'dom/DomUtils';
import stateMachineBuilder from 'machine/StateMachineBuilder';
import Machine from 'machine/Machine';
import ComponentTransitions from 'component/ComponentTransitions';
import StageRendererImpl from 'component/renderer/StageRendererImpl';
import Renderer from 'component/Renderer';
import Styles from 'style/Styles';
import Initializers from 'context/Initializers';
import InitializersImpl from 'context/InitializersImpl';
import { MutableProperties } from 'properties/Property';

class StageInternalsImpl implements StageInternals {

	private rootSelector: string;

	private root: Component;

	private machineState: MachineState<StageInternalsImpl>;

	private context: Context;

	private logger: Logger;

	private initializers: Initializers<Stage>;

	private stage: Stage;

	constructor(context: Context, stage: Stage, rootSelector: string, properties: SimpleMap<unknown>, callback?: (context: Context) => void, thisObject?: Object) {
		this.context = requireNotNull(context, "context");
		this.stage = requireNotNull(stage, "stage");
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.initializers = new InitializersImpl<Stage>();
		this.machineState = CONTEXT_MACHINE.create(this);

		if (isDefined(callback)) {
			this.context.configure(callback, thisObject);
		}

		this.context.getProperties().load(defaulted(properties, {}));

		if (this.context.getProperties().includes(PropertyKeys.CYDRAN_OVERRIDE_WINDOW)) {
			const overrideWindow: Window = this.context.getProperties().get(PropertyKeys.CYDRAN_OVERRIDE_WINDOW);
			DomUtils.setWindow(overrideWindow);
		}
		
		this.logger = this.context.getObject("logger", Ids.STAGE_INTERNALS);
		this.root = null;
		this.transitionTo(ContextTransitions.BOOTSTRAP);
	}

	public before(): SeriesOperations {
		return this.root.$c().forSeries(StageComponentSeries.TOP);
	}

	public after(): SeriesOperations {
		return this.root.$c().forSeries(StageComponentSeries.BOTTOM);
	}

	public getContext(): Context {
		return this.context;
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

		this.root.$c().regions().set(STAGE_BODY_REGION_NAME, component);
	}

	public setComponentByObjectId(componentName: string, defaultComponentName?: string): void {
		requireNotNull(componentName, "componentName");
		this.logger.ifDebug(() => `Set component from registry: ${ componentName }`);
		this.root.$c().regions().setByObjectId(STAGE_BODY_REGION_NAME, componentName, defaultComponentName);
	}

	public $release(): void {
		this.transitionTo(ContextTransitions.DISPOSE);
		this.transitionTo(ContextTransitions.DISPOSAL_COMPLETE);
	}

	public isStarted(): boolean {
		return this.machineState.getState() === ContextStates.READY;
	}

	public onBootstrap(): void {
		// TODO  - Implement or remove this method
	}

	public onStart(): void {
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
		this.logger.ifDebug(() => "Already Started");
	}

	public onDomReady(): void {
		this.logger.ifDebug(() => "DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector);
		this.root = this.getContext().getObject(Ids.STAGE_COMPONENT, renderer);
		this.root.$c().tell("setParent", null);
		this.root.$c().tell(ComponentTransitions.INIT);
		this.root.$c().tell(ComponentTransitions.MOUNT);

		if (this.getContext().getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
			new Styles(DomUtils.getDocument().head).add();
		}

		this.logger.ifDebug(() => "Running initializers");
		this.runInitializers();

		this.logger.ifDebug(() => "Adding event listeners");
		DomUtils.getWindow().addEventListener("beforeunload", () => {
			this.$release();
		});

		this.logger.ifDebug(() => "Startup Complete");
	}

	public addInitializer(thisObject: Object, callback: (context? : Stage) => void): void {
		this.initializers.add(thisObject, callback);
	}

	public onDisposing(): void {
		this.getContext().getRoot().send(To.GLOBALLY, CYDRAN_PUBLIC_CHANNEL, Events.CYDRAN_PREAPP_DISPOSAL);
		this.root.$c().tell(ComponentTransitions.UNMOUNT);
	}

	public onDisposed(): void {
		// TODO - Implement
	}

	private runInitializers(): void {
		this.initializers.execute(this.stage);
	}

	private domReady(): void {
		this.completeStartup();
	}

	private publishMode(): void {
		const props: MutableProperties = this.getContext().getProperties();
		const isStrict: boolean = props.isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);
		const modeLabel: string = isStrict ? CydranMode.STRICT : CydranMode.LAZY;
		let extra: string = "";

		if (isStrict) {
			extra = `${ props.getAsString(PropertyKeys.CYDRAN_STRICT_STARTPHRASE) } - ${ props.getAsString(PropertyKeys.CYDRAN_STRICT_MESSAGE) }`;
		} else {
			extra = props.getAsString(PropertyKeys.CYDRAN_LAZY_STARTPHRASE);
		}

		this.logger.ifInfo(() => `MODE: ${ modeLabel.toUpperCase() } - ${ extra }`);
	}

	private completeStartup(): void {
		this.transitionTo(ContextTransitions.DOMREADY);
	}

	private transitionTo(transition: ContextTransitions): void {
		CONTEXT_MACHINE.submit(transition, this.machineState);
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
