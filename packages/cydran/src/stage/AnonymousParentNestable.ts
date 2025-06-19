/* eslint-disable */
import ElementOperations from "component/ElementOperations";
import FormOperations from "component/FormOperations";
import MetadataContinuation from "component/MetadataContinuation";
import { ActionContinuation, Context, Nestable, RegionContinuation, SeriesOperations } from "context/Context";
import IntervalContinuation from "continuation/IntervalContinuation";
import OnContinuation from "continuation/OnContinuation";
import SendContinuation from "continuation/SendContinuation";
import { FilterBuilder } from "filter/Filter";
import Logger from "log/Logger";
import { Properties } from "properties/Property";
import Scope from "scope/Scope";

class ActionContinuationImpl implements ActionContinuation {

	public getParent(): Nestable {
		throw new Error("Method not implemented.");
	}

	public getEl(): HTMLElement {
		throw new Error("Method not implemented.");
	}

	public getObject<T>(id: string, ...instanceArguments: unknown[]): T {
		throw new Error("Method not implemented.");
	}

	public getLogger(): Logger {
		throw new Error("Method not implemented.");
	}

	public properties(): Properties {
		throw new Error("Method not implemented.");
	}

	public getId(): string {
		throw new Error("Method not implemented.");
	}

	public getPrefix(): string {
		throw new Error("Method not implemented.");
	}

	public getName(): string {
		throw new Error("Method not implemented.");
	}

	public scope(): Scope {
		throw new Error("Method not implemented.");
	}

	public getValue<T>(): T {
		throw new Error("Method not implemented.");
	}

	public isMounted(): boolean {
		return true;
	}

	public isConnected(): boolean {
		throw new Error("Method not implemented.");
	}

	public send(messageName: string, payload?: unknown): SendContinuation {
		throw new Error("Method not implemented.");
	}

	public onInterval(millis?: Number): IntervalContinuation {
		throw new Error("Method not implemented.");
	}

	public onMessage(messageName: string): OnContinuation {
		throw new Error("Method not implemented.");
	}

	public createFilter(expression: string): FilterBuilder {
		throw new Error("Method not implemented.");
	}

	public regions(): RegionContinuation {
		throw new Error("Method not implemented.");
	}

	public tell(name: string, payload?: unknown): void {
		throw new Error("Method not implemented.");
	}

	public forElement<E extends HTMLElement>(name: string): ElementOperations<E> {
		throw new Error("Method not implemented.");
	}

	public forSeries(name: string): SeriesOperations {
		throw new Error("Method not implemented.");
	}

	public forForm(name: string): FormOperations {
		throw new Error("Method not implemented.");
	}

	public forForms(): FormOperations {
		throw new Error("Method not implemented.");
	}

	public metadata(): MetadataContinuation {
		throw new Error("Method not implemented.");
	}

	public sync(): void {
		throw new Error("Method not implemented.");
	}

	public getContext(): Context {
		throw new Error("Method not implemented.");
	}

	public onExpressionValueChange<T>(expression: string, callback: (previous: T, current: T) => void, reducerFn?: (input: unknown) => T, thisObject?: Object): void {
		throw new Error("Method not implemented.");
	}

	public evaluate<T>(expression: string): T {
		throw new Error("Method not implemented.");
	}

	public getWatchScope(): unknown {
		throw new Error("Method not implemented.");
	}

}

class AnonymousParentNestable implements Nestable {

	private continuation: ActionContinuation;

	constructor() {
		this.continuation = new ActionContinuationImpl();
	}

	public onMount(): void {
		// Intentionally do nothing
	}

	public onUnmount(): void {
		// Intentionally do nothing
	}

	public onRemount(): void {
		// Intentionally do nothing
	}

	public $c(): ActionContinuation {
		return this.continuation;
	}

}

export default AnonymousParentNestable;
