import DigestionCandidate from "@/digest/DigestionCandidate";

interface DigestionCandidateConsumer {

	add(key: string, mediators: DigestionCandidate[]): void;

}

export default DigestionCandidateConsumer;