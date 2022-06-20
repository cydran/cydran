import ComponentInternals from "component/ComponentInternals";
import RegionContinuationImpl from "continuation/RegionContinuationImpl";
import { requireNotNull } from "util/Utils";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import Logger from "log/Logger";
import OnContinuation from "continuation/OnContinuation";
import OnContinuationImpl from "continuation/OnContinuationImpl";
import IntervalContinuation from "continuation/IntervalContinuation";
import MessageContinuation from "continuation/MessageContinuation";
import MessageContinuationImpl from "continuation/MessageContinuationImpl";
import Scope from "scope/Scope";
import ElementOperations from "component/ElementOperations";
import FormOperations from "component/FormOperations";
import MetadataContinuation from "component/MetadataContinuation";
import { DoContinuation, Nestable, RegionContinuation } from "interface/ComponentInterfaces";

class DoContinuationImpl implements DoContinuation {

	private context: any;

	private internals: ComponentInternals;

	constructor(context: any, internals: ComponentInternals) {
		this.context = requireNotNull(context, "context");
		this.internals = requireNotNull(internals, "internals");
	}

	onExpressionChange<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		this.internals.watch(expression, target, reducerFn, context);
	}

	onMessage(messageName: string): OnContinuation {
		return new OnContinuationImpl(this.internals, messageName);
	}

	onInterval(millis: Number = 1000): IntervalContinuation {
		throw new Error("Method not implemented.");
	}

	public message2(payload?: any): MessageContinuation {
		return null;
	}

	public message(channelName: string, messageName: string): MessageContinuation {
		return new MessageContinuationImpl(this.internals, channelName, messageName);
	}

	public createFilter(expression: string) {
		return this.internals.withFilter(this.context.$c(), requireNotNull(expression, "expression"));
	}

	public regions(): RegionContinuation {
		return new RegionContinuationImpl(this.internals);
	}

	public forElement<E extends HTMLElement>(name: string): ElementOperations<E> {
		return this.internals.forElement(name);
	}

	public forForm(name: string): FormOperations {
		return this.internals.forForm(name);
	}

	public forForms(): FormOperations {
		return this.internals.forForms();
	}

	/**
	 * Get the {@link MetadataContinuation} of the {@link Component}
	 */
	 public metadata(): MetadataContinuation {
		const internal: ComponentInternals = this.internals;

		return {
			get: (name: string) => internal.getMetadata(name),
			has: (name: string) => internal.hasMetadata(name)
		};
	}

	public isMounted(): boolean {
		return this.internals.isMounted();
	}

	public isConnected(): boolean {
		return this.internals.isConnected();
	}

	public tell(name: string, payload?: any): void {
		this.internals.tell(name, payload);
	}

	public sync(): void {
		this.internals.sync();
	}

	public evaluate<T>(expression: string): T {
		return this.internals.evaluate(expression);
	}

	public getParent(): Nestable {
		return this.internals.getParent();
	}

	public getEl(): HTMLElement {
		return this.internals.getEl();
	}

	public getObject<T>(id: string): T {
		return this.internals.get(id);
	}

	public getLogger(): Logger {
		return this.internals.getLogger();
	}

	public getLoggerFactory(): LoggerFactory {
		return this.internals.getLoggerFactory();
	}

	public getWatchContext(): any {
		return this.internals.getWatchContext();
	}

	public properties(): Properties {
		return this.internals.getModule().getProperties();
	}

	public getId(): string {
		return this.internals.getId();
	}

	public getPrefix(): string {
		return this.internals.getPrefix();
	}

	public getName(): string {
		return this.internals.getName();
	}

	public scope(): Scope {
		return this.internals.getScope();
	}

	public getValue<T>(): T {
		return this.internals.getData() as T;
	}

}

export default DoContinuationImpl;
