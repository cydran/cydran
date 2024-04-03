import Disposable from "interface/ables/Disposable";
import MessageCallback from "message/MessageCallback";

interface Broker extends Disposable {

	send(channelName: string, messageName: string, payload?: any): void;

	addListener(callback: MessageCallback): void;

	removeListener(callback: MessageCallback): void;

}

export default Broker;
