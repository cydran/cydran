import BehaviorInternals from "behavior/BehaviorInternals";
import Mediator from "mediator/Mediator";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import PubSub from "message/PubSub";
import PubSubImpl from "message/PubSubImpl";
import Logger from "log/Logger";
import Machine from "machine/Machine";
import MachineState from "machine/MachineState";
import Behavior from "behavior/Behavior";
import stateMachineBuilder from "machine/StateMachineBuilder";
import { VALID_ID, DOM_KEY, INTERNAL_CHANNEL_NAME, NodeTypes } from "Constants";
import { requireNotNull, isDefined, requireValid, elementAsString, hasContents } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import Attributes from "component/Attributes";
import StringSet from "pattern/StringSet";
import StringSetImpl from "pattern/StringSetImpl";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import BehaviorStates from "behavior/BehaviorStates";
import FieldValidations from "validator/FieldValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import AttributeParser from 'validator/AttributeParser';
import AttributeParserImpl from "validator/AttributeParserImpl";
import { asIdentity } from "util/AsFunctions";
import DigestionActions from "const/DigestionActions";
import { BehaviorError } from "error/Errors";
import InternalBehaviorFlags from "behavior/InternalBehaviorFlags";
import OnContinuation from "continuation/OnContinuation";
import { Nestable } from "interface/ComponentInterfaces";
import DomUtils from "dom/DomUtils";
import IdGenerator from "util/IdGenerator";
import LoggerFactory from "log/LoggerFactory";
import { Context } from "context/Context";

const CHANNEL_NAME: string = "channelName";
const MSG_NAME: string = "messageName";
const EVENT_NAME: string = "cydran:behavior";

class BehaviorInternalsImpl<M, E extends HTMLElement | Text, P> implements BehaviorInternals<M, E, P> {

	private logger: Logger;

	private machineState: MachineState<BehaviorInternals<M, E, P>>;

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

	private defaultExpression: string;

	private context: Context;

	constructor(parent: Behavior<M, E, P>) {
		this.parent = requireNotNull(parent, "parent");
		this.reducerFn = asIdentity;
		this.machineState = BEHAVIOR_MACHINE.create(this) as unknown as MachineState<BehaviorInternals<M, E, P>>;
		this.flags = new StringSetImpl();
		this.attributeParser = new AttributeParserImpl<P>();
		this.tagText = "";
		this.defaultExpression = null;
		this.context = null;
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToContext(channelName, messageName, payload);
	}

	public sendToParentContext(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToParentContext(channelName, messageName, payload);
	}

	public sendToParentContexts(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToParentContexts(channelName, messageName, payload);
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToRoot(channelName, messageName, payload);
	}

	public sendToChildContexts(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToChildContexts(channelName, messageName, payload);
	}

	public sendToDescendantContexts(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToDescendantContexts(channelName, messageName, payload);
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendGlobally(channelName, messageName, payload);
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

	public setDefaultExpression(defaultExpression: string): void {
		this.defaultExpression = defaultExpression;
	}

	public isFlagged(name: string): boolean {
		return this.flags.contains(name);
	}

	public tell(name: string, payload?: any): void {
		requireNotNull(name, "name");

		switch (name) {
			case DigestionActions.REQUEST_DIGESTION_SOURCES:
				this.parent.requestDigestionSources(payload);
				break;

			// TODO - Replace with constant
			case "setContext":
				this.context = payload as Context;
				break;

			default:
				(BEHAVIOR_MACHINE as unknown as Machine<BehaviorInternals<M, E, P>>).submit(name, this.machineState, payload);
		}
	}

	public initialize(dependencies: BehaviorDependencies): void {
		this.dependencies = requireNotNull(dependencies, "dependencies");
		this.setLoggerName(`Behavior: ${ dependencies.behaviorPrefix }`);
		this.initFields();
		this.initParams();

		if (hasContents(this.dependencies.expression)) {
			if (this.isFlagged(InternalBehaviorFlags.EXPRESSION_DISALLOWED)) {
				throw new BehaviorError(`Behavior expression not allowed on ${ dependencies.behaviorPrefix }.`);
			}
		} else {
			if (!isDefined(this.defaultExpression)) {
				throw new BehaviorError(`Behavior expression missing and no default is available on ${ dependencies.behaviorPrefix }.`);
			}

			this.dependencies.expression = this.defaultExpression;
		}

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

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, MSG_NAME);

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, CHANNEL_NAME);

				return {
					invoke: (callback: (payload: any) => void) => {
						requireNotNull(callback, "callback");
						this.pubSub
							.on(messageName)
							.forChannel(channelName)
							.invoke((payload: any) => {
								callback.apply(this, [payload]);
							});
					}
				};
			},
			invoke: (callback: (payload: any) => void) => {
				requireNotNull(callback, "callback");
				this.pubSub
					.on(messageName)
					.forChannel(INTERNAL_CHANNEL_NAME)
					.invoke((payload: any) => {
						callback.apply(this, [payload]);
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
	 * Get the active context instance reference by id
	 * @return U
	 */
	public getObject<U>(id: string): U {
		requireValid(id, "id", VALID_ID);
		return this.getContext().getObject(id);
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
	 * [getContext description]
	 * @return {Context} [description]
	 */
	public getContext(): Context {
		return this.context;
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
	 * [getTargetComponent description]
	 * @return {Component} [description]
	 */
	public getTargetComponent(): Nestable {
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

	public sync(): any {
		if (this.dependencies) {
			this.dependencies.parent.sync();
		}
	}

	public setDefaults(defaults: P): void {
		this.attributeParser.setDefaults(defaults);
	}

	public setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void {
		this.attributeParser.setValuelessDefaults(valuelessDefaults);
	}

	public setValidations(validations: FieldValidations<HTMLElement>): void {
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
		return this.machineState.isState("MOUNTED");
	}

	public invoke(params?: any): void {
		this.dependencies.parent.invoke(this.getExpression(), params);
	}

	public notify(name: string, detail: any): void {
		this.notifyElement(name, detail, this.getEl() as HTMLElement);
	}

	public notifyElement(name: string, detail: any, element: HTMLElement): void {
		const event = DomUtils.getDocument().createEvent('CustomEvent');
		event.initCustomEvent(name, true, true, detail);
		element.dispatchEvent(event);
	}

	private initFields(): void {
		this.domListeners = {};
		this.params = null;
		this.id = IdGenerator.generate();
		this.pubSub = new PubSubImpl(this, this.getContext());

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
		this.params = this.attributeParser.parse(this.getEl() as HTMLElement, this.getBehaviorPrefix(), this.dependencies.validated, this.tagText);

		if(Object.keys(this.params).length > 0) {
			this.logger.ifTrace(() => (this.params));
		}
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
