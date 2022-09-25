import Stage from "stage/Stage";
import Type from "interface/Type";
import Context from "context/Context";
import Behavior from "behavior/Behavior";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { requireNotNull, merge, isDefined } from "util/Utils";
import StageImpl from "stage/StageImpl";
import AbstractBuilderImpl from "pattern/AbstractBuilderImpl";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from "argument/ConstantArgumentResolver";
import ArgumentResolver from "argument/ArgumentResolver";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import StageBuilder from "stage/StageBuilder";

class StageBuilderImpl extends AbstractBuilderImpl<Stage, StageImpl> implements StageBuilder {

	private logger: Logger;

	constructor(rootSelector: string, properties: SimpleMap<any> = {}) {
		super(new StageImpl(rootSelector, properties));
		this.logger = this.getLoggerFactory().getLogger(`StageBuilder`);
	}

	public getLoggerFactory(): LoggerFactory {
		return this.getInstance().getLoggerFactory();
	}

	public withComponentBefore(id: string, contextName?: string): StageBuilder {
		this.getInstance().withComponentBefore(id, contextName);
		return this;
	}

	public withComponentAfter(id: string, contextName?: string): StageBuilder {
		this.getInstance().withComponentAfter(id, contextName);
		return this;
	}

	public withComponent(id: string, contextName?: string): StageBuilder {
		return this.withComponentAfter(id, contextName);
	}

	public withPreinitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withPreinitializer(callback);
		return this;
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withInitializer(callback);
		return this;
	}

	public withDisposer(callback: (stage?: Stage) => void): StageBuilder {
		this.getInstance().withDisposer(callback);
		return this;
	}

	public withBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder {
		this.getInstance().registerBehavior(name, supportedTags, behaviorClass);
		return this;
	}

	public withBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder {
		this.getInstance().registerBehaviorFunction(name, supportedTags, behavionFunction);
		return this;
	}


	public withConstant(id: string, instance: any): StageBuilder {
		this.getInstance().registerConstant(id, instance);
		return this;
	}

	public withProperties(properties: any): StageBuilder {
		this.getInstance().getProperties().load(properties);
		return this;
	}

	public withPrototype(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().registerPrototype(id, classInstance, argumentResolvers);
		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().registerPrototypeWithFactory(id, factoryFn, argumentResolvers);
		return this;
	}

	public withSingleton(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().registerSingleton(id, classInstance, argumentResolvers);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder {
		this.getInstance().registerSingletonWithFactory(id, factoryFn, argumentResolvers);
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
		requireNotNull(capability, "capability");
		capability(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.logger.ifDebug(() => `With scope item: ${ name }`);
		this.getInstance().getScope().add(name, item);
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

	public resolve(context: Context): any {
		return merge([this.options, { context: context }]);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default StageBuilderImpl;
