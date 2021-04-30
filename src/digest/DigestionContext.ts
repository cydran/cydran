import Notifyable from "interface/ables/Notifyable";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";

interface DigestionContext extends DigestionCandidateConsumer {
	digest(): Notifyable[];
}

export default DigestionContext;