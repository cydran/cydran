import Releasable from "interface/ables/Releasable";
import MessageCallback from "message/MessageCallback";

interface Broker extends Releasable {

	send(channelName: string, messageName: string, payload?: any): void;

	addListener(thisObject: Object, callback: MessageCallback): void;

	removeListener(thisObject: Object, callback: MessageCallback): void;

}

export default Broker;
