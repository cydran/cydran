import DigestionCandidateConsumer from "@/DigestionCandidateConsumer";

interface DigestionContext extends DigestionCandidateConsumer {

	digest(): void;

}

export default DigestionContext;
