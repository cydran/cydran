import { OnContinuation } from "@/message/Continuation";
import Listener from "@/message/Listener";
import ListenerImpl from "@/message/ListenerImpl";
import Module from "@/module/Module";
import ObjectUtils from "@/util/ObjectUtils";
import { INTERNAL_CHANNEL_NAME, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import PubSub from "@/message/PubSub";

const requireNotNull = ObjectUtils.requireNotNull;

class PubSubImpl implements PubSub {

	private logger: Logger;

	private listeners: Listener[];

	private listenersByChannel: {};

	private module: Module;

	private context: any;

	private globalEnabled: boolean;

	constructor(context: any, module: Module) {
		this.context = context;
		this.module = module;
		this.logger = LoggerFactory.getLogger("PubSub");
		this.globalEnabled = false;
		this.listeners = [];
		this.listenersByChannel = {};
	}

	public setContext(context: any): void {
		this.context = context;
	}

	public setModule(module: Module): void {
		this.module = module;
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
		this.module.broadcast(channelName, messageName, actualPayload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.module.broadcastGlobally(channelName, messageName, payload);
	}

	public dispose(): void {
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
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						mine.listenTo(channelName, messageName, target);
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				mine.listenTo(INTERNAL_CHANNEL_NAME, messageName, target);
			}
		};
	}

	public enableGlobal(): void {
		if (this.globalEnabled) {
			return;
		}

		this.logger.trace("Enabling global");

		for (const listener of this.listeners) {
			this.module.message(INTERNAL_DIRECT_CHANNEL_NAME, "addListener", listener);
		}

		this.globalEnabled = true;
	}

	public disableGlobal(): void {
		if (!this.globalEnabled) {
			return;
		}

		this.logger.trace("Disabling global");

		for (const listener of this.listeners) {
			this.module.message(INTERNAL_DIRECT_CHANNEL_NAME, "removeListener", listener);
		}

		this.globalEnabled = false;
	}

	public listenTo(channel: string, messageName: string, target: (payload: any) => void): void {
		let listener: Listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, this.context);

			if (this.globalEnabled) {
				this.module.message(INTERNAL_DIRECT_CHANNEL_NAME, "addListener", listener);
			}

			this.listeners.push(listener);
		}

		listener.register(messageName, target);
	}

	public isGlobalEnabled(): boolean {
		return this.globalEnabled;
	}

}

export default PubSubImpl;
