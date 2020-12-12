import { RegistryStrategy } from "interface/Strategy";
import { Gettable } from "interface/Bean";
import { ComponentInternals } from "interface/Component";
import { Disposable, Messagable, Nestable, Tellable } from "interface/Ables";
import { Module } from "interface/Module";
import { MediatorSource, ModelMediator } from "interface/Mediator";
import { AttributeExtractor } from "interface/Element";

interface Type<T> extends Function {

	// tslint:disable-next-line
	new(...args: any[]): T;

}

interface Phase {

	process(items: any[]): any[];

	invalidate(): void;

	setCallback(callback: () => void): void;

}

interface Watcher<T> extends Supplier<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

interface Callback {
	context: any;
	fn: () => void;
}

interface EventHooks<T> {

	add(listener: (context: T) => void): void;

	notify(context: T): void;

}

interface Hooks {

	getDigestionCycleStartHooks(): EventHooks<Nestable>;

}

interface Mvvm extends MediatorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

	$dispose(): void;

	getId(): string;

	getNamedElement<E extends HTMLElement>(name: string): E;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getScope(): Scope;

	skipId(id: string): void;

	getMessagables(): Messagable[];

	getModule(): Module;

	getModel(): any;

	createRegionName(): string;

	addRegion(name: string, element: HTMLElement, locked: boolean): Region;

	addNamedElement(name: string, element: HTMLElement): void;

	addMediator(mediator: any): void;

	addPropagatingElementMediator(mediator: any): void;

	getExtractor(): AttributeExtractor;

	isValidated(): boolean;

}

/**
 * Dependencies for {@link ElementMediator}
 */

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	message(channelName: string, messageName: string, payload: any): void;

	hasComponent(): boolean;

}

interface DomWalker<C> {

	walk(root: HTMLElement, context: C): void;

}

interface Supplier<T> {

	get(): T;

}

interface Broker extends Disposable {

	broadcast(channelName: string, messageName: string, payload?: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

}

interface OnContinuation {

	invoke(target: (payload: any) => void): void;

	forChannel(name: string): ForChannelContinuation;

}

interface ForChannelContinuation {

	invoke(target: (payload: any) => void): void;

}

interface Listener extends Disposable {

	register(messageName: string, fn: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

	getChannelName(): string;

}

interface PubSub extends Disposable {

	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	enableGlobal(): void;

	disableGlobal(): void;

	isGlobalEnabled(): boolean;

}

interface Scope {

	add(name: string, item: any): void;

	remove(name: string): void;

}

interface Factory<T> extends Disposable {

	get(gettable: Gettable): T;

}

export {
	Factory,
	Scope,
	PubSub,
	Listener,
	OnContinuation,
	ForChannelContinuation,
	Broker,
	Callback,
	DomWalker,
	EventHooks,
	Hooks,
	Mvvm,
	Phase,
	Region,
	Supplier,
	Type,
	Watcher
};