/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

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
import WatchContinuation from "continuation/WatchContinuation";
import Logger from "log/Logger";
import { Properties } from "properties/Property";
import Scope from "scope/Scope";
import { CallBackThisObject, MessagePayload, InstanceArgument } from "CydranTypes";

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

interface SeriesOperations {

	getAt<N extends Nestable>(index: number): N;

	replace(oldComponent: Nestable, newComponent: Nestable): void;

	replaceAt(index: number, component: Nestable): void;

	remove(component: Nestable): void;

	removeAt(index: number): void;

	insertBefore(index: number, component: Nestable): void;

	insertAfter(index: number, component: Nestable): void;

	insertFirst(component: Nestable): void;

	insertLast(component: Nestable): void;

	hasComponents(): boolean;

	contains(component: Nestable): boolean;

	isEmpty(): boolean;

	clear(): void;

}

interface ActionContinuation extends Tellable, Messagable {

	onExpressionValueChange(expression: string): WatchContinuation;

	/**
	 * Evaluates an expression.
	 * @param expression Expression to evaluate.
	 */
	evaluate<T>(expression: string): T;

	getParent(): Nestable;

	getEl(): HTMLElement;

	getObject<T>(id: string, ...instanceArguments: InstanceArgument[]): T;

	getLogger(): Logger;

	properties(): Properties;

	getId(): string;

	getPrefix(): string;

	getName(): string;

	scope(): Scope;

	getValue<T>(): T;

	isMounted(): boolean;

	isConnected(): boolean;

	send(messageName: string, payload?: MessagePayload): SendContinuation;

	onInterval(millis?: number): IntervalContinuation;

	onMessage(messageName: string): OnContinuation;

	/**
	 * Get a {@linkcode FilterBuilder} object back to create a {@linkcode Filter} of lists in the model
	 * @param expression - primitive string representation expression of a JS iterable/array object
	 * @returns
	 */
	createFilter(expression: string): FilterBuilder;

	regions(): RegionContinuation;

	tell(name: string, payload?: MessagePayload): void;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	forSeries(name: string): SeriesOperations;

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

	getObject<T>(id: string, ...instanceArguments: InstanceArgument[]): T;

	getProperties(): MutableProperties;

	getScope(): Scope;

	getRoot(): Context;

	isRoot(): boolean;

	getParent(): Context;

	registerImplicit(id: string, template: string, options?: ComponentOptions): Context;

	/**
	 * Promotes this context's own object registration to its parent context, as an alias that resolves in this context.
	 * The alias is removed from the parent when this context is removed or released.
	 *
	 * @param id - the id of this context's own registration to promote
	 * @param overrideId - optional id to register the alias under in the parent, instead of id
	 * @returns this context
	 * @throws RegistrationError when this context has no registration of its own under id, or the parent already has one under the target id
	 * @throws UnsupportedOperationError when called on a root context or the global context
	 */
	promote(id: string, overrideId?: string): Context;

	getName(): string;

	getFullName(): string;

	addPreInitializer(thisObject: CallBackThisObject, callback: (context?: Context) => void): void;

	addInitializer(thisObject: CallBackThisObject, callback: (context?: Context) => void): void;

	addDisposer(thisObject: CallBackThisObject, callback: (context?: Context) => void): void;

	configure(callback: (context: Context) => void, thisObject?: CallBackThisObject): Context;

	addListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

	removeListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

	// TODO - provide a createLogger(name: string): Logger method

}

interface InternalContext extends Context {

	getRegistry(): Registry;

}

interface Stage extends Releasable {

	getContext(): Context;

	before(): SeriesOperations;

	after(): SeriesOperations;

	start(): Stage;

	setComponent(component: Nestable): Stage;

	setComponentByObjectId(componentName: string, defaultComponentName?: string): Stage;

	isStarted(): boolean;

	addInitializer(thisObject: CallBackThisObject, callback: (stage: Stage) => void): Stage;

}
interface Registry extends Register<Registry> {

	getObject<T>(id: string, instanceArguments: InstanceArgument[], localContext: Context): T;

	getLocalObject<T>(id: string, instanceArguments: InstanceArgument[], localContext: Context): T;

	extend(context: Context): Registry;

	/**
	 * Registers targetId as an alias for the source registry's own registration sourceId.
	 * Throws RegistrationError when targetId is already a local registration.
	 */
	registerAlias(targetId: string, source: Registry, sourceId: string): void;

	/**
	 * Removes the alias registered under targetId, only when it is an alias for the given source registry.
	 */
	removeAlias(targetId: string, source: Registry): void;

}

export { Context, InternalContext, Stage, Nestable, RegionContinuation, ActionContinuation, Registry, SeriesOperations };
