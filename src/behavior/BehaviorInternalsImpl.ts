import BehaviorInternals from "behavior/BehaviorInternals";
import Mediator from "mediator/Mediator";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import PubSub from "message/PubSub";
import OnContinuation from "message/OnContinuation";
import PubSubImpl from "message/PubSubImpl";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Machine from "machine/Machine";
import MachineContext from "machine/MachineContext";
import Behavior from "behavior/Behavior";
import Nestable from "interface/ables/Nestable";
import Module from "module/Module";
import IdGenerator from "util/IdGenerator";
import stateMachineBuilder from "machine/StateMachineBuilder";
import { VALID_ID, DOM_KEY, INTERNAL_CHANNEL_NAME, NodeTypes } from "Constants";
import { requireNotNull, isDefined, requireValid, elementAsString } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import Attributes from "component/Attributes";
import StringSet from "pattern/StringSet";
import StringSetImpl from "pattern/StringSetImpl";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import BehaviorStates from "behavior/BehaviorStates";
import BehaviorAttributeValidations from "behavior/BehaviorAttributeValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import AttributeParser from 'validator/AttributeParser';
import AttributeParserImpl from "validator/AttributeParserImpl";
import { asIdentity } from "util/AsFunctions";
import Dom from "dom/Dom";

const CHANNEL_NAME: string = "channelName";
const MSG_NAME: string = "messageName";

class BehaviorInternalsImpl<M, E extends HTMLElement | Text, P> implements BehaviorInternals<M, E, P> {

	private logger: Logger;

	private context: MachineContext<BehaviorInternals<M, E, P>>;

	private reducerFn?: (input: any) => M;

	private mediator: Mediator<M>;

	private domListeners: SimpleMap<any>;

	private id: string;

	private params: P;

	private pubSub: PubSub;

	private dependencies: BehaviorDependencies;

	private parent: Behavior<M, E, P>;

	private flags: StringSet;

	private attributeParser: AttributeParser<P>;

	private tagText: string;

	constructor(parent: Behavior<M, E, P>) {
		this.parent = requireNotNull(parent, "parent");
		this.reducerFn = asIdentity;
		this.context = BEHAVIOR_MACHINE.create(this) as unknown as MachineContext<BehaviorInternals<M, E, P>>;
		this.flags = new StringSetImpl();
		this.attributeParser = new AttributeParserImpl<P>();
		this.tagText = "";
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public isMutable(): boolean {
		return this.dependencies.mutable;
	}

	public setFlag(name: string): void {
		this.flags.add(name);
	}

	public isFlagged(name: string): boolean {
		return this.flags.contains(name);
	}

	public tell(name: string, payload?: any): void {
		(BEHAVIOR_MACHINE as unknown as Machine<BehaviorInternals<M, E, P>>).evaluate(name, this.context, payload);
	}

	public initialize(dependencies: BehaviorDependencies): void {
		this.dependencies = dependencies;
		this.setLoggerName(`Behavior: ${ dependencies.prefix }`);
		this.initFields();
		this.initParams();
		this.parent.onInit(dependencies);
		this.removeBehaviorAttribute();
	}

	private removeBehaviorAttribute(): void {
		if (this.dependencies.el.nodeType === NodeTypes.ELEMENT) {
			const behaviorPrefix: string = this.getBehaviorPrefix();
			(this.dependencies.el as HTMLElement).removeAttribute(behaviorPrefix);
		}
	}

	public mount(): void {
		this.bindDomListeners();
		this.parent.onMount();
	}

	public unmount(): void {
		this.unbindDomListeners();
		this.parent.onUnmount();
	}

	public remount(): void {
		this.bindDomListeners();
		this.parent.onRemount();
	}

	public digest(): void {
		// TODO - Implement
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, CHANNEL_NAME);
		requireNotNull(messageName, MSG_NAME);
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
		requireNotNull(channelName, CHANNEL_NAME);
		requireNotNull(messageName, MSG_NAME);
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
		requireNotNull(channelName, CHANNEL_NAME);
		requireNotNull(messageName, MSG_NAME);
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;
		this.dependencies.module.broadcastGlobally(channelName, messageName, actualPayload);
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, MSG_NAME);

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, CHANNEL_NAME);

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

	public getId(): string {
		return this.id;
	}

	public getParentId(): string {
		return this.dependencies.parent.getId();
	}

	public getModelFn(): () => any {
		return this.dependencies.parent.getModelFn();
	}

	public getValueFn(): () => any {
		return this.dependencies.parent.getItemFn();
	}

	public getExtractor(): Attributes {
		return this.dependencies.parent.getExtractor();
	}

	public getPrefix(): string {
		return this.dependencies.prefix;
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

			if (this.isMounted()) {
				this.getEl().addEventListener(name, listener, false);
			}
		}
	}

	/**
	 * Get the associated {HTMLElement html element} of this behavior.
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
		return this.params;
	}

	/**
	 * Gets the prefix for the behavior.
	 * @return the behavior prefix
	 */
	public getBehaviorPrefix(): string {
		return this.dependencies.behaviorPrefix;
	}

	public getExpression(): string {
		return this.dependencies.expression;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {Mediator}                   [description]
	 */
	public mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T> {
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
	 * @return {Mediator} [description]
	 */
	public getMediator(): Mediator<M> {
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

	public setDefaults(defaults: P): void {
		this.attributeParser.setDefaults(defaults);
	}

	public setValidations(validations: BehaviorAttributeValidations<HTMLElement>): void {
		this.attributeParser.setValidations(validations);
	}

	public setConverters(converters: BehaviorAttributeConverters): void {
		this.attributeParser.setConverters(converters);
	}

	public setLoggerName(name: string): void {
		requireNotNull(name, "name");
		this.logger = LoggerFactory.getLogger(name);
	}

	public setReducerFn(reducerFn: (input: any) => M): void {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
	}

	public isValidated(): boolean {
		return this.dependencies.validated;
	}

	public isMounted(): boolean {
		return this.context.isState("MOUNTED");
	}

	public getDom(): Dom {
		return this.dependencies.dom;
	}

	private initFields(): void {
		this.domListeners = {};
		this.params = null;
		this.id = IdGenerator.INSTANCE.generate();
		this.pubSub = new PubSubImpl(this, this.getModule());

		if (this.dependencies.el.nodeType === NodeTypes.ELEMENT && this.dependencies.validated) {
			this.tagText = elementAsString(this.dependencies.el as HTMLElement);
		}
	}

	private bindDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			this.getEl().addEventListener(name, this.domListeners[name], false);
		}
	}

	private unbindDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			this.getEl().removeEventListener(name, this.domListeners[name]);
		}
	}

	private initParams(): void {
		this.logger.ifTrace(() => "Behavior Prefix: " + this.getBehaviorPrefix());

		this.params = this.attributeParser.parse(this.getEl() as HTMLElement, this.getBehaviorPrefix(), this.dependencies.validated, this.tagText);

		this.logger.ifTrace(() => ({
			params: this.params
		}));
	}

}

const BEHAVIOR_MACHINE: Machine<BehaviorInternalsImpl<any, HTMLElement | Text, any>> =
	stateMachineBuilder<BehaviorInternalsImpl<any, HTMLElement | Text, any>>(BehaviorStates.UNINITIALIZED)
	.withState(BehaviorStates.UNINITIALIZED, [])
	.withState(BehaviorStates.INITIALIZED, [])
	.withState(BehaviorStates.READY, [])
	.withState(BehaviorStates.MOUNTED, [])
	.withState(BehaviorStates.UNMOUNTED, [])
	.withTransition(BehaviorStates.UNINITIALIZED, BehaviorTransitions.INIT, BehaviorStates.READY, [BehaviorInternalsImpl.prototype.initialize])
	.withTransition(BehaviorStates.READY, BehaviorTransitions.MOUNT, BehaviorStates.MOUNTED, [BehaviorInternalsImpl.prototype.mount])
	.withTransition(BehaviorStates.MOUNTED, BehaviorTransitions.UNMOUNT, BehaviorStates.UNMOUNTED, [BehaviorInternalsImpl.prototype.unmount])
	.withTransition(BehaviorStates.UNMOUNTED, BehaviorTransitions.MOUNT, BehaviorStates.MOUNTED, [BehaviorInternalsImpl.prototype.remount])
	.build();

export default BehaviorInternalsImpl;
