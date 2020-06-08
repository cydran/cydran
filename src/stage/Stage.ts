import { ComponentIdPair, ComponentConfig } from "@/component/ComponentConfig";
import CydranConfig from "@/config/CydranConfig";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import Module from "@/module/Module";
import Scope from "@/model/Scope";
import { VALID_ID } from "@/constant/ValidationRegExp";
import ModulesContext from "@/module/ModulesContext";
import Nestable from "@/component/Nestable";
import StageComponent from "@/stage/StageComponent";
import { DEFAULT_MODULE_KEY, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import ModulesContextImpl from "@/module/ModulesContextImpl";
import AnonymousComponent from "@/component/AnonymousComponent";
import Type from "@/type/Type";
import ElementMediator from "@/element/ElementMediator";
import { requireNotNull, requireValid } from "@/util/ObjectUtils";
import { domReady } from "@/util/DomUtils";
import Disposable from "@/pattern/Disposable";

interface StageBuilder {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): StageBuilder;

	withComponentBefore(id: string, moduleName?: string): StageBuilder;

	withComponentAfter(id: string, moduleName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withInitializer(callback: (stage?: Stage) => void): StageBuilder;

	withTraceLogging(): StageBuilder;

	withDebugLogging(): StageBuilder;

	withInfoLogging(): StageBuilder;

	withWarnLogging(): StageBuilder;

	withErrorLogging(): StageBuilder;

	withFatalLogging(): StageBuilder;

	withLoggingDisabled(): StageBuilder;

	withElementMediator(name: string, supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): StageBuilder;

	withConstant(id: string, instance: any): StageBuilder;

	withPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withImplicit(id: string, template: string, config?: ComponentConfig): StageBuilder;

	withCapability(capability: (builder: StageBuilder) => void): StageBuilder;

	withScopeItem(name: string, item: any): StageBuilder;

	build(): Stage;

}

class StageBuilderImpl implements StageBuilder {

	private config: CydranConfig;

	private instance: StageImpl;

	constructor(rootSelector: string) {
		this.config = new CydranConfig();
		this.instance = new StageImpl(rootSelector);
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentBefore(id, moduleName);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentAfter(id, moduleName);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.instance.withInitializer(callback);
		return this;
	}

	public withTraceLogging(): StageBuilder {
		this.config.useTrace();
		return this;
	}

	public withDebugLogging(): StageBuilder {
		this.config.useDebug();
		return this;
	}

	public withInfoLogging(): StageBuilder {
		this.config.useInfo();
		return this;
	}

	public withWarnLogging(): StageBuilder {
		this.config.useWarn();
		return this;
	}

	public withErrorLogging(): StageBuilder {
		this.config.useError();
		return this;
	}

	public withFatalLogging(): StageBuilder {
		this.config.useFatal();
		return this;
	}

	public withLoggingDisabled(): StageBuilder {
		this.config.useDisabled();
		return this;
	}

	public getModule(name: string): Module {
		return this.instance.getModules().getModule(name);
	}

	public getDefaultModule(): Module {
		return this.instance.getModules().getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): StageBuilder {
		this.instance.getModules().forEach(fn);
		return this;
	}

	public withElementMediator(name: string, supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): StageBuilder {
		this.instance.getModules().registerElementMediator(name, supportedTags, elementMediatorClass);
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		this.instance.getModules().registerConstant(id, instance);
		return this;
	}

	public withPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerSingletonWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withImplicit(id: string, template: string, config?: ComponentConfig): StageBuilder {
		this.withPrototypeFromFactory(id, () => new AnonymousComponent(this.getDefaultModule(), template, config));
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.instance.getModules().getScope().add(name, item);
		return this;
	}

	public build(): Stage {
		return this.instance;
	}

}

interface Stage extends Disposable {

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): Stage;

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>): void;

	registerSingleton(id: string, classInstance: Type<any>): void;

	getScope(): Scope;

}

class StageImpl implements Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: ((stage?: Stage) => void)[];

	private root: StageComponent;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private modules: ModulesContext;

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.modules = new ModulesContextImpl();
		this.started = false;
		this.initializers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
	}

	public withInitializer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.initializers.push(callback);
		return this;
	}

	public withComponentBefore(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.topComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public withComponentAfter(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.bottomComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public start(): Stage {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return this;
		}

		this.logger.debug("Cydran Starting");
		this.modules.registerConstant("stage", this);
		domReady(() => this.domReady());

		return this;
	}

	public setComponent(component: Nestable): Stage {
		this.root.setChild("body", component);
		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.root.setChildFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.root.get(id);
	}

	public getModules(): ModulesContext {
		return this.modules;
	}

	public getModule(name: string): Module {
		return this.modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return this.modules.getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): void {
		this.modules.forEach(fn);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.modules.broadcast(channelName, messageName, payload);
	}

	public registerConstant(id: string, instance: any): void {
		this.modules.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerPrototype(id, classInstance, dependencies);
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerSingleton(id, classInstance, dependencies);
	}

	public getScope(): Scope {
		return this.modules.getScope();
	}

	public dispose(): void {
		this.modules.dispose();
		this.modules = null;
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		this.root = new StageComponent(this.modules.getDefaultModule(), this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		this.logger.debug("Startup Complete");
	}

}

const builder = function(rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

export { builder, Stage, StageBuilder, StageImpl };
