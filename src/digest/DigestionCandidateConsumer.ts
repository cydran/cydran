import DigestionCandidate from "digest/DigestionCandidate";

interface DigestionCandidateConsumer {

	add(key: string, behaviors: DigestionCandidate[]): void;

}

export default DigestionCandidateConsumer;
