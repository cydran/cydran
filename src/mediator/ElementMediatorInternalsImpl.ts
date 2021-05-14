import ElementMediatorInternals from "mediator/ElementMediatorInternals";
import ModelMediator from "mediator/ModelMediator";
import ElementMediatorDependencies from "mediator/ElementMediatorDependencies";
import PubSub from "message/PubSub";
import OnContinuation from "message/OnContinuation";
import PubSubImpl from "message/PubSubImpl";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Machine from "machine/Machine";
import MachineContext from "machine/MachineContext";
import ElementMediator from "mediator/ElementMediator";
import Nestable from "interface/ables/Nestable";
import Module from "module/Module";
import Validator from "validator/Validator";
import ValidatorImpl from "validator/ValidatorImpl";
import IdGenerator from "util/IdGenerator";
import stateMachineBuilder from "machine/StateMachineBuilder";

import { VALID_ID, DOM_KEY, INTERNAL_CHANNEL_NAME, NESTING_CHANGED } from "Constants";
import {
	requireNotNull,
	isDefined,
	extractAttributes,
	requireValid,
	elementAsString
} from "util/Utils";

class ElementMediatorInternalsImpl<M, E extends HTMLElement | Text, P>
	implements ElementMediatorInternals<M, E, P> {
	private logger: Logger;

	private machine: Machine<ElementMediatorInternals<M, E, P>>;

	private context: MachineContext<ElementMediatorInternals<M, E, P>>;

	private reducerFn?: (input: any) => M;

	private mediator: ModelMediator<M>;

	private domListeners: {
		[name: string]: any;
	};

	private id: string;

	private params: P;

	private pubSub: PubSub;

	private dependencies: ElementMediatorDependencies;

	private parent: ElementMediator<M, E, P>;

	constructor(parent: ElementMediator<M, E, P>, reducerFn: (input: any) => M) {
		this.machine = (BASE_ELEMENT_MEDIATOR_MACHINE as unknown) as Machine<
			ElementMediatorInternalsImpl<M, E, P>
		>;
		this.parent = requireNotNull(parent, "parent");
		this.domListeners = {};
		this.params = null;
		this.id = IdGenerator.INSTANCE.generate();
		this.reducerFn = reducerFn;
		this.context = (this.machine.create(this) as unknown) as MachineContext<
			ElementMediatorInternals<M, E, P>
		>;
	}

	public isMutable(): boolean {
		return this.dependencies.mutable;
	}

	public tell(name: string, payload?: any): void {
		// TODO - Remove nesting changed concept potentially
		if (name === NESTING_CHANGED) {
			this.parent.onNestingChanged();
		} else {
			this.machine.evaluate(name, this.context, payload);
		}
	}

	public initialize(dependencies: ElementMediatorDependencies): void {
		this.dependencies = dependencies;
		this.logger = LoggerFactory.getLogger(`ElementMediator: ${dependencies.prefix}`);
		this.pubSub = new PubSubImpl(this, this.getModule());
		this.parent.onInit();
	}

	public validate(): void {
		const validator: Validator = new ValidatorImpl();
		this.parent.onValidate(this.getEl(), validator.getFunction());
		validator.throwIfErrors(
			() =>
				`Invalid use of a ${
					this.dependencies.prefix
				} attribute on element ${elementAsString(this.getEl() as HTMLElement)}`
		);
	}

	public populate(): void {
		this.parent.onPopulate();
	}

	public mount(): void {
		this.parent.onMount();
	}

	public unmount(): void {
		this.parent.onUnmount();
	}

	public digest(): void {
		// TODO - Implement
	}

	public $dispose(): void {
		this.parent.onDispose();
		this.removeDomListeners();
		this.dependencies = null;
		this.mediator = null;
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
		this.dependencies.module.broadcastGlobally(channelName, messageName, actualPayload);
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

	// TODO - Get this out of here ASAP
	public is(name: string): boolean {
		return isDefined(this[name]) ? this[name]() : false as boolean;
	}

	public getId(): string {
		return this.id;
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	public get<U>(id: string): U {
		requireValid(id, "id", VALID_ID);
		return this.dependencies.module.get(id);
	}

	public bridge(name: string): void {
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
	public getEl(): E {
		return this.dependencies.el as E;
	}

	/**
	 * [getModule description]
	 * @return {Module} [description]
	 */
	public getModule(): Module {
		return this.dependencies.module;
	}

	public getParams(): P {
		if (this.params === null) {
			this.params = extractAttributes<P>(
				this.getMediatorPrefix(),
				this.getEl() as HTMLElement
			);
		}

		return this.params;
	}

	/**
	 * Gets the prefix for the mediator.
	 * @return the mediator prefix
	 */
	public getMediatorPrefix(): string {
		return this.dependencies.mediatorPrefix;
	}

	public getExpression(): string {
		return this.dependencies.expression;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {ModelMediator}            [description]
	 */
	public mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		requireNotNull(expression, "expression");
		return this.dependencies.parent.mediate(expression, reducerFn);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	public getModel(): any {
		return this.dependencies.model;
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	public getParent(): Nestable {
		return this.dependencies.parent.getComponent();
	}

	/**
	 * [getMediator description]
	 * @return {ModelMediator} [description]
	 */
	public getModelMediator(): ModelMediator<M> {
		if (!isDefined(this.mediator)) {
			this.mediator = this.mediate(this.getExpression(), this.reducerFn);
		}

		return this.mediator;
	}

	public $apply(fn: Function, args: any[]): any {
		requireNotNull(fn, "fn");
		requireNotNull(args, "args");

		if (this.dependencies) {
			this.dependencies.parent.$apply(fn, args);
		}
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

const BASE_ELEMENT_MEDIATOR_MACHINE: Machine<
	ElementMediatorInternalsImpl<any, HTMLElement | Text, any>
> = stateMachineBuilder<ElementMediatorInternalsImpl<any, HTMLElement | Text, any>>(
	"UNINITIALIZED"
)
	.withState("UNINITIALIZED", [])
	.withState("VALIDATED", [])
	.withState("READY", [])
	.withState("POPULATED", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		ElementMediatorInternalsImpl.prototype.initialize
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		ElementMediatorInternalsImpl.prototype.validate
	])
	.withTransition("VALIDATED", "init", "READY", [
		ElementMediatorInternalsImpl.prototype.initialize
	])
	.withTransition("READY", "dispose", "DISPOSED", [
		ElementMediatorInternalsImpl.prototype.$dispose
	])
	.withTransition("READY", "populate", "POPULATED", [
		ElementMediatorInternalsImpl.prototype.populate
	])
	.withTransition("POPULATED", "mount", "MOUNTED", [
		ElementMediatorInternalsImpl.prototype.mount
	])

	.withTransition("MOUNTED", "populate", "MOUNTED", [
		() => {
			// Intentionally do nothing
		}
	])

	.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
		ElementMediatorInternalsImpl.prototype.unmount
	])
	.withTransition("MOUNTED", "digest", "MOUNTED", [
		ElementMediatorInternalsImpl.prototype.digest
	])
	.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
		ElementMediatorInternalsImpl.prototype.$dispose
	])
	.build();

export { ElementMediatorInternalsImpl, BASE_ELEMENT_MEDIATOR_MACHINE };
