import Listener from "message/Listener";
import PubSub from "message/PubSub";
import ListenerImpl from "message/ListenerImpl";
import { INTERNAL_CHANNEL_NAME } from "CydranConstants";
import { defaulted, isDefined, requireNotNull } from "util/Utils";
import OnContinuation from "continuation/OnContinuation";
import SimpleMap from "interface/SimpleMap";
import { Context } from "context/Context";
import GlobalContextHolder from "context/GlobalContextHolder";
import { ContextUnavailableError } from "error/Errors";

// TODO - Use weak references to avoid memory leaks

class PubSubImpl implements PubSub {

	// TODO - Correct objectThis for callbacks and weakly reference

	private listeners: SimpleMap<Listener>;

	private context: Context;

	private thisObject: Object;

	constructor(thisObject: Object, context: Context) {
		if (isDefined(context)) {
			this.setContext(context);
		}

		this.setTarget(thisObject);
		this.listeners = {};
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToContext(channelName, messageName, payload);
	}

	public sendToParent(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToParent(channelName, messageName, payload);
	}

	public sendToParents(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToParents(channelName, messageName, payload);
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToRoot(channelName, messageName, payload);
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToImmediateChildren(channelName, messageName, payload);
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendToDescendants(channelName, messageName, payload);
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getMessagingContext().sendGlobally(channelName, messageName, payload);
	}

	private getContext(): Context {
		return this.context;
	}

	private getMessagingContext(): Context {
		const context: Context = this.getContext();

		if (!isDefined(context)) {
			throw new ContextUnavailableError("Context is not available for messaging.");
		}

		return context;
	}

	private getObjectContext(): Context {
		return defaulted(this.getContext(), GlobalContextHolder.getContext());
	}

	public setTarget(thisObject: any): void {
		this.thisObject = thisObject;
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

	public $release(): void {
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
			this.listeners[channelName] = new ListenerImpl(() => this.thisObject);
		}

		const listener: Listener = this.listeners[channelName];

		listener.register(messageName, callback);
	}

	private setLogger(): void {
		try {
			requireNotNull(this.thisObject, "thisObject");
			requireNotNull(this.getContext(), "context");
		} catch(err) {
			// intential noop and logger isn't ready to log it
		}
	}

}

export default PubSubImpl;
