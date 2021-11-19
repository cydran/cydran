import DigestionCandidate from "digest/DigestionCandidate";

interface SegmentDigester {

	digestSegment(id: string, changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void;

}

export default SegmentDigester;
