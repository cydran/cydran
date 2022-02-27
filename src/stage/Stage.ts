import Scope from "scope/Scope";
import Disposable from "interface/ables/Disposable";
import Type from "interface/Type";
import Nestable from "interface/ables/Nestable";
import Behavior from "behavior/Behavior";
import ComponentOptions from "component/ComponentOptions";
import Module from "module/Module";
import Builder from "pattern/Builder";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import Dom from 'dom/Dom';
import OutputStrategy from "log/OutputStrategy";

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

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	getScope(): Scope;

	isStarted(): boolean;

	getDom(): Dom;

}

interface StageBuilder extends Builder<Stage> {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): StageBuilder;

	withComponentBefore(id: string, moduleName?: string): StageBuilder;

	withComponentAfter(id: string, moduleName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withInitializer(callback: (stage?: Stage) => void): StageBuilder;

	withDisposer(callback: (stage?: Stage) => void): StageBuilder;

	withBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder;

	withConstant(id: string, instance: any): StageBuilder;

	withProperties(properties: any): StageBuilder;

	withPrototype(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder;

	withPrototypeFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder;

	withSingleton(id: string, classInstance: Type<any>, argumentResolvers?: ArgumentsResolvers): StageBuilder;

	withSingletonFromFactory(id: string, factoryFn: () => any, argumentResolvers?: ArgumentsResolvers): StageBuilder;

	withImplicit(id: string, template: string, options?: ComponentOptions): StageBuilder;

	withCapability(capability: (builder: StageBuilder) => void): StageBuilder;

	withScopeItem(name: string, item: any): StageBuilder;

}
interface ArgumentsResolversBuilder extends Builder<ArgumentsResolvers> {
	/**
	 * Intent to resolve a registered object in the Cydran service discovery functionality
	 * @param id unique string key of the registerd object
	 */
	with(id: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran {PubSub} instance
	 */
	withPubSub(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve an id instance value provided by the Cydran id generation mechanism
	 */
	withInstanceId(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve the function that Cydran utilizes for instance id generation
	 */
	withInstanceIdFn(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran {Logger} instance
	 * @param name - of the {Logger} instance
	 * @param level - optional value representation of logging threshold
	 * @param strategy - optional argument to override default {OutputStrategy}
	 */
	withLogger(name: string, level?: string, strategy?: OutputStrategy): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a logging {OutputStrategy} to be utilized
	 * @param id - key of the strategy
	 * @param straegy - mechanism of logging
	 */
	withLoggerOutputStrategy(id: string, strategy: OutputStrategy): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a defined function
	 * @param fn function to resolve
	 */
	withFunction(fn: () => any): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve raw constant value
	 * @param value treated as a literal constant
	 */
	withConstant(value: any): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran or application {Properties property} value
	 * @param name property key name
	 */
	withProperty(name: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a registered object found within one of the Cydran scope contexts
	 * @param name key of object in the scope context
	 */
	withScopeItem(name: string): ArgumentsResolversBuilder;

}

export {
	Stage,
	StageBuilder,
	ArgumentsResolversBuilder
};
