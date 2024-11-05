import Sendable from "interface/ables/Sendable";
import Tellable from "interface/ables/Tellable";
import Register from "registry/Register";
import Scope from "scope/Scope";
import { MutableProperties } from "properties/Property";
import ComponentOptions from "component/ComponentOptions";
import Registry from "registry/Registry";
import { Nestable } from "interface/ComponentInterfaces";
import MessageCallback from "message/MessageCallback";
import Releasable from "interface/ables/Releasable";
import Receivable from "interface/ables/Receivable";

interface Context extends Sendable, Register, Tellable, Receivable {

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

	addPreInitializer(thisObject: Object, callback: (context?: Context) => void): void;

	addInitializer(thisObject: Object, callback: (context?: Context) => void): void;

	addDisposer(thisObject: Object, callback: (context?: Context) => void): void;

	getRegistry(): Registry;

	configure(callback: (context: Context) => void, thisObject?: Object): Context;

	addListener(thisObject: Object, callback: MessageCallback): void;

	removeListener(thisObject: Object, callback: MessageCallback): void;

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

	addInitializer(thisObject: Object, callback:(stage: Stage) => void): Stage;

}

export { Context, Stage } ;
