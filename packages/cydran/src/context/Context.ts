import Sendable from "interface/ables/Sendable";
import Tellable from "interface/ables/Tellable";
import Register from "registry/Register";
import Scope from "scope/Scope";
import PubSub from "message/PubSub";
import { MutableProperties } from "properties/Property";
import ComponentOptions from "component/ComponentOptions";
import Registry from "registry/Registry";
import { Nestable } from "interface/ComponentInterfaces";
import MessageCallback from "message/MessageCallback";
import Releasable from "interface/ables/Releasable";

interface Context extends Sendable, Register, Tellable {

	getChild(name: string): Context;

	hasChild(name: string): boolean;

	addChild(name: string, initializer?: (context: Context) => void): Context;

	removeChild(name: string): Context;

	getObject<T>(id: string, ...instanceArguments: any[]): T;

	getProperties(): MutableProperties;

	getScope(): Scope;

	getRoot(): Context;

	isRoot(): boolean;

	getParent(): Context;

	registerImplicit(id: string, template: string, options?: ComponentOptions): Context;

	getName(): string;

	getFullName(): string;

	addPreInitializer(callback: (context?: Context) => void): void;

	addInitializer(callback: (context?: Context) => void): void;

	addDisposer(callback: (context?: Context) => void): void;

	getRegistry(): Registry;

	createPubSubFor(targetThis: any): PubSub;

	configure(callback: (context: Context) => void): Context;

	addListener(callback: MessageCallback): void;

	removeListener(callback: MessageCallback): void;

	// TODO - provide a createLogger(name: string): Logger method

}

interface Stage extends Releasable {

	getContext(): Context;

	addComponentBefore(component: Nestable): Stage;

	addComponentAfter(component: Nestable): Stage;

	start(): Stage;

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage;

	isStarted(): boolean;

	addInitializer(callback:(stage: Stage) => void): Stage;

}

export { Context, Stage } ;
