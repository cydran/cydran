import DigestionCandidate from "digest/DigestionCandidate";
import SegmentDigester from "digest/SegmentDigester";
import Logger from "log/Logger";
import { extractClassName, requireNotNull } from 'util/Utils';

class SegmentDigesterImpl implements SegmentDigester {

	private logger: Logger;

	constructor(logger: Logger) {
		this.logger = requireNotNull(logger, "logger");
	}

	public digestSegment(id: string, changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void {
		for (const candidate of candidates) {
			let changed: boolean = false;

			try {
				changed = candidate.evaluate();
			} catch (e) {
				this.logger.error(`Mediator evaluation error: ${ extractClassName(candidate) } - ${ candidate.getExpression() }`, e);
				throw e;
			}

			if (changed) {
				changedCandidates.push(candidate);
			}
		}
	}

}

export default SegmentDigesterImpl;
