import {Modules} from "../Core";
import Disposable from "../Disposable";
import Module from "../Module";
import {Registry} from "../Registry";
import Broadcaster from "./Broadcaster";
import BroadcasterImpl from "./BroadcasterImpl";
import Broker from "./Broker";
import Listener from "./Listener";
import ListenerImpl from "./ListenerImpl";

class PubSub implements Disposable {

	private broker: Broker;

	private listeners: Listener[];

	private listenersByChannel: {};

	private moduleInstance: Module;

	private context: any;

	constructor(context: any, moduleInstance?: Module) {
		this.listeners = [];
		this.listenersByChannel = {};
		this.context = context;
		this.moduleInstance = (moduleInstance) ? moduleInstance : Modules.getModule("DEFAULT");
	}

	public listenTo(channel: string, messageName: string, target: Function): void {
		const broker: Broker = this.moduleInstance.getRegistry().get("cydran:broker");

		let listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, this.context);
			broker.addListener(listener);
			this.listeners.push(listener);
		}

		listener.register(messageName, target);
	}

	public broadcastTo(channel: string): Broadcaster {
		const broker: Broker = this.moduleInstance.getRegistry().get("cydran:broker");
		const broadcaster: BroadcasterImpl = new BroadcasterImpl(channel);
		broadcaster.setBroker(broker);

		return broadcaster;
	}

	public broadcastLocal(channelName: string, messageName: string, payload: any): void {
		this.listeners.forEach((listener) => {
			if (channelName === listener.getChannelName()) {
				listener.receive(messageName, payload);
			}
		});
	}

	public dispose(): void {
		const broker: Broker = this.moduleInstance.getRegistry().get("cydran:broker");

		for (let i = 0;i < this.listeners.length;i++) {
			const listener: Listener = this.listeners[i];
			broker.removeListener(listener);
		}

		this.listeners = [];
		this.listenersByChannel = {};
	}

}

export default PubSub;
