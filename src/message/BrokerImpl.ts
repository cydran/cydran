import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import Broker from "message/Broker";
import { requireNotNull } from "util/Utils";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

class BrokerImpl implements Broker {
	public static INSTANCE: Broker;

	private logger: Logger;

	private listeners: SimpleMap<Listener[]>;

	constructor() {
		this.logger = LoggerFactory.getLogger("Broker");
		this.listeners = {};
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: any = payload === null || payload === undefined ? {} : payload;

		this.logger.trace({
			channelName: channelName,
			messageName: messageName,
			payload: actualPayload
		});

		if (!this.listeners[channelName]) {
			this.logger.trace("no listeners for channel, returning");
			return;
		}

		const listeners = this.listeners[channelName];

		for (const listener of listeners) {
			listener.receive(messageName, actualPayload);
		}
	}

	public addListener(listener: Listener): void {
		const channelName: string = listener.getChannelName();

		if (!this.listeners[channelName]) {
			this.listeners[channelName] = [];
		}

		const listeners: Listener[] = this.listeners[channelName];

		if (!this.contains(listeners, listener)) {
			listeners.push(listener);
		}
	}

	public removeListener(listener: Listener): void {
		const channelName: string = listener.getChannelName();
		const listeners: Listener[] = this.listeners[channelName];

		if (!listeners) {
			return;
		}

		this.remove(listeners, listener);

		if (0 === listeners.length) {
			delete this.listeners[channelName];
		}
	}

	public $dispose(): void {
		this.listeners = {};
	}

	private contains(array: any[], instance: any): boolean {
		let i = array.length;

		while (i--) {
			if (array[i] === instance) {
				return true;
			}
		}

		return false;
	}

	private remove(array: any[], instance: any): void {
		let i = array.length;

		while (i--) {
			if (array[i] === instance) {
				array.splice(i, 1);
				break;
			}
		}
	}
}

export default BrokerImpl;
