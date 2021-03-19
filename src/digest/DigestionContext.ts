import DigestionCandidateConsumer from "@/digest/DigestionCandidateConsumer";
import Notifyable from "@/interface/ables/Notifyable";

interface DigestionContext extends DigestionCandidateConsumer {

	digest(): Notifyable[];

}

export default DigestionContext;