import Scope from "scope/Scope";
import Disposable from "interface/ables/Disposable";
import Type from "interface/Type";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import Dom from 'dom/Dom';
import LoggerFactory from "log/LoggerFactory";
import Behavior from "behavior/Behavior";
import { Nestable } from "interface/ComponentInterfaces";
import Context from "context/Context";

interface Stage extends Disposable, Context {

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): Stage;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	isStarted(): boolean;

	getDom(): Dom;

	getLoggerFactory(): LoggerFactory;

}

export default Stage;
