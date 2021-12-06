import DigestionCandidate from "digest/DigestionCandidate";
import SegmentDigester from "digest/SegmentDigester";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

class SegmentDigesterImpl implements SegmentDigester {

	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger(this.constructor.name);
	}

	public digestSegment(id: string, changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void {
		for (const candidate of candidates) {
			let changed: boolean = false;

			try {
				changed = candidate.evaluate();
			} catch (e) {
				this.logger.error(`Mediator evaluation error: ${ candidate.constructor.name } - ${ candidate.getExpression() }`, e);
				throw e;
			}

			if (changed) {
				changedCandidates.push(candidate);
			}
		}
	}

}

export default SegmentDigesterImpl;
