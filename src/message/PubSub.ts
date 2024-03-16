import OnContinuation from "continuation/OnContinuation";
import Disposable from "interface/ables/Disposable";
import Sendable from "interface/ables/Sendable";

interface PubSub extends Disposable, Sendable {

	on(messageName: string): OnContinuation;

}

export default PubSub;
