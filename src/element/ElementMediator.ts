import Logger from "@/logger/Logger";
import ModelMediator from "@/model/ModelMediator";
import PubSub from "@/message/PubSub";
import LoggerFactory from "@/logger/LoggerFactory";
import Module from "@/module/Module";
import { VALID_ID } from "@/constant/ValidationRegExp";
import Disposable from "@/pattern/Disposable";
import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import { OnContinuation } from "@/message/Continuation";
import { extractAttributes } from "@/util/ParamUtils";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import { INTERNAL_CHANNEL_NAME } from "@/constant/Constants";
import Nestable from "@/component/Nestable";
import MediatorSource from "@/mvvm/MediatorSource";
import IdGenerator from "@/pattern/IdGenerator";
import PubSubImpl from "@/message/PubSubImpl";
import { requireNotNull, requireValid, isDefined } from "@/util/ObjectUtils";
import AttributeExtractor from "@/mvvm/AttributeExtractor";
import Validators from "@/validation/Validators";
import ValidatorImpl from "@/validation/ValidatorImpl";
import Validator from "@/validation/Validator";
import { elementAsString } from "@/util/DomUtils";

/**
 * The piece of code between the HTMLElement and the Mvvm
 * @type M {@link ModelMediator}
 * @type E extends HTMLElement
 * @implements {@link Disposable}
 */
abstract class ElementMediator<M, E extends HTMLElement | Text, P> implements Disposable, MediatorSource {

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

	constructor(dependencies: any, propagation: boolean, reducerFn: (input: any) => M, topLevelSupported?: boolean) {
		this.topLevelSupported = isDefined(topLevelSupported) ? topLevelSupported : true;
		this.____internal$$cydran____ = requireNotNull(dependencies, "dependencies");
		this.logger = LoggerFactory.getLogger("ElementMediator: " + dependencies.prefix);
		this.domListeners = {};
		this.pubSub = new PubSubImpl(this, this.getModule());
		this.params = null;
		this.propagation = propagation;
		this.id = IdGenerator.INSTANCE.generate();
		this.reducerFn = reducerFn;

		const validator: Validator = new ValidatorImpl();
		this.validate(this.getEl(), validator.getFunction());
		validator.throwIfErrors(() => "Invalid use of " + dependencies.prefix + " attribute on element " + elementAsString(this.getEl() as HTMLElement));
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
		this.____internal$$cydran____.module.broadcastGlobally(channelName, messageName, actualPayload);
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

	protected getExtractor(): AttributeExtractor {
		return this.____internal$$cydran____.mvvm.getExtractor();
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		// Intentionally do nothing by default
	}

	public getParentId(): string {
		return this.____internal$$cydran____.mvvm.getId();
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

	protected getParams(): P {
		if (this.params === null) {
			this.params = extractAttributes<P>(this.getMediatorPrefix(), this.getEl() as HTMLElement);
		}

		return this.params;
	}

	protected getModelFn(): () => any {
		return this.____internal$$cydran____.mvvm.getModelFn();
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
	protected mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		requireNotNull(expression, "expression");
		return this.____internal$$cydran____.mvvm.mediate(expression, reducerFn);
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

	protected abstract validate(element: E, check: (name: string, value?: any) => Validators): void;

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

export default ElementMediator;
