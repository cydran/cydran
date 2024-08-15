import Behavior from "behavior/Behavior";
import DigestableSource from "behavior/DigestableSource";
import Logger from "log/Logger";
import Mediator from "mediator/Mediator";
import Attributes from "component/Attributes";
import BehaviorInternals from 'behavior/BehaviorInternals';
import BehaviorInternalsImpl from "behavior/BehaviorInternalsImpl";
import FieldValidations from "validator/FieldValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import SimpleMap from "interface/SimpleMap";
import OnContinuation from "continuation/OnContinuation";
import BehaviorMessageContinuationImpl from "behavior/BehaviorMessageContinuationImpl";
import { Nestable } from "interface/ComponentInterfaces";
import SendContinuation from "continuation/SendContinuation";
import { Context } from "context/Context";

abstract class AbstractBehavior<M, E extends HTMLElement | Text, P> implements Behavior<M, E, P> {

	// tslint:disable-next-line
	private ____internal$$cydran____: BehaviorInternals<M, E, P>;

	constructor() {
		this.____internal$$cydran____ = new BehaviorInternalsImpl<M, E, P>(this);
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		// Intentionally do nothing by default
	}

	public onInit(dependencies?: any): void {
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
	 * Get the active context instance reference by id
	 * @return U
	 */
	 public getObject<U>(id: string): U {
		return this.____internal$$cydran____.getObject(id);
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 */
	public send(messageName: string, payload?: any): SendContinuation {
	 return new BehaviorMessageContinuationImpl(this.____internal$$cydran____, messageName, payload);
	}

	public tell(name: string, payload?: any): void {
		this.____internal$$cydran____.tell(name, payload);
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
	 * [getContext description]
	 * @return {Context} [description]
	 */
	protected getContext(): Context {
		return this.____internal$$cydran____.getContext();
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
	 * [getTargetComponent description]
	 * @return {Component} [description]
	 */
	protected getTargetComponent(): Nestable {
		return this.____internal$$cydran____.getTargetComponent();
	}

	/**
	 * [getMediator description]
	 * @return {Mediator} [description]
	 */
	protected getMediator(): Mediator<M> {
		return this.____internal$$cydran____.getMediator();
	}

	protected sync(): any {
		this.____internal$$cydran____.sync();
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

}

export default AbstractBehavior;
