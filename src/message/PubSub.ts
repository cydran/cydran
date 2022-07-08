import OnContinuation from "continuation/OnContinuation";
import Disposable from "interface/ables/Disposable";

interface PubSub extends Disposable {

	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	enableGlobal(): void;

	disableGlobal(): void;

	isGlobalEnabled(): boolean;

}

export default PubSub;
