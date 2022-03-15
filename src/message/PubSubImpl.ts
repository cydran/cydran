import Module from "module/Module";
import Listener from "message/Listener";
import OnContinuation from "message/OnContinuation";
import PubSub from "message/PubSub";
import ListenerImpl from "message/ListenerImpl";
import { INTERNAL_CHANNEL_NAME } from "Constants";
import { extractClassName, requireNotNull } from "util/Utils";
import Logger from "log/Logger";

class PubSubImpl implements PubSub {

	private logger: Logger;

	private listeners: Listener[];

	private listenersByChannel: {};

	private module: Module;

	private context: any;

	private globalEnabled: boolean;

	constructor(context: any, module: Module) {
		this.setModule(module);
		this.setContext(context);
		this.globalEnabled = false;
		this.listeners = [];
		this.listenersByChannel = {};
	}

	public setContext(context: any): void {
		this.context = context;
		this.setLogger();
	}

	public setModule(module: Module): void {
		this.module = module;
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
			this.module.tell("addListener", listener);
		}

		this.globalEnabled = true;
	}

	public disableGlobal(): void {
		if (!this.globalEnabled) {
			return;
		}

		this.logger.trace("Disabling global");

		for (const listener of this.listeners) {
			this.module.tell("removeListener", listener);
		}

		this.globalEnabled = false;
	}

	public listenTo(channel: string, messageName: string, target: (payload: any) => void): void {
		let listener: Listener = this.listenersByChannel[channel];

		if (!listener) {
			listener = new ListenerImpl(channel, () => this.context);

			if (this.globalEnabled) {
				this.module.tell("addListener", listener);
			}

			this.listeners.push(listener);
		}

		listener.register(messageName, target);
	}

	public isGlobalEnabled(): boolean {
		return this.globalEnabled;
	}

	private setLogger(): void {
		try {
			requireNotNull(this.context, "context");
			requireNotNull(this.module, "module");
			const logrName: string = `PubSub${ this.resolveLabel(this.context) }`;
			this.logger = this.module.getCydranContext().logFactory().getLogger(logrName);
		} catch(err) {
			// intential noop and logger isn't ready to log it
		}
	}

	private resolveLabel(context: any = {}) {
		const result: string = context.name || extractClassName(context) || context.id || "";
		return (result.length > 0) ? `[${ result }]` : result;
	}

}

export default PubSubImpl;
