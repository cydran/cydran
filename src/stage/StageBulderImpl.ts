import { Stage, StageBuilder } from "stage/Stage";
import CydranConfig from "config/CydranConfig";
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

class StageBuilderImpl extends AbstractBuilderImpl<Stage, StageImpl> implements StageBuilder {

	private config: CydranConfig;

	constructor(rootSelector: string) {
		super(new StageImpl(rootSelector));
		this.config = new CydranConfig();
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.getInstance().withComponentBefore(id, moduleName);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.getInstance().withComponentAfter(id, moduleName);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withInitializer(callback);
		return this;
	}

	public withDisposer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withDisposer(callback);
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
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		this.getInstance().getModules().registerConstant(id, instance);
		return this;
	}

	public withPrototype(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerPrototype(id, classInstance, argumentResolvers);

		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerPrototypeWithFactory(id, factoryFn, argumentResolvers);
		return this;
	}

	public withSingleton(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerSingleton(id, classInstance, argumentResolvers);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().getModules().registerSingletonWithFactory(id, factoryFn, argumentResolvers);
		return this;
	}

	public withImplicit(id: string, template: string, options?: ComponentOptions): StageBuilder {
		const resolvers: ArgumentsResolversImpl = new ArgumentsResolversImpl();
		resolvers.add(new ConstantArgumentResolver(template));
		resolvers.add(new ImplicitConfigurationArgumentResolver(options));
		this.withPrototype(id, Component, resolvers);
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.getInstance().getModules().getScope().add(name, item);
		return this;
	}

	public withProperties(properties: any): StageBuilder {
		this.getInstance().getProperties().load(properties);

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
