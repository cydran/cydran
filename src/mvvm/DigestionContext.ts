import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";

interface DigestionContext extends DigestionCandidateConsumer {

	digest(): void;

}

export default DigestionContext;
