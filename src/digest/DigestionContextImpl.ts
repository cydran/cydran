import DigestionContext from "digest/DigestionContext";
import DigestionCandidate from "digest/DigestionCandidate";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import Notifyable from "interface/ables/Notifyable";

class DigestionContextImpl implements DigestionContext {

	private readonly logger: Logger = LoggerFactory.getLogger(DigestionContextImpl.name);

	private candidates: SimpleMap<DigestionCandidate[]>;

	constructor() {
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
			this.digestSegment(changedCandidates, current);
		}

		return changedCandidates;
	}

	private digestSegment(changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void {
		for (const candidate of candidates) {
			let changed: boolean = false;

			try {
				changed = candidate.evaluate();
			} catch (e) {
				this.logger.error(`Error evaluating mediator: ${ candidate.constructor.name } - ${ candidate.getExpression() }`);
				throw e;
			}

			if (changed) {
				changedCandidates.push(candidate);
			}
		}
	}
}

export default DigestionContextImpl;
