import Disposable from "interface/ables/Disposable";
import Listener from "message/Listener";

interface Broker extends Disposable {

	broadcast(channelName: string, messageName: string, payload?: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

}

export default Broker;
