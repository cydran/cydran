import { ComponentInternals } from "interface/Component";
import { Module } from "interface/Module";
import { OnContinuation } from "interface/General";
import { MediatorSource, ModelMediator } from "interface/Mediator";
import { Disposable, Nestable, Tellable } from "./Ables";
import { Validators } from "./Validators";

interface ElementMediatorDependencies {
	/**
	 * Guts of a {@link Component}
	 */
	parent: ComponentInternals;

	/**
	 * The bound HTML element
	 */
	el: HTMLElement | Text;

	/**
	 * The bound expression of "truthiness"
	 */
	expression: string;

	/**
	 * The bound Cydran model of the {@link Component}
	 */
	model: any;

	/**
	 * Prefix of any Cydran attribute.
	 */
	prefix: string;

	/**
	 * Attribute prefix of the mediator.
	 */
	mediatorPrefix: string;

	/**
	 * Module instance.
	 */
	module: Module;

	/**
	 * Whether validation is active.
	 */
	validated: boolean;

	/**
	 * Whether the expression is mutable.
	 */
	mutable: boolean;
}

interface ElementMediatorInternals<M, E extends HTMLElement | Text, P> extends Disposable, Tellable {
	initialize(dependencies: ElementMediatorDependencies): void;

	validate(): void;

	populate(): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

	$dispose(): void;

	getId(): string;

	get<U>(id: string): U;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	getEl(): E;

	getParams(): P;

	getMediatorPrefix(): string;

	getExpression(): string;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	getModel(): any;

	getParent(): Nestable;

	getModelMediator(): ModelMediator<M>;

	$apply(fn: Function, args: any[]): any;
}

interface ElementMediator<M, E extends HTMLElement | Text, P> extends Disposable, MediatorSource, Tellable {
	// /**
	//  * Get the active module instance reference by id
	//  * @return U
	//  */
	// get<U>(id: string): U;

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

	onInit(): void;

	onPopulate(): void;

	onMount(): void;

	onUnmount(): void;

	onDispose(): void;

	onValidate(el: E, fn: (name: string, value?: any) => Validators): void;

	onNestingChanged(): void;
}

interface ElementVisitor<E extends HTMLElement | Text | Comment, C> {
	visit(
		element: E,
		context: C,
		consumer: (element: HTMLElement | Text | Comment) => void,
		topLevel: boolean
	): void;
}

interface ElementReference<E extends HTMLElement> {
	set(element: E): void;

	get(): E;
}

interface NamedElementOperations<E extends HTMLElement> {
	get(): E;

	focus(): void;

	blur(): void;
}

interface AttributeExtractor {
	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isMediatorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractMediatorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;
}

export {
	AttributeExtractor,
	ElementMediator,
	ElementMediatorDependencies,
	ElementMediatorInternals,
	ElementReference,
	ElementVisitor,
	NamedElementOperations
};