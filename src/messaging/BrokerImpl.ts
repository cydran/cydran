import Broker from './Broker';
import Listener from './Listener';
import Broadcaster from './Broadcaster';
import BroadcasterImpl from './BroadcasterImpl';
import Logger from '../logger/Logger';
import LoggerFactory from '../logger/LoggerFactory';
import {Registry} from '../Registry';

class BrokerImpl implements Broker {

	public static INSTANCE: Broker;

	private logger: Logger;

	private broadcasters: {
		[channelName: string]: Broadcaster[];
	};

	private listeners: {
		[channelName: string]: Listener[];
	};

	constructor() {
		this.logger = LoggerFactory.getLogger('Broker');
		this.broadcasters = {};
		this.listeners = {};
	}

	broadcast(channelName: string, messageName: string, payload: any): void {
		this.logger.trace({
			channelName: channelName,
			messageName: messageName,
			payload: payload
		});

		if (!this.listeners[channelName]) {
			this.logger.trace('no listeners for channel, returning');
			return;
		}

		let listeners = this.listeners[channelName];

		for (let i = 0;i < listeners.length;i++) {
			listeners[i].receive(messageName, payload);
		}
	}

	public addBroadcaster(broadcaster: Broadcaster): void {
		let channelName: string = broadcaster.getChannelName();

		if (!this.broadcasters[channelName]) {
			this.broadcasters[channelName] = [];
		}

		let broadcasters: Broadcaster[] = this.broadcasters[channelName];

		if (!this.contains(broadcasters, broadcaster)) {
			broadcasters.push(broadcaster);
		}

		(<BroadcasterImpl>broadcaster).setBroker(this);
	}

	public removeBroadcaster(broadcaster: Broadcaster): void {
		let channelName: string = broadcaster.getChannelName();

		let broadcasters: Broadcaster[] = this.broadcasters[channelName];

		if (!broadcasters) {
			return;
		}

		this.remove(broadcasters, broadcaster);

		if (0 == broadcasters.length) {
			delete this.broadcasters[channelName];
		}

		(<BroadcasterImpl>broadcaster).setBroker(null);
	}

	public addListener(listener: Listener): void {
		let channelName: string = listener.getChannelName();

		if (!this.listeners[channelName]) {
			this.listeners[channelName] = [];
		}

		let listeners: Listener[] = this.listeners[channelName];

		if (!this.contains(listeners, listener)) {
			listeners.push(listener);
		}
	}

	public removeListener(listener: Listener): void {
		let channelName: string = listener.getChannelName();

		let listeners: Listener[] = this.listeners[channelName];

		if (!listeners) {
			return;
		}

		this.remove(listeners, listener);

		if (0 == listeners.length) {
			delete this.listeners[channelName];
		}
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

	public dispose(): void {
		this.broadcasters = {};
		this.listeners = {};
	}

}

Registry.registerSingleton('cydran:broker', BrokerImpl);
