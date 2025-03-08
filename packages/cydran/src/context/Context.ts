import Sendable from "interface/ables/Sendable";
import Register from "registry/Register";
import { MutableProperties } from "properties/Property";
import ComponentOptions from "component/ComponentOptions";
import MessageCallback from "message/MessageCallback";
import Releasable from "interface/ables/Releasable";
import Receivable from "interface/ables/Receivable";
import ElementOperations from "component/ElementOperations";
import FormOperations from "component/FormOperations";
import MetadataContinuation from "component/MetadataContinuation";
import IntervalContinuation from "continuation/IntervalContinuation";
import OnContinuation from "continuation/OnContinuation";
import SendContinuation from "continuation/SendContinuation";
import { FilterBuilder } from "filter/Filter";
import Actionable from "interface/ables/Actionable";
import Messagable from "interface/ables/Messagable";
import Tellable from "interface/ables/Tellable";
import Watchable from "interface/ables/Watchable";
import Logger from "log/Logger";
import { Properties } from "properties/Property";
import Scope from "scope/Scope";

interface RegionContinuation {

	/**
	 * Component has a {@link Region}
	 * @returns boolean - true | false
	 */
	has(name: string): boolean;

	/**
	 * Get a child component from a region.
	 * @param name - string name value of the child {@link Component}
	 * @returns Component instance, or null
	 */
	get<N extends Nestable>(name: string): N;

	/**
	 * Set a child component into a region.
	 * @param name - string name value of the child {@link Component}
	 * @param component - the {@link Component} reference
	 */
	set(name: string, component: Nestable): void;

	setByObjectId(name: string, componentName: string, defaultComponentName?: string): void;

}

interface ActionContinuation extends Tellable, Messagable, Watchable {

	getParent(): Nestable;

	getEl(): HTMLElement;

	getObject<T>(id: string, ...instanceArguments: any[]): T;

	getLogger(): Logger;

	properties(): Properties;

	getId(): string;

	getPrefix(): string;

	getName(): string;

	scope(): Scope;

	getValue<T>(): T;

	isMounted(): boolean;

	isConnected(): boolean;

	send(messageName: string, payload?: any): SendContinuation;

	onInterval(millis?: Number): IntervalContinuation;

	onMessage(messageName: string): OnContinuation;

	/**
	 * Get a {@linkcode FilterBuilder} object back to create a {@linkcode Filter} of lists in the model
	 * @param expression - primitive string representation expression of a JS iterable/array object
	 * @returns
	 */
	createFilter(expression: string): FilterBuilder;

	regions(): RegionContinuation;

	tell(name: string, payload?: any): void;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	forForm(name: string): FormOperations;

	forForms(): FormOperations;

	metadata(): MetadataContinuation;

	/**
	 * Applies a function and synchronizes state within the UI based on effected change.
	 * @param fn Function to execute
	 * @param args Arguments
	 */
	sync(): void;

	getContext(): Context;

}

// TODO - Untangle Nestable and other references so that it can explicitly implement ContextAware
// and not have to rely on the implicit setContext() method.

interface Nestable extends Actionable<ActionContinuation> {

	onMount(): void;

	onUnmount(): void;

	onRemount(): void;

}

interface Context extends Sendable, Register<Context>, Tellable, Receivable {

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

	configure(callback: (context: Context) => void, thisObject?: Object): Context;

	addListener(thisObject: Object, callback: MessageCallback): void;

	removeListener(thisObject: Object, callback: MessageCallback): void;

	// TODO - provide a createLogger(name: string): Logger method

}

interface InternalContext extends Context {

	getRegistry(): Registry;

}

interface Stage extends Releasable {

	getContext(): Context;

	addComponentBefore(component: Nestable): Stage;

	addComponentAfter(component: Nestable): Stage;

	start(): Stage;

	setComponent(component: Nestable): Stage;

	setComponentByObjectId(componentName: string, defaultComponentName?: string): Stage;

	isStarted(): boolean;

	addInitializer(thisObject: Object, callback:(stage: Stage) => void): Stage;

}
interface Registry extends Register<Registry> {

	getObject<T>(id: string, instanceArguments: any[], localContext: Context): T;

	getLocalObject<T>(id: string, instanceArguments: any[], localContext: Context): T;

	extend(context: Context): Registry;

}

export { Context, InternalContext, Stage, Nestable, RegionContinuation, ActionContinuation, Registry };
