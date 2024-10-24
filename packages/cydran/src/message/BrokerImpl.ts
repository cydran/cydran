import Broker from "message/Broker";
import { defaulted, isDefined, requireNotNull } from "util/Utils";
import MessageCallback from "message/MessageCallback";
import GarbageCollectableSet from "pattern/GarbageCollectableSet";
import GarbageCollectableSetImpl from "pattern/GarbageCollectableSetImpl";

class BrokerImpl implements Broker {

	private callbacks: GarbageCollectableSet<MessageCallback, Object>;

	constructor() {
		this.callbacks = new GarbageCollectableSetImpl<MessageCallback, Object>;
	}

	public send(channelName: string, messageName: string, payload: any = {}): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		this.callbacks.forEach((callback: MessageCallback, thisObject: Object) => {
			callback.call(thisObject, channelName, messageName, payload);
		});
	}

	public addListener(thisObject: Object, callback: MessageCallback): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(callback, thisObject);
	}

	public removeListener(callback: MessageCallback): void {
		if (isDefined(callback)) {
			this.callbacks.remove(callback);
		}
	}

	public $release(): void {
		this.callbacks.clear();
	}

}

export default BrokerImpl;
