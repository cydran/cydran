import Sendable from "interface/ables/Sendable";
import Tellable from "interface/ables/Tellable";
import Register from "registry/Register";
import Scope from "scope/Scope";
import PubSub from "message/PubSub";
import { MutableProperties } from "properties/Property";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import ComponentOptions from "component/ComponentOptions";
import Registry from "registry/Registry";
import { Nestable } from "interface/ComponentInterfaces";
import Disposable from "interface/ables/Disposable";

interface Context extends Sendable, Register, Tellable {

	getChild(name: string): Context;

	hasChild(name: string): boolean;

	addChild(name: string, initializer?: (context: Context) => void): Context;

	removeChild(name: string): Context;

	getObject<T>(id: string, ...instanceArguments: any[]): T;

	getProperties(): MutableProperties;

	getScope(): Scope;

	getRoot(): Context;

	getStage(): Stage;

	isRoot(): boolean;

	getParent(): Context;

	registerImplicit(id: string, template: string, options?: ComponentOptions): Context;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	getName(): string;

	addPreInitializer(callback: (context?: Context) => void): void;

	addInitializer(callback: (context?: Context) => void): void;

	addDisposer(callback: (context?: Context) => void): void;

	getRegistry(): Registry;

	createPubSubFor(targetThis: any): PubSub;

	configure(callback: (context: Context) => void): Context;

}

interface Stage extends Disposable {

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	getContext(): Context;

	addComponentBefore(component: Nestable): Stage;

	addComponentAfter(component: Nestable): Stage;

	start(): Stage;

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage;

	isStarted(): boolean;

	addInitializer(callback: (stage: Stage) => void): Stage;

}

export { Context, Stage } ;
