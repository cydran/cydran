import Behavior from "behavior/Behavior";
import BehaviorSource from "behavior/BehaviorSource";
import Logger from "log/Logger";
import Mediator from "mediator/Mediator";
import Validators from "validator/Validators";
import AttributeExtractor from "component/AttributeExtractor";
import Module from "module/Module";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";
import Nestable from "interface/ables/Nestable";
import OnContinuation from "message/OnContinuation";

import BehaviorInternals from 'behavior/BehaviorInternals';
import BehaviorInternalsImpl from "behavior/BehaviorInternalsImpl";

abstract class AbstractBehavior<M, E extends HTMLElement | Text, P> implements Behavior<M, E, P> {

	// tslint:disable-next-line
	private ____internal$$cydran____: BehaviorInternals<M, E, P>;

	constructor(reducerFn: (input: any) => M) {
		this.____internal$$cydran____ = new BehaviorInternalsImpl<M, E, P>(this, reducerFn);
	}


	// -------------------------------------- Outliers ------------------------------------------

	// TODO - Get this out of here ASAP
	public is(name: string): boolean {
		return this[name]() as boolean;
	}

	protected populate(): void {
		// Intentionally do nothing
	}

	public tell(name: string, payload?: any): void {
		switch (name) {
			case "populate":
				this.populate();
				break;

			default:
				this.____internal$$cydran____.tell(name, payload);
		}
	}

	public requestBehaviorSources(sources: BehaviorSource[]): void {
		// Intentionally do nothing by default
	}

	public requestBehaviors(consumer: DigestionCandidateConsumer): void {
		// Intentionally do nothing by default
	}

	// -------------------------------------- Checked ------------------------------------------

	public onRemount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onInit(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onPopulate(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onMount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onUnmount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onDispose(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onValidate(el: E, fn: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	/**
	 * Dispose of Behavior when released.
	 * + All event listeners will be removed.
	 * + This behavior will be unwired from any other DOM entanglements
	 * + The mediator reference to the model is released/nulled
	 * + Any value representation of this behavior is released/nulled
	 * + The [[Mvvm|mvvm]] refernce is released/nulled
	 * + The parental reference is released/nulled
	 */
	 public $dispose(): void {
		this.____internal$$cydran____.$dispose();
		this.____internal$$cydran____ = null;
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	 public get<U>(id: string): U {
		return this.____internal$$cydran____.get(id);
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	 public message(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.message(channelName, messageName, payload);
	}

	/**
	 * Broadcast a message
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcast(channelName, messageName, payload);
	}

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcastGlobally(channelName, messageName, payload);
	}

	public on(messageName: string): OnContinuation {
		return this.____internal$$cydran____.on(messageName);
	}

	public getParentId(): string {
		return this.____internal$$cydran____.getParentId();
	}

	public getId(): string {
		return this.____internal$$cydran____.getId();
	}

	public isFlagged(name: string): boolean {
		return this.____internal$$cydran____.isFlagged(name);
	}

	protected setFlag(name: string): void {
		this.____internal$$cydran____.setFlag(name);
	}

	protected getExtractor(): AttributeExtractor {
		return this.____internal$$cydran____.getExtractor();
	}

	protected getParams(): P {
		return this.____internal$$cydran____.getParams();
	}

	protected getModelFn(): () => any {
		return this.____internal$$cydran____.getModelFn();
	}

	protected getValueFn(): () => any {
		return this.____internal$$cydran____.getValueFn();
	}

	protected bridge(name: string): void {
		this.____internal$$cydran____.bridge(name);
	}

	/**
	 * Get the associated {HTMLElement html element} of this behavior.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): E {
		return this.____internal$$cydran____.getEl() as E;
	}

	/**
	 * [getModule description]
	 * @return {Module} [description]
	 */
	protected getModule(): Module {
		return this.____internal$$cydran____.getModule();
	}

	/**
	 * Gets the prefix of all Cydran attributes on the component.
	 * @return the prefix
	 */
	protected getPrefix(): string {
		return this.____internal$$cydran____.getPrefix();
	}

	/**
	 * Gets the prefix for the behavior.
	 * @return the behavior prefix
	 */
	protected getBehaviorPrefix(): string {
		return this.____internal$$cydran____.getBehaviorPrefix();
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {mediator}            [description]
	 */
	protected mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T> {
		return this.____internal$$cydran____.mediate(expression, reducerFn);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	protected getModel(): any {
		return this.____internal$$cydran____.getModel();
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	protected getParent(): Nestable {
		return this.____internal$$cydran____.getParent();
	}

	/**
	 * [getMediator description]
	 * @return {Mediator} [description]
	 */
	protected getMediator(): Mediator<M> {
		return this.____internal$$cydran____.getMediator();
	}

	protected $apply(fn: Function, args: any[]): any {
		this.____internal$$cydran____.$apply(fn, args);
	}

	/**
	 * Get the expression specified
	 * @return {string} [description]
	 */
	protected getExpression(): string {
		return this.____internal$$cydran____.getExpression();
	}

	/**
	 * Gets the logger.
	 * @return {Logger} logger instance
	 */
	protected getLogger(): Logger {
		return this.____internal$$cydran____.getLogger();
	}

	protected isMutable(): boolean {
		return this.____internal$$cydran____.isMutable();
	}

}

export default AbstractBehavior;
