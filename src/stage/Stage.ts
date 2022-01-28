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

	with(id: string): ArgumentsResolversBuilder;

	withPubSub(): ArgumentsResolversBuilder;

	withInstanceId(): ArgumentsResolversBuilder;

	withInstanceIdFn(): ArgumentsResolversBuilder;

	withLogger(name: string): ArgumentsResolversBuilder;

	withFunction(fn: () => any): ArgumentsResolversBuilder;

	withConstant(value: any): ArgumentsResolversBuilder;

	withProperty(name: string): ArgumentsResolversBuilder;

	withScopeItem(name: string): ArgumentsResolversBuilder;

}

export {
	Stage,
	StageBuilder,
	ArgumentsResolversBuilder
};
