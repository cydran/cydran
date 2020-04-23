import { ComponentIdPair, ComponentConfig } from "@/component/ComponentConfig";
import CydranConfig from "@/config/CydranConfig";
import DomUtils from "@/util/DomUtils";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import Module from "@/module/Module";
import ObjectUtils from "@/util/ObjectUtils";
import Scope from "@/model/Scope";
import { VALID_ID } from "@/constant/ValidationRegExp";
import { Modules } from "@/module/Modules";
import Nestable from "@/component/Nestable";
import StageComponent from "@/stage/StageComponent";
import { DEFAULT_MODULE_KEY, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Component from "@/component/Component";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

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

	withElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): StageBuilder;

	withConstant(id: string, instance: any): StageBuilder;

	withPrototype(id: string, classInstance: any, dependencies?: string[]): StageBuilder;

	withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withSingleton(id: string, classInstance: any, dependencies?: string[]): StageBuilder;

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
		return Modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return Modules.getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): StageBuilder {
		Modules.forEach(fn);
		return this;
	}

	public withElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): StageBuilder {
		Modules.registerElementMediator(name, supportedTags, elementMediatorClass);
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		Modules.registerConstant(id, instance);
		return this;
	}

	public withPrototype(id: string, classInstance: any, dependencies?: string[]): StageBuilder {
		Modules.registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		Modules.registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withSingleton(id: string, classInstance: any, dependencies?: string[]): StageBuilder {
		Modules.registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		Modules.registerSingletonWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withImplicit(id: string, template: string, config?: ComponentConfig): StageBuilder {
		this.withPrototypeFromFactory(id, () => new Component(template, config));
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		Modules.getScope().add(name, item);
		return this;
	}

	public build(): Stage {
		return this.instance;
	}

}

interface Stage {

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): void;

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: any): void;

	registerSingleton(id: string, classInstance: any): void;

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

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
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

	public start(): void {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return;
		}

		this.logger.debug("Cydran Starting");
		Modules.registerConstant("stage", this);
		DomUtils.domReady(() => this.domReady());
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

	public getModule(name: string): Module {
		return Modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return Modules.getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): void {
		Modules.forEach(fn);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public registerConstant(id: string, instance: any): void {
		Modules.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: any, dependencies?: string[]): void {
		Modules.registerPrototype(id, classInstance, dependencies);
	}

	public registerSingleton(id: string, classInstance: any, dependencies?: string[]): void {
		Modules.registerSingleton(id, classInstance, dependencies);
	}

	public getScope(): Scope {
		return Modules.getScope();
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		this.root = new StageComponent(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
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
