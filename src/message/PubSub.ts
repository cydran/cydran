import OnContinuation from "continuation/OnContinuation";
import Disposable from "interface/ables/Disposable";
import Sendable from "interface/ables/Sendable";
import Tellable from "interface/ables/Tellable";

interface PubSub extends Disposable, Tellable, Sendable {

	on(messageName: string): OnContinuation;

	isMounted(): boolean;

}

export default PubSub;
