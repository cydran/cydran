import { Stage, StageBuilder } from "stage/Stage";
import Type from "interface/Type";
import Module from "module/Module";
import Behavior from "behavior/Behavior";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { requireNotNull, merge } from "util/Utils";
import StageImpl from "stage/StageImpl";
import AbstractBuilderImpl from "pattern/AbstractBuilderImpl";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from "argument/ConstantArgumentResolver";
import ArgumentResolver from "argument/ArgumentResolver";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import LoggerServiceImpl from "log/LoggerServiceImpl";

class StageBuilderImpl extends AbstractBuilderImpl<Stage, StageImpl> implements StageBuilder {

	private logger: Logger;

	constructor(rootSelector: string, windowInstance: Window) {
		super(new StageImpl(rootSelector, windowInstance));
		this.logger = LoggerFactory.getLogger(this.constructor.name);
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.getInstance().withComponentBefore(id, moduleName);
		this.logger.info(`Component added before Stage: ${ id }`);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.getInstance().withComponentAfter(id, moduleName);
		this.logger.info(`Component added after Stage: ${ id }`);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withInitializer(callback);
		this.logger.info(`Register Stage initialization function`);
		return this;
	}

	public withDisposer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withDisposer(callback);
		this.logger.info(`Register Stage disposal function`);
		return this;
	}

	public getModule(name: string): Module {
		return this.getInstance().getModules().getModule(name);
	}

	public getDefaultModule(): Module {
		return this.getInstance().getModules().getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): StageBuilder {
		this.getInstance().getModules().forEach(fn);
		return this;
	}

	public withBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder {
		this.getInstance().getModules().registerBehavior(name, supportedTags, behaviorClass);
		this.logger.info(`Register "${ name }" custom application behavior`);
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		this.getInstance().getModules().registerConstant(id, instance);
		this.logger.info(`Register "${ id }" as constant`);
		return this;
	}

	public withPrototype(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerPrototype(id, classInstance, argumentResolvers);
		this.logger.info(`Register prototypical object: ${classInstance.name}`);
		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerPrototypeWithFactory(id, factoryFn, argumentResolvers);
		this.logger.info(`Register prototypical object from factory: ${id}`);
		return this;
	}

	public withSingleton(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerSingleton(id, classInstance, argumentResolvers);
		this.logger.info(`Register singleton object: ${classInstance.name}`);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerSingletonWithFactory(id, factoryFn, argumentResolvers);
		this.logger.info(`Register singleton object from factory: ${id}`);
		return this;
	}

	public withImplicit(id: string, template: string, options?: ComponentOptions): StageBuilder {
		const resolvers: ArgumentsResolversImpl = new ArgumentsResolversImpl();
		resolvers.add(new ConstantArgumentResolver(template));
		resolvers.add(new ImplicitConfigurationArgumentResolver(options));
		this.withPrototype(id, Component, resolvers);
		this.logger.info(`Register implied prototype component: ${id}`);
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		this.logger.info(`Cydran capability added`);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.getInstance().getModules().getScope().add(name, item);
		this.logger.info(`Register "${ name }" as Cydran instance scope item`);
		return this;
	}

	public withProperties(properties: any): StageBuilder {
		this.getInstance().getProperties().load(properties);
		LoggerServiceImpl.INSTANCE().setColorPallet(this.getInstance().getProperties());
		this.logger.info(`Application level properties and overrides registered`);
		this.logger.warn(`Cydran logging color pallet updated`);
		return this;
	}

	protected validate(reportError: (message: string) => void): void {
		// TODO - Determine validation requirements
	}

}

class ImplicitConfigurationArgumentResolver implements ArgumentResolver {

	private options: any;

	constructor(options: any) {
		this.options = options;
	}

	public resolve(module: Module): any {
		return merge([this.options, { module: module }]);
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default StageBuilderImpl;
