import { Broker, SimpleMap, Listener, Logger, Module, PubSub, OnContinuation } from "@/Interfaces";
import { INTERNAL_CHANNEL_NAME, INTERNAL_DIRECT_CHANNEL_NAME } from "@/Constants";
import { requireNotNull } from "@/Utils";
import { LoggerFactory } from "@/Logger";

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

		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

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

class ListenerImpl implements Listener {

	private contextFn: () => any;

	private channelName: string;

	private mappings: SimpleMap<((payload: any) => void)[]>;

	constructor(channelName: string, contextFn: () => any) {
		this.mappings = {};
		this.channelName = requireNotNull(channelName, "channelName");
		this.contextFn = requireNotNull(contextFn, "contextFn");
	}

	public receive(messageName: string, payload: any): void {
		const mappings: ((payload: any) => void)[] = this.mappings[messageName];

		if (!mappings) {
			return;
		}

		for (const mapping of mappings) {
			mapping.call(this.contextFn(), payload);
		}
	}

	public register(messageName: string, fn: (payload: any) => void): void {
		if (!this.mappings[messageName]) {
			this.mappings[messageName] = [];
		}

		this.mappings[messageName].push(fn);
	}

	public getChannelName(): string {
		return this.channelName;
	}

	public $dispose(): void {
		this.mappings = {};
		this.contextFn = null;
	}

}

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
			listener = new ListenerImpl(channel, () => this.context);

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

export { BrokerImpl, ListenerImpl, PubSubImpl };
