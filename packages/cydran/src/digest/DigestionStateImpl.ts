import DigestionState from "digest/DigestionState";
import DigestionCandidate from "digest/DigestionCandidate";
import SimpleMap from "interface/SimpleMap";
import Notifyable from "interface/ables/Notifyable";
import SegmentDigester from 'digest/SegmentDigester';
import { isDefined } from "util/Utils";
import SegmentDigesterImpl from "digest/SegmentDigesterImpl";

const DEFAULT_FACTORY: () => DigestionStateImpl = () => new DigestionStateImpl();

class DigestionStateImpl implements DigestionState {

	private candidates: SimpleMap<DigestionCandidate[]>;

	private segmentDigester: SegmentDigester;

	private static factory: () => DigestionStateImpl = DEFAULT_FACTORY;

	public static create(): DigestionStateImpl {
		return DigestionStateImpl.factory();
	}

	public static setFactory(factory: () => DigestionStateImpl): void {
		DigestionStateImpl.factory = isDefined(factory) ? factory : DEFAULT_FACTORY;
	}

	constructor() {
		this.segmentDigester = SegmentDigesterImpl.create();
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

export default DigestionStateImpl;
