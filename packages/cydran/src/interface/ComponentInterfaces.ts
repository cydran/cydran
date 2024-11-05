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

	setFromRegistry(name: string, componentName: string, defaultComponentName?: string): void;

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

}

// TODO - Untangle Nestable and other references so that it can explicitly implement ContextAware
// and not have to rely on the implicit setContext() method.

interface Nestable extends Actionable<ActionContinuation> {

	onMount(): void;

	onUnmount(): void;

	onRemount(): void;

}

export { Nestable, RegionContinuation, ActionContinuation };
