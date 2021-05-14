import ElementMediator from "mediator/ElementMediator";
import ElementMediatorInternals from "mediator/ElementMediatorInternals";
import { ElementMediatorInternalsImpl } from "mediator/ElementMediatorInternalsImpl";
import Validators from "validator/Validators";
import OnContinuation from "message/OnContinuation";
import Nestable from "interface/ables/Nestable";
import ModelMediator from "mediator/ModelMediator";

abstract class AbstractBaseElementMediator<M, E extends HTMLElement | Text, P>
	implements ElementMediator<M, E, P> {
	// tslint:disable-next-line:variable-name
	private ____cydran$$internals____: ElementMediatorInternals<M, E, P>;

	constructor(reducerFn: (input: any) => M) {
		this.____cydran$$internals____ = new ElementMediatorInternalsImpl(this, reducerFn);
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		this.____cydran$$internals____.message(channelName, messageName, payload);
	}

	public tell(name: string, payload?: any): void {
		this.____cydran$$internals____.tell(name, payload);
	}

	public is(name: string): boolean {
		return this.____cydran$$internals____.is(name);
	}

	public $dispose(): void {
		this.____cydran$$internals____.$dispose();
	}

	public getId(): string {
		return this.____cydran$$internals____.getId();
	}

	public onInit(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public abstract onPopulate(): void;

	public onMount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onUnmount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onDispose(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onNestingChanged(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onValidate(el: E, fn: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	protected isMutable(): boolean {
		return this.____cydran$$internals____.isMutable();
	}

	protected get<U>(id: string): U {
		return this.____cydran$$internals____.get(id);
	}

	protected broadcast(channelName: string, messageName: string, payload?: any): void {
		this.____cydran$$internals____.broadcast(channelName, messageName, payload);
	}

	protected broadcastGlobally(
		channelName: string,
		messageName: string,
		payload?: any
	): void {
		this.____cydran$$internals____.broadcastGlobally(channelName, messageName, payload);
	}

	protected on(messageName: string): OnContinuation {
		return this.____cydran$$internals____.on(messageName);
	}

	protected bridge(name: string): void {
		this.____cydran$$internals____.bridge(name);
	}

	/**
	 * Get the associated {HTMLElement html element} of this element mediator.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): E {
		return this.____cydran$$internals____.getEl();
	}

	protected getParams(): P {
		return this.____cydran$$internals____.getParams();
	}

	protected getMediatorPrefix(): string {
		return this.____cydran$$internals____.getMediatorPrefix();
	}

	protected getExpression(): string {
		return this.____cydran$$internals____.getExpression();
	}

	protected mediate<T>(
		expression: string,
		reducerFn?: (input: any) => T
	): ModelMediator<T> {
		return this.____cydran$$internals____.mediate(expression, reducerFn);
	}

	protected getModel(): any {
		return this.____cydran$$internals____.getModel();
	}

	protected getParent(): Nestable {
		return this.____cydran$$internals____.getParent();
	}

	protected getModelMediator(): ModelMediator<M> {
		return this.____cydran$$internals____.getModelMediator();
	}

	protected $apply(fn: Function, args: any[]): any {
		return this.____cydran$$internals____.$apply(fn, args);
	}
}


export default AbstractBaseElementMediator;