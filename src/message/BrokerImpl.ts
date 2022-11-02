import Broker from "message/Broker";
import { defaulted, isDefined, removeFromArray, requireNotNull } from "util/Utils";
import Logger from "log/Logger";
import MessageCallback from "message/MessageCallback";

class BrokerImpl implements Broker {

	private logger: Logger;

	private callbacks: MessageCallback[];

	constructor(logr: Logger) {
		this.logger = logr;
		this.callbacks = [];
	}

	public send(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		const actualPayload: any = defaulted(payload, {});

		this.logger.trace({
			channelName: channelName,
			messageName: messageName,
			payload: actualPayload
		});

		for (const callback of this.callbacks) {
			callback(channelName, messageName, actualPayload);
		}
	}

	public addMessageCallback(callback: MessageCallback): void {
		requireNotNull(callback, "callback");
		removeFromArray(this.callbacks, callback);
		this.callbacks.push(callback);
	}

	public removeMessageCallback(callback: MessageCallback): void {
		if (isDefined(callback)) {
			removeFromArray(this.callbacks, callback);
		}
	}

	public $dispose(): void {
		this.callbacks = [];
	}

}

export default BrokerImpl;
