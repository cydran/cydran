import ElementMediator from "mediator/ElementMediator";
import ElementMediatorDependencies from "mediator/ElementMediatorDependencies";
import MediatorSource from "mediator/MediatorSource";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ModelMediator from "mediator/ModelMediator";
import IdGenerator from "util/IdGenerator";
import Validators from "validator/Validators";
import AttributeExtractor from "element/AttributeExtractor";
import Validator from "validator/Validator";
import ValidatorImpl from "validator/ValidatorImpl";
import Module from "module/Module";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";
import Nestable from "interface/ables/Nestable";
import MachineContext from "machine/MachineContext";
import PubSub from "message/PubSub";
import OnContinuation from "message/OnContinuation";
import PubSubImpl from "message/PubSubImpl";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import { isDefined, requireNotNull } from "util/Utils";
import { requireValid, elementAsString, extractAttributes } from "util/Utils";
import { VALID_ID, INTERNAL_CHANNEL_NAME, DOM_KEY } from "Constants";

abstract class AbstractElementMediator<M, E extends HTMLElement | Text, P>
	implements ElementMediator<M, E, P> {
	private logger: Logger;

	// tslint:disable-next-line
	private ____internal$$cydran____: ElementMediatorDependencies;

	private mediator: ModelMediator<M>;

	private pubSub: PubSub;

	private propagation: boolean;

	private topLevelSupported: boolean;

	private domListeners: {
		[name: string]: any;
	};

	private id: string;

	private params: P;

	private reducerFn?: (input: any) => M;

	private childrenConsumable: boolean;

	private context: MachineContext<AbstractElementMediator<M, E, P>>;

	constructor(
		dependencies: any,
		propagation: boolean,
		reducerFn: (input: any) => M,
		topLevelSupported?: boolean
	) {
		this.topLevelSupported = isDefined(topLevelSupported) ? topLevelSupported : true;
		this.____internal$$cydran____ = requireNotNull(dependencies, "dependencies");
		this.logger = LoggerFactory.getLogger(`ElementMediator: ${dependencies.prefix}`);
		this.domListeners = {};
		this.pubSub = new PubSubImpl(this, this.getModule());
		this.params = null;
		this.propagation = propagation;
		this.id = IdGenerator.INSTANCE.generate();
		this.reducerFn = reducerFn;
		this.childrenConsumable = true;

		this.context = ELEMENT_MEDIATOR_MACHINE.create(
			this as AbstractElementMediator<any, HTMLElement, any>
		) as MachineContext<AbstractElementMediator<M, E, P>>;

		if (this.____internal$$cydran____.validated) {
			this.submit("validate");
		}

		this.submit("init");
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

	public onNestingChanged(): void {
		// Intentionally do nothing by default.  Override as needed.
	}

	/**
	 * Dispose of ElementMediator when released.
	 * + All event listeners will be removed.
	 * + This element mediator will be unwired from any other DOM entanglements
	 * + The mediator reference to the model is released/nulled
	 * + Any value representation of this element mediator is released/nulled
	 * + The [[Mvvm|mvvm]] refernce is released/nulled
	 * + The parental reference is released/nulled
	 */
	public $dispose(): void {
		this.removeDomListeners();
		this.unwire();
		this.____internal$$cydran____ = null;
		this.mediator = null;
	}

	// TODO - Get this out of here ASAP
	public is(name: string): boolean {
		return this[name]() as boolean;
	}

	protected populate(): void {
		// Intentionally do nothing
	}

	/**
	 * Initialize this element mediator.
	 */
	protected init(): void {
		this.wire();
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	public get<U>(id: string): U {
		requireValid(id, "id", VALID_ID);
		return this.____internal$$cydran____.module.get(id);
	}

	public tell(name: string, payload?: any): void {
		switch (name) {
			case "populate":
				this.populate();
				break;

			case "init":
				this.init();
				break;
		}
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;
		this.pubSub.message(channelName, messageName, actualPayload);
	}

	/**
	 * Broadcast a message
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;
		this.getModule().broadcast(channelName, messageName, actualPayload);
	}

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcastGlobally(
		channelName: string,
		messageName: string,
		payload?: any
	): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;
		this.____internal$$cydran____.module.broadcastGlobally(
			channelName,
			messageName,
			actualPayload
		);
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						this.pubSub
							.on(messageName)
							.forChannel(channelName)
							.invoke((payload: any) => {
								target.apply(this, [payload]);
							});
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				this.pubSub
					.on(messageName)
					.forChannel(INTERNAL_CHANNEL_NAME)
					.invoke((payload: any) => {
						target.apply(this, [payload]);
					});
			}
		};
	}

	public isChildrenConsumable(): boolean {
		return this.childrenConsumable;
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		// Intentionally do nothing by default
	}

	public getParentId(): string {
		return this.____internal$$cydran____.parent.getId();
	}

	public getId(): string {
		return this.id;
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		// Intentionally do nothing by default
	}

	public hasPropagation(): boolean {
		return this.propagation;
	}

	public isTopLevelSupported(): boolean {
		return this.topLevelSupported;
	}

	protected disableChildConsumption(): void {
		this.childrenConsumable = false;
	}

	protected getExtractor(): AttributeExtractor {
		return this.____internal$$cydran____.parent.getExtractor();
	}

	protected getParams(): P {
		if (this.params === null) {
			this.params = extractAttributes<P>(
				this.getMediatorPrefix(),
				this.getEl() as HTMLElement
			);
		}

		return this.params;
	}

	protected getModelFn(): () => any {
		return this.____internal$$cydran____.parent.getModelFn();
	}

	protected getValueFn(): () => any {
		return this.____internal$$cydran____.parent.getItemFn();
	}

	protected bridge(name: string): void {
		requireNotNull(name, "name");

		const listener = (event: Event) => {
			this.message(DOM_KEY, name, event);
		};

		if (!this.domListeners[name]) {
			this.domListeners[name] = listener;
			this.getEl().addEventListener(name, listener, false);
		}
	}

	/**
	 * Get the associated {HTMLElement html element} of this element mediator.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): E {
		return this.____internal$$cydran____.el as E;
	}

	/**
	 * [getModule description]
	 * @return {Module} [description]
	 */
	protected getModule(): Module {
		return this.____internal$$cydran____.module;
	}

	/**
	 * Gets the prefix of all Cydran attributes on the component.
	 * @return the prefix
	 */
	protected getPrefix(): string {
		return this.____internal$$cydran____.prefix;
	}

	/**
	 * Gets the prefix for the mediator.
	 * @return the mediator prefix
	 */
	protected getMediatorPrefix(): string {
		return this.____internal$$cydran____.mediatorPrefix;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {ModelMediator}            [description]
	 */
	protected mediate<T>(
		expression: string,
		reducerFn?: (input: any) => T
	): ModelMediator<T> {
		requireNotNull(expression, "expression");
		return this.____internal$$cydran____.parent.mediate(expression, reducerFn);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	protected getModel(): any {
		return this.____internal$$cydran____.model;
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	protected getParent(): Nestable {
		return this.____internal$$cydran____.parent.getComponent();
	}

	/**
	 * [getMediator description]
	 * @return {ModelMediator} [description]
	 */
	protected getModelMediator(): ModelMediator<M> {
		if (!isDefined(this.mediator)) {
			this.mediator = this.mediate(this.getExpression(), this.reducerFn);
		}

		return this.mediator;
	}

	protected $apply(fn: Function, args: any[]): any {
		requireNotNull(fn, "fn");
		requireNotNull(args, "args");

		if (this.____internal$$cydran____) {
			this.____internal$$cydran____.parent.$apply(fn, args);
		}
	}

	/**
	 * Get the expression specified
	 * @return {string} [description]
	 */
	protected getExpression(): string {
		return this.____internal$$cydran____.expression;
	}

	/**
	 * Gets the logger.
	 * @return {Logger} logger instance
	 */
	protected getLogger(): Logger {
		return this.logger;
	}

	/**
	 * Wire the element mediator
	 */
	protected abstract wire(): void;

	/**
	 * Unwire the element mediator
	 */
	protected abstract unwire(): void;

	protected abstract validate(
		element: E,
		check: (name: string, value?: any) => Validators
	): void;

	protected isMutable(): boolean {
		return this.____internal$$cydran____.mutable;
	}

	public _initialize(): void {
		// TODO - Implement
	}

	public _validate(): void {
		const validator: Validator = new ValidatorImpl();
		this.validate(this.getEl(), validator.getFunction());
		validator.throwIfErrors(
			() =>
				`Invalid use of a ${
					this.____internal$$cydran____.prefix
				} attribute on element ${elementAsString(this.getEl() as HTMLElement)}`
		);
	}

	public _$dispose(): void {
		// TODO - Implement
	}

	public _populate(): void {
		// TODO - Implement
	}

	public _populateChild(): void {
		// TODO - Implement
	}

	public _mount(): void {
		// TODO - Implement
	}

	public _mountChild(): void {
		// TODO - Implement
	}

	public _unmount(): void {
		// TODO - Implement
	}

	public _digest(): void {
		// TODO - Implement
	}

	public _remount(): void {
		// TODO - Implement
	}

	private submit(input: string, parameter?: any): void {
		ELEMENT_MEDIATOR_MACHINE.evaluate(
			input,
			this.context as MachineContext<AbstractElementMediator<any, HTMLElement, any>>,
			parameter
		);
	}

	private removeDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			this.getEl().removeEventListener(name, this.domListeners[name]);
		}

		this.domListeners = {};
	}
}

const ELEMENT_MEDIATOR_MACHINE: Machine<
	AbstractElementMediator<any, HTMLElement, any>
> = stateMachineBuilder<AbstractElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
	.withState("UNINITIALIZED", [])
	.withState("LEAF", [])
	.withState("VALIDATED", [])
	.withState("VALIDATED_LEAF", [])
	.withState("READY", [])
	.withState("READY_LEAF", [])
	.withState("IDENTIFIED_CHILD", [])
	.withState("POPULATED", [])
	.withState("POPULATED_CHILD", [])
	.withState("POPULATED_LEAF", [])
	.withState("PARSED", [])
	.withState("PARSED_CHILD", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "leaf", "LEAF", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		AbstractElementMediator.prototype._initialize
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		AbstractElementMediator.prototype._validate
	])
	.withTransition("LEAF", "init", "READY_LEAF", [
		AbstractElementMediator.prototype._initialize
	])
	.withTransition("LEAF", "validate", "VALIDATED_LEAF", [
		AbstractElementMediator.prototype._validate
	])
	.withTransition("VALIDATED", "init", "READY", [
		AbstractElementMediator.prototype._initialize
	])
	.withTransition("VALIDATED_LEAF", "init", "READY_LEAF", [
		AbstractElementMediator.prototype._initialize
	])
	.withTransition("READY", "markChild", "IDENTIFIED_CHILD", [])
	.withTransition("READY", "dispose", "DISPOSED", [
		AbstractElementMediator.prototype._$dispose
	])
	.withTransition("READY", "populate", "POPULATED", [
		AbstractElementMediator.prototype._populate
	])
	.withTransition("READY_LEAF", "populate", "POPULATED_LEAF", [
		AbstractElementMediator.prototype._populate
	])
	.withTransition("IDENTIFIED_CHILD", "populate", "POPULATED_CHILD", [
		AbstractElementMediator.prototype._populateChild
	])
	.withTransition("POPULATED", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mount
	])
	.withTransition("POPULATED_CHILD", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mountChild
	])
	.withTransition("POPULATED_LEAF", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mountChild
	])
	.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
		AbstractElementMediator.prototype._unmount
	])
	.withTransition("MOUNTED", "digest", "MOUNTED", [
		AbstractElementMediator.prototype._digest
	])
	.withTransition("UNMOUNTED", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._remount
	])
	.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
		AbstractElementMediator.prototype._$dispose
	])
	.build();

	const LEAF_ELEMENT_MEDIATOR_MACHINE: Machine<
		ElementMediator<any, HTMLElement, any>
	> = stateMachineBuilder<ElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
		.withState("UNINITIALIZED", [])
		.withState("VALIDATED", [])
		.withState("READY", [])
		.withState("POPULATED", [])
		.withState("MOUNTED", [])
		.withState("UNMOUNTED", [])
		.withState("DISPOSED", [])
		.withTransition("UNINITIALIZED", "init", "READY", [
			AbstractElementMediator.prototype._initialize
		])
		.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
			AbstractElementMediator.prototype._validate
		])
		.withTransition("VALIDATED", "init", "READY", [
			AbstractElementMediator.prototype._initialize
		])
		.withTransition("READY", "dispose", "DISPOSED", [
			AbstractElementMediator.prototype._$dispose
		])
		.withTransition("READY", "populate", "POPULATED", [
			AbstractElementMediator.prototype._populate
		])
		.withTransition("POPULATED", "mount", "MOUNTED", [
			AbstractElementMediator.prototype._mount
		])
		.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
			AbstractElementMediator.prototype._unmount
		])
		.withTransition("MOUNTED", "digest", "MOUNTED", [
			AbstractElementMediator.prototype._digest
		])
		.withTransition("UNMOUNTED", "mount", "MOUNTED", [
			AbstractElementMediator.prototype._remount
		])
		.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
			AbstractElementMediator.prototype._$dispose
		])
		.build();
		
const BRANCH_ELEMENT_MEDIATOR_MACHINE: Machine<
	ElementMediator<any, HTMLElement, any>
> = stateMachineBuilder<ElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
	.withState("UNINITIALIZED", [])
	.build();

export {
	AbstractElementMediator,
	ELEMENT_MEDIATOR_MACHINE,
	LEAF_ELEMENT_MEDIATOR_MACHINE,
	BRANCH_ELEMENT_MEDIATOR_MACHINE
};