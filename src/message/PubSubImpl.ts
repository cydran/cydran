import Context from "context/Context";
import Listener from "message/Listener";
import PubSub from "message/PubSub";
import ListenerImpl from "message/ListenerImpl";
import { INTERNAL_CHANNEL_NAME } from "Constants";
import { extractClassName, requireNotNull } from "util/Utils";
import Logger from "log/Logger";
import OnContinuation from "continuation/OnContinuation";

class PubSubImpl implements PubSub {

	private logger: Logger;

	private listeners: Listener[];

	private listenersByChannel: {};

	private context: Context;

	private targetThis: any;

	private globalEnabled: boolean;

	constructor(targetThis: any, context: Context) {
		this.setContext(context);
		this.setTarget(targetThis);
		this.globalEnabled = false;
		this.listeners = [];
		this.listenersByChannel = {};
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

		this.listeners.forEach((listener) => {
			if (channelName === listener.getChannelName()) {
				listener.receive(messageName, actualPayload);
			}
		});
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
		this.disableGlobal();
		this.listeners = [];
		this.listenersByChannel = {};
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

	public enableGlobal(): void {
		if (this.globalEnabled) {
			return;
		}

		this.logger.trace("Enabling global");

		for (const listener of this.listeners) {
			this.context.tell("addListener", listener);
		}

		this.globalEnabled = true;
	}

	public disableGlobal(): void {
		if (!this.globalEnabled) {
			return;
		}

		this.logger.trace("Disabling global");

		for (const listener of this.listeners) {
			this.context.tell("removeListener", listener);
		}

		this.globalEnabled = false;
	}

	public listenTo(channel: string, messageName: string, callback: (payload: any) => void): void {
		let listener: Listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, () => this.targetThis);

			if (this.globalEnabled) {
				this.context.tell("addListener", listener);
			}

			this.listeners.push(listener);
		}

		listener.register(messageName, callback);
	}

	public isGlobalEnabled(): boolean {
		return this.globalEnabled;
	}

	private setLogger(): void {
		try {
			requireNotNull(this.targetThis, "targetThis");
			requireNotNull(this.context, "context");
			const logrName: string = `PubSub${ this.resolveLabel(this.targetThis) }`;
			this.logger = this.context.getServices().logFactory().getLogger(logrName);
		} catch(err) {
			// intential noop and logger isn't ready to log it
		}
	}

	private resolveLabel(targetThis: any = {}) {
		const result: string = targetThis.name || extractClassName(targetThis) || targetThis.id || "";
		return (result.length > 0) ? `[${ result }]` : result;
	}

}

export default PubSubImpl;
