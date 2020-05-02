import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import Notifyable from "@/mvvm/Notifyable";

interface DigestionContext extends DigestionCandidateConsumer {

	digest(): Notifyable[];

}

export default DigestionContext;
