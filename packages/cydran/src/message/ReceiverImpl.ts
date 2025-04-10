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

	public setTarget(thisObject: any): void {
		this.thisObject = thisObject;
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

		const mine: ReceiverImpl = this;

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

}

export default ReceiverImpl;
