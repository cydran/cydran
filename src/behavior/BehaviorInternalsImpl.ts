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
import Validator from "validator/Validator";
import ValidatorImpl from "validator/ValidatorImpl";
import IdGenerator from "util/IdGenerator";
import stateMachineBuilder from "machine/StateMachineBuilder";
import { VALID_ID, DOM_KEY, INTERNAL_CHANNEL_NAME, NESTING_CHANGED } from "Constants";
import { requireNotNull, isDefined, extractAttributes, requireValid, elementAsString } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import AttributeExtractor from "component/AttributeExtractor";
import StringSet from "pattern/StringSet";
import StringSetImpl from "pattern/StringSetImpl";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import BehaviorStates from "behavior/BehaviorStates";

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

	private readonly CHNL_NAME: string = "channelName";
	private readonly MSG_NAME: string = "messageName";

	constructor(parent: Behavior<M, E, P>, reducerFn: (input: any) => M) {
		this.parent = requireNotNull(parent, "parent");
		this.reducerFn = reducerFn;
		this.context = (BEHAVIOR_MACHINE.create(this) as unknown) as MachineContext<BehaviorInternals<M, E, P>>;
		this.flags = new StringSetImpl();
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
		// TODO - Remove nesting changed concept potentially
		if (name === NESTING_CHANGED) {
			this.parent.onNestingChanged();
		} else {
			(BEHAVIOR_MACHINE as unknown as Machine<BehaviorInternals<M, E, P>>).evaluate(name, this.context, payload);
		}
	}

	public initialize(dependencies: BehaviorDependencies): void {
		this.dependencies = dependencies;
		this.logger = LoggerFactory.getLogger(`Behavior: ${ dependencies.prefix }`);
		this.initFields();
		this.parent.onInit();

		if (this.dependencies.validated) {
			this.validate();
		}
	}

	public validate(): void {
		const validator: Validator = new ValidatorImpl();
		this.parent.onValidate(this.getEl(), validator.getFunction());
		validator.throwIfErrors(() => `Invalid use of a ${ this.dependencies.prefix } attribute on element ${ elementAsString(this.getEl() as HTMLElement) }`);
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

	public remount(): void {
		this.parent.onRemount();
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
		requireNotNull(channelName, this.CHNL_NAME);
		requireNotNull(messageName, this.MSG_NAME);
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
		requireNotNull(channelName, this.CHNL_NAME);
		requireNotNull(messageName, this.MSG_NAME);
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
		requireNotNull(channelName, this.CHNL_NAME);
		requireNotNull(messageName, this.MSG_NAME);
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;
		this.dependencies.module.broadcastGlobally(channelName, messageName, actualPayload);
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, this.MSG_NAME);

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, this.CHNL_NAME);

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

	public getParentId(): string {
		return this.dependencies.parent.getId();
	}

	public getModelFn(): () => any {
		return this.dependencies.parent.getModelFn();
	}

	public getValueFn(): () => any {
		return this.dependencies.parent.getItemFn();
	}

	public getExtractor(): AttributeExtractor {
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
			this.getEl().addEventListener(name, listener, false);
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
		if (this.params === null) {
			this.params = extractAttributes<P>(this.getBehaviorPrefix(), this.getEl() as HTMLElement);
		}

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

	private initFields(): void {
		this.domListeners = {};
		this.params = null;
		this.id = IdGenerator.INSTANCE.generate();
		this.pubSub = new PubSubImpl(this, this.getModule());
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

const BEHAVIOR_MACHINE: Machine<BehaviorInternalsImpl<any, HTMLElement | Text, any>> =
	stateMachineBuilder<BehaviorInternalsImpl<any, HTMLElement | Text, any>>(BehaviorStates.UNINITIALIZED)
	.withState(BehaviorStates.UNINITIALIZED, [])
	.withState(BehaviorStates.INITIALIZED, [])
	.withState(BehaviorStates.READY, [])
	.withState(BehaviorStates.MOUNTED, [])
	.withState(BehaviorStates.UNMOUNTED, [])
	.withState(BehaviorStates.DISPOSED, [])
	.withTransition(BehaviorStates.UNINITIALIZED, BehaviorTransitions.INIT, BehaviorStates.READY, [BehaviorInternalsImpl.prototype.initialize])
	.withTransition(BehaviorStates.READY, BehaviorTransitions.DISPOSE, BehaviorStates.DISPOSED, [BehaviorInternalsImpl.prototype.$dispose])
	.withTransition(BehaviorStates.READY, BehaviorTransitions.MOUNT, BehaviorStates.MOUNTED, [BehaviorInternalsImpl.prototype.mount])
	.withTransition(BehaviorStates.MOUNTED, BehaviorTransitions.UNMOUNT, BehaviorStates.UNMOUNTED, [BehaviorInternalsImpl.prototype.unmount])
	.withTransition(BehaviorStates.UNMOUNTED, BehaviorTransitions.MOUNT, BehaviorStates.MOUNTED, [BehaviorInternalsImpl.prototype.remount])
	.withTransition(BehaviorStates.UNMOUNTED, BehaviorTransitions.DISPOSE, BehaviorStates.DISPOSED, [BehaviorInternalsImpl.prototype.$dispose])
	.build();

export default BehaviorInternalsImpl;
