import ComponentOptions from "component/ComponentOptions";
import Behavior from "behavior/Behavior";
import Builder from "pattern/Builder";
import Context from "context/Context";
import Stage from "stage/Stage";
import LoggerFactory from "log/LoggerFactory";
import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

interface StageBuilder extends Builder<Stage> {

	getDefaultContext(): Context;

	getLoggerFactory(): LoggerFactory;

	withComponentBefore(id: string, contextName?: string): StageBuilder;

	withComponentAfter(id: string, contextName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withPreinitializer(callback: (stage?: Stage) => void): StageBuilder;

	withInitializer(callback: (stage?: Stage) => void): StageBuilder;

	withDisposer(callback: (stage?: Stage) => void): StageBuilder;

	withBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder;

	withBehaviorFunction(name: string, supportedTags: string[], behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): StageBuilder;

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

export default StageBuilder;
