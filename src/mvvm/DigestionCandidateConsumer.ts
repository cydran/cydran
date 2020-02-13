import DigestionCandidate from "@/mvvm/DigestionCandidate";

interface DigestionCandidateConsumer {

	add(key: string, mediators: DigestionCandidate[]): void;

}

export default DigestionCandidateConsumer;
