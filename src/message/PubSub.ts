import OnContinuation from "continuation/OnContinuation";
import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";

interface PubSub extends Disposable, Tellable {

	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	isMounted(): boolean;

}

export default PubSub;
