import {Modules} from "../Core";
import Disposable from "../Disposable";
import Module from "../Module";
import Listener from "./Listener";
import ListenerImpl from "./ListenerImpl";

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

	public listenTo(channel: string, messageName: string, target: Function): void {
		let listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, this.context);

			if (this.globalEnabled) {
				this.moduleInstance.addListener(listener);
			}

			this.listeners.push(listener);
		}

		listener.register(messageName, target);
	}

	public message(channelName: string, messageName: string, payload: any): void {
		this.listeners.forEach((listener) => {
			if (channelName === listener.getChannelName()) {
				listener.receive(messageName, payload);
			}
		});
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.moduleInstance.broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public enableGlobal(): void {
		if (this.globalEnabled) {
			return;
		}

		for (const listener of this.listeners) {
			this.moduleInstance.addListener(listener);
		}
	}

	public disableGlobal(): void {
		if (!this.globalEnabled) {
			return;
		}

		for (const listener of this.listeners) {
			this.moduleInstance.removeListener(listener);
		}

		this.globalEnabled = false;
	}

	public dispose(): void {
		this.disableGlobal();
		this.listeners = [];
		this.listenersByChannel = {};
	}

}

export default PubSub;
