import Notifyable from "interface/ables/Notifyable";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";

interface DigestionState extends DigestionCandidateConsumer {

	digest(): Notifyable[];

}

export default DigestionState;
