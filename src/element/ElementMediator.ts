import Logger from "@/logger/Logger";
import ModelMediator from "@/model/ModelMediator";
import ObjectUtils from "@/util/ObjectUtils";
import PubSub from "@/messaging/PubSub";
import LoggerFactory from "@/logger/LoggerFactory";
import Module from "@/module/Module";
import { VALID_ID } from "@/constant/ValidationRegExp";
import Disposable from "@/pattern/Disposable";
import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import { OnContinuation } from "@/messaging/Continuation";
import { extractAttributes } from "@/util/ParamUtils";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import Modules from "@/module/Modules";
import { INTERNAL_CHANNEL_NAME } from "@/constant/Constants";
import Nestable from "@/component/Nestable";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

/**
 * The piece of code between the HTMLElement and the Mvvm
 * @type M {@link ModelMediator}
 * @type E extends HTMLElement
 * @implements {@link Disposable}
 */
abstract class ElementMediator<M, E extends HTMLElement | Text, P> implements Disposable {

	private logger: Logger;

	// tslint:disable-next-line
	private ____internal$$cydran____: ElementMediatorDependencies;

	private moduleInstance: Module;

	private mediator: ModelMediator<M>;

	private pubSub: PubSub;

	private propagation: boolean;

	private domListeners: {
		[name: string]: any;
	};

	private params: P;

	constructor(dependencies: any, propagation: boolean) {
		this.____internal$$cydran____ = requireNotNull(dependencies, "dependencies");
		this.logger = LoggerFactory.getLogger("ElementMediator: " + dependencies.prefix);
		this.domListeners = {};
		this.pubSub = new PubSub(this, this.getModule());
		this.params = null;
		this.propagation = propagation;
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
	public dispose(): void {
		this.removeDomListeners();
		this.unwire();
		this.____internal$$cydran____ = null;
		this.mediator = null;
	}

	/**
	 * Initialize this element mediator.
	 */
	public init(): void {
		this.mediator = this.mediate(this.getExpression());
		this.wire();
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	public get<U>(id: string): U {
		requireValid(id, "id", VALID_ID);
		return this.moduleInstance.get(id);
	}

	/**
	 * Set the [[Module|module]] instance reference
	 * @param {Module} moduleInstance
	 */
	public setModule(moduleInstance: Module): void {
		this.moduleInstance = requireNotNull(moduleInstance, "moduleInstance");
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
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

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
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

		this.getModule().broadcast(channelName, messageName, actualPayload);
	}

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

		Modules.broadcast(channelName, messageName, actualPayload);
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						this.pubSub.on(messageName).forChannel(channelName).invoke((payload: any) => {
							target.apply(this, [payload]);
						});
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				this.pubSub.on(messageName).forChannel(INTERNAL_CHANNEL_NAME).invoke((payload: any) => {
					target.apply(this, [payload]);
				});
			}
		};
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		// Intentionally do nothing by default
	}

	public hasPropagation(): boolean {
		return this.propagation;
	}

	protected getParams(): P {
		if (this.params === null) {
			this.params = extractAttributes<P>(this.getPrefix(), this.getEl() as HTMLElement);
		}

		return this.params;
	}

	protected getModelFn(): () => any {
		return this.____internal$$cydran____.mvvm.getModelFn();
	}

	protected getExternalFn(): () => any {
		return this.____internal$$cydran____.mvvm.getExternalFn();
	}

	protected bridge(name: string): void {
		requireNotNull(name, "name");

		const listener = (event: Event) => {
			this.message("dom", name, event);
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
		return this["moduleInstance"] as Module;
	}

	/**
	 * Gets the prefix.
	 * @return the prefix
	 */
	protected getPrefix(): string {
		return this.____internal$$cydran____.prefix;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {ModelMediator}            [description]
	 */
	protected mediate<T>(expression: string): ModelMediator<T> {
		requireNotNull(expression, "expression");
		return this.____internal$$cydran____.mvvm.mediate(expression);
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
		return this.mediator;
	}

	protected $apply(fn: Function, args: any[]): any {
		requireNotNull(fn, "fn");
		requireNotNull(args, "args");

		if (this.____internal$$cydran____ && this.____internal$$cydran____.mvvm) {
			this.____internal$$cydran____.mvvm.$apply(fn, args);
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

	private removeDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			const listener: any = this.domListeners[name];

			this.getEl().removeEventListener(name, listener);
		}

		this.domListeners = {};
	}

}

export default ElementMediator;
