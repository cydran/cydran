import Behavior from "behavior/Behavior";
import DigestableSource from "behavior/DigestableSource";
import Logger from "log/Logger";
import Mediator from "mediator/Mediator";
import Attributes from "component/Attributes";
import Module from "module/Module";
import Nestable from "interface/ables/Nestable";
import OnContinuation from "message/OnContinuation";
import BehaviorInternals from 'behavior/BehaviorInternals';
import BehaviorInternalsImpl from "behavior/BehaviorInternalsImpl";
import FieldValidations from "validator/FieldValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import Dom from "dom/Dom";
import SimpleMap from "interface/SimpleMap";

abstract class AbstractBehavior<M, E extends HTMLElement | Text, P> implements Behavior<M, E, P> {

	// tslint:disable-next-line
	private ____internal$$cydran____: BehaviorInternals<M, E, P>;

	constructor() {
		this.____internal$$cydran____ = new BehaviorInternalsImpl<M, E, P>(this);
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		// Intentionally do nothing by default
	}

	public onInit(context?: any): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onMount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onUnmount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	public onRemount(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	protected notify(name: string, payload: any): void {
		this.____internal$$cydran____.notify(name, payload);
	}

	protected notifyElement(name: string, payload: any, element: HTMLElement): void {
		this.____internal$$cydran____.notifyElement(name, payload, element);
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

	public tell(name: string, payload?: any): void {
		this.____internal$$cydran____.tell(name, payload);
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

	protected setDefaultExpression(defaultExpression: string): void {
		this.____internal$$cydran____.setDefaultExpression(defaultExpression);
	}

	protected getExtractor(): Attributes {
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

	protected invoke(params?: any): void {
		this.____internal$$cydran____.invoke(params);
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

	protected isMounted(): boolean {
		return this.____internal$$cydran____.isMounted();
	}

	protected isValidated(): boolean {
		return this.____internal$$cydran____.isValidated();
	}

	protected setDefaults(defaults: P): void {
		this.____internal$$cydran____.setDefaults(defaults);
	}

	protected setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void {
		this.____internal$$cydran____.setValuelessDefaults(valuelessDefaults);
	}

	protected setValidations(validations: FieldValidations<HTMLElement>): void {
		this.____internal$$cydran____.setValidations(validations);
	}

	protected setConverters(converters: BehaviorAttributeConverters): void {
		this.____internal$$cydran____.setConverters(converters);
	}

	protected setLoggerName(name: string): void {
		this.____internal$$cydran____.setLoggerName(name);
	}

	protected setReducerFn(reducerFn: (input: any) => M): void {
		this.____internal$$cydran____.setReducerFn(reducerFn);
	}

	protected getDom(): Dom {
		return this.____internal$$cydran____.getDom();
	}

}

export default AbstractBehavior;
