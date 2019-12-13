import { ForChannelContinuation, OnContinuation } from "../Continuation";
import { INTERNAL_CHANNEL_NAME, Modules } from "../Core";
import Disposable from "../Disposable";
import Module from "../Module";
import Listener from "./Listener";
import ListenerImpl from "./ListenerImpl";

// TODO - Refactor into common constants
const INTERNAL_DIRECT_CHANNEL_NAME: string = "Cydran$$Direct$$Internal$$Channel";

class PubSub implements Disposable {

	private listeners: Listener[];

	private listenersByChannel: {};

	private moduleInstance: Module;

	private context: any;

	private globalEnabled: boolean;

	constructor(context: any, moduleInstance?: Module) {
		this.globalEnabled = false;
		this.listeners = [];
		this.listenersByChannel = {};
		this.context = context;
		this.moduleInstance = (moduleInstance) ? moduleInstance : Modules.getModule("DEFAULT");
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (INTERNAL_DIRECT_CHANNEL_NAME === channelName) {
			if (messageName === "enableGlobal") {
				this.enableGlobal();
			} else if (messageName === "disableGlobal") {
				this.disableGlobal();
			}
		} else {
			this.listeners.forEach((listener) => {
				if (channelName === listener.getChannelName()) {
					listener.receive(messageName, payload);
				}
			});
		}
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.moduleInstance.broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public dispose(): void {
		this.disableGlobal();
		this.listeners = [];
		this.listenersByChannel = {};
	}

	public on(messageName: string): OnContinuation {
		const mine: PubSub = this;
		return {
			forChannel: (channel: string) => {
				return {
					invoke: (target: (payload: any) => void) => {
						mine.listenTo(channel, messageName, target);
					},
				};
			},
			invoke: (target: (payload: any) => void) => {
				mine.listenTo(INTERNAL_CHANNEL_NAME, messageName, target);
			},
		};
	}

	private listenTo(channel: string, messageName: string, target: (payload: any) => void): void {
		let listener: Listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, this.context);

			if (this.globalEnabled) {
				this.moduleInstance.message(INTERNAL_DIRECT_CHANNEL_NAME, "addListener", listener);
			}

			this.listeners.push(listener);
		}
		listener.register(messageName, target);
	}

	private enableGlobal(): void {
		if (this.globalEnabled) {
			return;
		}

		for (const listener of this.listeners) {
			this.moduleInstance.message(INTERNAL_DIRECT_CHANNEL_NAME, "addListener", listener);
		}

		this.globalEnabled = true;
	}

	private disableGlobal(): void {
		if (!this.globalEnabled) {
			return;
		}

		for (const listener of this.listeners) {
			this.moduleInstance.message(INTERNAL_DIRECT_CHANNEL_NAME, "removeListener", listener);
		}

		this.globalEnabled = false;
	}
}

export default PubSub;
