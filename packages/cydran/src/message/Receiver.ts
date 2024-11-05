import OnContinuation from "continuation/OnContinuation";
import Receivable from "interface/ables/Receivable";
import Releasable from "interface/ables/Releasable";

interface Receiver extends Releasable, Receivable {

	on(messageName: string): OnContinuation;

}

export default Receiver;
