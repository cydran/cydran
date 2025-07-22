import Broker from "message/Broker";
import { defaulted, isDefined, requireNotNull } from "util/Utils";
import MessageCallback from "message/MessageCallback";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { CallBackThisObject } from 'CydranTypes';

class BrokerImpl implements Broker {

	private callbacks: GarbageCollectablePairedSet<CallBackThisObject, MessageCallback, CallBackThisObject>;

	constructor() {
		this.callbacks = new GarbageCollectablePairedSetImpl<CallBackThisObject, MessageCallback, CallBackThisObject>;
	}

	public send(channelName: string, messageName: string, payload: unknown): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		this.callbacks.forEach((thisObject: CallBackThisObject, callback: MessageCallback) => {
			callback.call(thisObject, channelName, messageName, defaulted(payload, {}));
		});
	}

	public addListener(thisObject: CallBackThisObject, callback: MessageCallback): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(thisObject, callback);
	}

	public removeListener(thisObject: CallBackThisObject, callback: MessageCallback): void {
		if (isDefined(thisObject) && isDefined(callback)) {
			this.callbacks.remove(thisObject, callback);
		}
	}

	public $release(): void {
		this.callbacks.clear();
	}

}

export default BrokerImpl;
