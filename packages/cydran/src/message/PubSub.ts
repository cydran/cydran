import OnContinuation from "continuation/OnContinuation";
import Releasable from "interface/ables/Releasable";
import Sendable from "interface/ables/Sendable";

interface PubSub extends Releasable, Sendable {

	on(messageName: string): OnContinuation;

}

export default PubSub;
