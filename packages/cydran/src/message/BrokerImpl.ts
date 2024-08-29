import Broker from "message/Broker";
import { defaulted, isDefined, requireNotNull } from "util/Utils";
import MessageCallback from "message/MessageCallback";
import IterableWeakSet from "pattern/IterableWeakSet";

class BrokerImpl implements Broker {

	private callbacks: IterableWeakSet<MessageCallback>;

	constructor() {
		this.callbacks = new IterableWeakSet<MessageCallback>;
	}

	public send(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: any = defaulted(payload, {});

		this.callbacks.forEach((callback: MessageCallback) => {
			callback(channelName, messageName, actualPayload);
		});
	}

	public addListener(callback: MessageCallback): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(callback);
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
