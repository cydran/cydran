import Listener from "message/Listener";
import Receiver from "message/Receiver";
import ListenerImpl from "message/ListenerImpl";
import { INTERNAL_CHANNEL_NAME } from "CydranConstants";
import { isDefined, requireNotNull } from "util/Utils";
import OnContinuation from "continuation/OnContinuation";
import SimpleMap from "interface/SimpleMap";

class ReceiverImpl implements Receiver {

	private listeners: SimpleMap<Listener>;

	private thisObject: Object;

	constructor(thisObject: Object) {
		this.setTarget(thisObject);
		this.listeners = {};
	}

	public setTarget(thisObject: Object): void {
		this.thisObject = thisObject;
	}

	public message(channelName: string, messageName: string, payload?: unknown): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: unknown = (payload === null || payload === undefined) ? {} : payload;
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

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const mine: ReceiverImpl = this;

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (callback: (payload: unknown) => void) => {
						requireNotNull(callback, "callback");
						mine.listenTo(channelName, messageName, callback);
					}
				};
			},
			invoke: (callback: (payload: unknown) => void) => {
				requireNotNull(callback, "callback");
				mine.listenTo(INTERNAL_CHANNEL_NAME, messageName, callback);
			}
		};
	}

	public listenTo(channelName: string, messageName: string, callback: (payload: unknown) => void): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		requireNotNull(callback, "callback");

		if (!isDefined(this.listeners[channelName])) {
			this.listeners[channelName] = new ListenerImpl(() => this.thisObject);
		}

		const listener: Listener = this.listeners[channelName];

		listener.register(messageName, callback);
	}

}

export default ReceiverImpl;
