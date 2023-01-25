import DigestionCandidate from "digest/DigestionCandidate";
import SegmentDigester from "digest/SegmentDigester";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import { extractClassName, isDefined } from "util/Utils";

const DEFAULT_FACTORY: () => SegmentDigesterImpl = () => new SegmentDigesterImpl();

class SegmentDigesterImpl implements SegmentDigester {

	private logger: Logger;

	private static factory: () => SegmentDigesterImpl = DEFAULT_FACTORY;

	constructor() {
		this.logger = LoggerFactory.getLogger("SegmentDigester");
	}

	public static create(): SegmentDigesterImpl {
		return SegmentDigesterImpl.factory();
	}

	public static setFactory(factory: () => SegmentDigesterImpl): void {
		SegmentDigesterImpl.factory = isDefined(factory) ? factory : DEFAULT_FACTORY;
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
