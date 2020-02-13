import DigestionCandidate from "@/DigestionCandidate";

interface DigestionCandidateConsumer {

	add(key: string, mediators: DigestionCandidate[]): void;

}

export default DigestionCandidateConsumer;
