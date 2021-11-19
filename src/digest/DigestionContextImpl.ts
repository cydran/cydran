import DigestionContext from "digest/DigestionContext";
import DigestionCandidate from "digest/DigestionCandidate";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import Notifyable from "interface/ables/Notifyable";
import SegmentDigester from 'digest/SegmentDigester';
import CydranContext from "context/CydranContext";

class DigestionContextImpl implements DigestionContext {

	private readonly logger: Logger = LoggerFactory.getLogger(DigestionContextImpl.name);

	private candidates: SimpleMap<DigestionCandidate[]>;

	private segmentDigester: SegmentDigester;

	constructor(cydranContext: CydranContext) {
		this.segmentDigester = cydranContext.getFactories().createSegmentDigester();
		this.candidates = {};
	}

	public add(key: string, candidates: DigestionCandidate[]): void {
		if (!this.candidates[key]) {
			this.candidates[key] = [];

			for (const candidate of candidates) {
				this.candidates[key].push(candidate);
			}
		}
	}

	public digest(): Notifyable[] {
		const changedCandidates: DigestionCandidate[] = [];

		for (const key in this.candidates) {
			if (!this.candidates.hasOwnProperty(key)) {
				continue;
			}

			const current: DigestionCandidate[] = this.candidates[key];
			this.segmentDigester.digestSegment(key, changedCandidates, current);
		}

		return changedCandidates;
	}

}

export default DigestionContextImpl;
