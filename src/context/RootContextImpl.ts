import PropertyKeys from "const/PropertyKeys";
import SimpleMap from "interface/SimpleMap";
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import ScopeImpl from "scope/ScopeImpl";
import COMPARE from "const/Compare";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Type from "interface/Type";
import Logger from "log/Logger";
import PubSub from "message/PubSub";
import RegistryStrategy from "registry/RegistryStrategy";
import Scope from "scope/Scope";
import { requireNotNull, defaultAsNull, isDefined, forEachField, defaulted, requireValid, extractClassName } from 'util/Utils';
import { NamingConflictError, UnknownContextError } from "error/Errors";
import InternalContext from "context/InternalContext";
import Registry from "registry/Registry";
import RegistryImpl from "registry/RegistryImpl";
import Behavior from "behavior/Behavior";
import PubSubImpl from "message/PubSubImpl";
import MessageCallback from "message/MessageCallback";
import Broker from "message/Broker";
import BrokerImpl from "message/BrokerImpl";
import LoggerFactory from "log/LoggerFactory";
import BehaviorsRegistryImpl from "behavior/BehaviorsRegistryImpl";
import ComponentIdPair from "component/CompnentIdPair";
import Component from "component/Component";
import Renderer from "component/Renderer";
import StageRendererImpl from "component/renderer/StageRendererImpl";
import Events from "const/EventsFields";
import { DEFAULT_CONTEXT_KEY, CYDRAN_PUBLIC_CHANNEL, VALID_ID } from "const/HardValues";
import StageComponent from "stage/StageComponent";
import ComponentTransitions from "component/ComponentTransitions";
import Factories from "factory/Factories";
import CydranMode from "const/CydranMode";
import behaviorsPreinitializer from "behavior/core/behaviorsPreinitializer";
import { Nestable } from "interface/ComponentInterfaces";
import DomUtils from "dom/DomUtils";
import { Context, Stage } from "context/Context";
import ComponentOptions from "component/ComponentOptions";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from "argument/resolver/ConstantArgumentResolver";
import ImplicitConfigurationArgumentResolver from "argument/resolver/ImplicitConfigurationArgumentResolver";
import Initializers from "context/Initializers";
import InitializersImpl from "context/InitializersImpl";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";
import ContextStates from "component/ContextStates";
import ContextTransitions from "component/ContextTransitions";
import MachineState from "machine/MachineState";
import Ids from "const/IdsFields";

const CYDRAN_STYLES: string = `
/*
 * Cydran CSS Styles
 */
`;

abstract class AbstractContextImpl<C extends Context> implements InternalContext {

	private name: string;

	private children: SimpleMap<Context>;

	private logger: Logger;

	private broker: Broker;

	private preInitializers: Initializers<C>;

	private initializers: Initializers<C>;

	private disposers: Initializers<C>;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
		this.children = {};
		this.preInitializers = new InitializersImpl<C>();
		this.initializers = new InitializersImpl<C>();
		this.disposers = new InitializersImpl<C>();
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		this.message(channelName, messageName, payload);
	}

	public sendToParentContext(channelName: string, messageName: string, payload?: any): void {
		this.getParent().message(channelName, messageName, payload);
	}

	public sendToParentContexts(channelName: string, messageName: string, payload?: any): void {
		let current: Context = this.getParent();

		while (!current.isStage()) {
			current.message(channelName, messageName, payload);
			current = current.getParent();
		}
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		this.getStage().message(channelName, messageName, payload);
	}

	public sendToChildContexts(channelName: string, messageName: string, payload?: any): void {
		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
		});
	}

	public sendToDescendantContexts(channelName: string, messageName: string, payload?: any): void {
		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
			child.sendToDescendantContexts(channelName, messageName, payload);
		});
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getStage().message(channelName, messageName, payload);
		this.getStage().sendToDescendantContexts(channelName, messageName, payload);
	}

	public addPreInitializer(callback: (context?: Context) => void): void {
		this.preInitializers.add(callback);
	}

	public addInitializer(callback: (context?: Context) => void): void {
		this.initializers.add(callback);
	}

	public addDisposer(callback: (context?: Context) => void): void {
		this.disposers.add(callback);
	}

	// -----------------------------------------------------------

	public abstract getStage(): Stage;

	public abstract isStage(): boolean;

	public abstract getParent(): Context;

	public abstract getProperties(): MutableProperties;

	public abstract getScope(): Scope;

	public abstract getRegistry(): Registry;

	public abstract expose(id: string): Context;

	public getName(): string {
		return this.name;
	}

	public getChild(name: string): Context {
		return defaultAsNull(this.children[name]);
	}

	public hasChild(name: string): boolean {
		return isDefined(this.children[name]);
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		requireNotNull(name, "name");

		if (isDefined(this.children[name])) {
			throw new NamingConflictError("Child context name already exists: " + name);
		}

		const child: Context = new ChildContextImpl(name, this);

		this.children[name] = child;

		if (isDefined(initializer)) {
			initializer(child);
		}

		return child;
	}

	public removeChild(name: string): void {
		if (!this.hasChild(name)) {
			throw new UnknownContextError("Unknown child context: " + name);
		}

		const child: Context = this.getChild(name);
		child.$dispose();

		delete this.children[name];
	}

	public getLogger(): Logger {
		if (!isDefined(this.logger)) {
			this.logger = LoggerFactory.getLogger(this.name);
		}

		return this.logger;
	}

	public $dispose(): void {
		forEachField(this.children, (key, child: Context) => {
			child.$dispose();
		});

		this.disposers.execute(this as unknown as C);
		this.children = {};
		this.logger = null;
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		this.getBroker().send(channelName, messageName, payload);
	}

	public getObject<T>(id: string): T {
		return this.getRegistry().getObject(id);
	}

	public getLocalObject<T>(id: string): T {
		return this.getRegistry().getLocalObject(id);
	}

	public hasRegistration(id: string): boolean {
		return this.getRegistry().hasRegistration(id);
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		this.getRegistry().addStrategy(strategy);

		return this;
	}

	public createPubSubFor(targetThis: any): PubSub {
		return new PubSubImpl(targetThis, this);
	}

	public registerImplicit(id: string, template: string, options?: ComponentOptions): Context {
		const resolvers: ArgumentsResolversImpl = new ArgumentsResolversImpl();
		resolvers.add(new ConstantArgumentResolver(template));
		resolvers.add(new ImplicitConfigurationArgumentResolver(options));
		this.registerPrototype(id, Component, resolvers);

		return this;
	}

	public registerConstant(id: string, instance: any): Context {
		this.getRegistry().registerConstant(id, instance);

		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerPrototype(id, classInstance, resolvers);

		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerPrototypeWithFactory(id, factoryFn, resolvers);

		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerSingleton(id, classInstance, resolvers);

		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerSingletonWithFactory(id, factoryFn, resolvers);

		return this;
	}

	public registerConstantUnguarded(id: string, instance: any): Context {
		this.getRegistry().registerConstantUnguarded(id, instance);

		return this;
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		BehaviorsRegistryImpl.register(name, supportedTags, behaviorClass);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(
		name: string,
		supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>
	): void {
		BehaviorsRegistryImpl.registerFunction(name, supportedTags, behavionFunction);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public tell(name: string, payload?: any): void {
		requireNotNull(name, "name");

		switch (name) {
			case "addMessageCallback":
				this.addMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;

			case "removeMessageCallback":
				this.removeMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;
		}
	}

	protected runPreInitializers(): void {
		this.preInitializers.execute(this as unknown as C);
	}

	protected runInitializers(): void {
		this.initializers.execute(this as unknown as C);
	}

	private addMessageCallback(callback: MessageCallback): void {
		this.getBroker().addMessageCallback(callback);
	}

	private removeMessageCallback(callback: MessageCallback): void {
		this.getBroker().removeMessageCallback(callback);
	}

	private getBroker(): Broker {
		if (!isDefined(this.broker)) {
			this.broker = new BrokerImpl(LoggerFactory.getLogger(`Broker`));
		}

		return this.broker;
	}

}

class ChildContextImpl extends AbstractContextImpl<Context> {

	private parent: Context;

	private root: Stage;

	private properties: MutableProperties;

	private scope: Scope;

	private registry: Registry;

	constructor(name: string, parent: InternalContext) {
		super(name);
		this.parent = requireNotNull(parent, "parent");
		this.root = parent.getStage();
		this.properties = parent.getProperties().extend();
		this.scope = parent.getScope().extend();
		this.registry = parent.getRegistry().extend(this);
	}

	public expose(id: string): Context {
		requireValid(id, "id", VALID_ID);

		// TODO - Implement

		throw new Error("Method not implemented.");
	}

	public getParent(): Context {
		return this.parent;
	}

	public isStage(): boolean {
		return false;
	}

	public getStage(): Stage {
		return this.root;
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

}

class StageImpl extends AbstractContextImpl<Stage> implements Stage {

	private rootSelector: string;

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private properties: MutableProperties;

	private scope: ScopeImpl;

	private rootRegistry: Registry;

	private registry: Registry;

	private machineState: MachineState<StageImpl>;

	constructor(rootSelector: string, properties: SimpleMap<any> = {}) {
		super(Ids.STAGE);
		const windowInstance: Window = properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW];
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.machineState = CONTEXT_MACHINE.create(this);
		this.properties = new PropertiesImpl()
			.load(DEFAULT_PROPERTIES_VALUES)
			.extend()
			.load(properties);

		this.transitionTo(ContextTransitions.BOOTSTRAP);
	}

	private transitionTo(transition: ContextTransitions): void {
		CONTEXT_MACHINE.submit(transition, this.machineState);
	}

	public expose(id: string): Context {
		requireValid(id, "id", VALID_ID);

		// Intentionally do nothing, as there is no parent

		return this;
	}

	public getParent(): Context {
		return this;
	}

	public isStage(): boolean {
		return true;
	}

	public getStage(): Stage {
		return this;
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
			this.getLogger().ifTrace(() => `Set component: ${extractClassName(component)}`);
		}

		this.root.$c().regions().set("body", component);

		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.getLogger().ifInfo(() => `Set component from registry: ${ componentName }`);
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
		this.scope = new ScopeImpl().add("compare", COMPARE).extend() as ScopeImpl;
		LoggerFactory.init(this.properties);
		this.rootRegistry = new RegistryImpl(this);
		this.registry = this.rootRegistry.extend();
		this.root = null;
		this.addPreInitializer(behaviorsPreinitializer);
		this.addDisposer((stage: Stage) => {
			stage.sendGlobally(CYDRAN_PUBLIC_CHANNEL, Events.CYDRAN_PREAPP_DISPOSAL);
			this.$dispose();
		});

		// TODO - Implement
	}

	public onStart(): void {
		Factories.importFactories(this.getProperties());
		this.getLogger().ifTrace(() => "Start Requested");
		this.getLogger().ifDebug(() => "Cydran Starting");
		this.getLogger().ifDebug(() => "Running preInitializers");
		this.runPreInitializers();
		this.publishMode();

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS)) {
			this.domReady();
		} else {
			DomUtils.onReady(this.domReady, this);
		}
	}

	public onStarted(): void {
		this.getLogger().ifInfo(() => "Already Started");
	}

	public onDomReady(): void {
		this.getLogger().ifInfo(() => "DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new StageComponent(renderer);
		this.root.$c().tell("setContext", this);
		this.root.$c().tell("setParent", null);
		this.root.$c().tell(ComponentTransitions.INIT);
		this.root.$c().tell(ComponentTransitions.MOUNT);

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
			this.addStyles();
		}

		this.getLogger().ifDebug(() => "Running initializers");
		this.runInitializers();
		this.getLogger().ifInfo(() => "Adding event listeners");

		DomUtils.getWindow().addEventListener("beforeunload", () => {
			this.$dispose();
		});

		this.getLogger().ifInfo(() => "Startup Complete");
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

		this.getLogger().ifInfo(() => `MODE: ${ modeLabel.toUpperCase() } - ${ extra }`);
	}

	private completeStartup(): void {
		this.transitionTo(ContextTransitions.DOMREADY);
	}

	// TODO - Move style handling into dedicated and separately testable class

	private addStyles(): void {
		const head: HTMLHeadElement = DomUtils.getDocument().head;

		let styleElementMissing: boolean = true;

		// tslint:disable-next-line
		for (let i = 0; i < head.children.length; i++) {
			const child: HTMLElement = head.children[i] as HTMLElement;

			if (child.tagName.toLowerCase() === "style" && child.id === "cydran-styles") {
				styleElementMissing = false;
				break;
			}
		}

		if (styleElementMissing) {
			const styleElement: HTMLStyleElement = DomUtils.createElement("style");
			styleElement.id = "cydran-styles";
			styleElement.textContent = CYDRAN_STYLES;
			head.insertAdjacentElement("afterbegin", styleElement);
		}
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

export { StageImpl, ChildContextImpl };
