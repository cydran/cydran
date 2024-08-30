import Releasable from "interface/ables/Releasable";
import MessageCallback from "message/MessageCallback";

interface Broker extends Releasable {

	send(channelName: string, messageName: string, payload?: any): void;

	addListener(callback: MessageCallback): void;

	removeListener(callback: MessageCallback): void;

}

export default Broker;
