import Tellable from "interface/ables/Tellable";
import Scope from "scope/Scope";
import Register from "registry/Register";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import Logger from "log/Logger";
import { MutableProperties } from "properties/Property";
import Sendable from "interface/ables/Sendable";
import Disposable from "interface/ables/Disposable";
import { Nestable } from "interface/ComponentInterfaces";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import ComponentOptions from "component/ComponentOptions";

interface Context extends Register, Tellable, Sendable {

	// Context

	getName(): string;

	getLogger(): Logger;

	getChild(name: string): Context;

	getStage(): Stage;

	isStage(): boolean;

	getParent(): Context;

	hasChild(name: string): boolean;

	addChild(name: string, initializer?: (context: Context) => void): Context;

	removeChild(name: string): void;

	registerImplicit(id: string, template: string, options?: ComponentOptions): Context;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	addPreInitializer(callback: (context?: Context) => void): void;

	addInitializer(callback: (context?: Context) => void): void;

	addDisposer(callback: (context?: Context) => void): void;

	// DI

	getObject<T>(id: string): T;

	getLocalObject<T>(id: string): T;

	hasRegistration(id: string): boolean;

	addStrategy(strategy: RegistryStrategy): Context;

	expose(id: string): Context;

	// Properties

	getProperties(): MutableProperties;

	// Unsorted

	getScope(): Scope;

	createPubSubFor(targetThis: any): PubSub;

}

interface Stage extends Disposable, Context {

	addComponentBefore(component: Nestable): Stage;

	addComponentAfter(component: Nestable): Stage;

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	start(): Stage;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	isStarted(): boolean;

}

export {
	Context,
	Stage
};
