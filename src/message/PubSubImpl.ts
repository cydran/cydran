import Context from "context/Context";
import Listener from "message/Listener";
import PubSub from "message/PubSub";
import ListenerImpl from "message/ListenerImpl";
import { INTERNAL_CHANNEL_NAME } from "Constants";
import { extractClassName, isDefined, requireNotNull } from "util/Utils";
import Logger from "log/Logger";
import OnContinuation from "continuation/OnContinuation";
import InternalContext from "context/InternalContext";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";
import MachineState from "machine/MachineState";
import PubSubTransitions from "message/PubSubTransitions";
import PubSubStates from "message/PubSubStates";
import SimpleMap from "interface/SimpleMap";
import MessageCallback from "message/MessageCallback";

class PubSubImpl implements PubSub {

	private logger: Logger;

	private listeners: SimpleMap<Listener>;

	private context: Context;

	private targetThis: any;

	private machineState: MachineState<PubSubImpl>;

	private messageCallback: MessageCallback;

	constructor(targetThis: any, context: Context) {
		if (isDefined(context)) {
			this.setContext(context);
		}

		this.setTarget(targetThis);
		this.listeners = {};

		this.messageCallback = (channelName: string, messageName: string, payload: any) => {
			this.message(channelName, messageName, payload);
		};

		this.machineState = PUB_SUB_MACHINE.create(this);
	}

	public tell(name: string, payload?: any): void {
		PUB_SUB_MACHINE.evaluate(name, this.machineState, payload);
	}

	public setTarget(targetThis: any): void {
		this.targetThis = targetThis;
		this.setLogger();
	}

	public setContext(context: Context): void {
		this.context = context;
		this.setLogger();
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;
		const listener: Listener = this.listeners[channelName];

		if (isDefined(listener)) {
			listener.receive(messageName, actualPayload);
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;
		this.context.broadcast(channelName, messageName, actualPayload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.context.broadcastGlobally(channelName, messageName, payload);
	}

	public $dispose(): void {
		this.tell(PubSubTransitions.UNMOUNT);
		this.listeners = {};
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		const mine: PubSubImpl = this;

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (callback: (payload: any) => void) => {
						requireNotNull(callback, "callback");
						mine.listenTo(channelName, messageName, callback);
					}
				};
			},
			invoke: (callback: (payload: any) => void) => {
				requireNotNull(callback, "callback");
				mine.listenTo(INTERNAL_CHANNEL_NAME, messageName, callback);
			}
		};
	}

	public listenTo(channelName: string, messageName: string, callback: (payload: any) => void): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		requireNotNull(callback, "callback");

		if (!isDefined(this.listeners[channelName])) {
			this.listeners[channelName] = new ListenerImpl(() => this.targetThis);
		}

		const listener: Listener = this.listeners[channelName];

		listener.register(messageName, callback);
	}

	private setLogger(): void {
		try {
			requireNotNull(this.targetThis, "targetThis");
			requireNotNull(this.context, "context");
			const logrName: string = `PubSub${ this.resolveLabel(this.targetThis) }`;
			this.logger = (this.context as unknown as InternalContext).getServices().logFactory().getLogger(logrName);
		} catch(err) {
			// intential noop and logger isn't ready to log it
		}
	}

	private resolveLabel(targetThis: any = {}) {
		const result: string = targetThis.name || extractClassName(targetThis) || targetThis.id || "";
		return (result.length > 0) ? `[${ result }]` : result;
	}

	public onMount(): void {
		this.logger.trace("Mounting");
		this.context.tell("addMessageCallback", this.messageCallback);
	}

	public onUnmount(): void {
		this.logger.trace("Unmounting");
		this.context.tell("removeMessageCallback", this.messageCallback);
	}

	public isMounted(): boolean {
		return this.machineState.isState("MOUNTED");
	}

}

const PUB_SUB_MACHINE: Machine<PubSubImpl> = stateMachineBuilder<PubSubImpl>(PubSubStates.UNMOUNTED)
	.withState(PubSubStates.MOUNTED, [])
	.withState(PubSubStates.UNMOUNTED, [])
	.withTransition(PubSubStates.UNMOUNTED, PubSubTransitions.MOUNT, PubSubStates.MOUNTED, [PubSubImpl.prototype.onMount])
	.withTransition(PubSubStates.MOUNTED, PubSubTransitions.UNMOUNT, PubSubStates.UNMOUNTED, [PubSubImpl.prototype.onUnmount])
	.build();

export default PubSubImpl;
