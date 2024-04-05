import DigestionCandidate from 'digest/DigestionCandidate';

class LoggingSegmentDigester {

	private events: string[];

	constructor() {
		this.events = [];
	}

	public digestSegment(id: string, changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void {
		for (const candidate of candidates) {
			let changed: boolean = false;

			this.log(id, candidate.getExpression(), "Evaluating");

			try {
				changed = candidate.evaluate();
			} catch (e) {
				throw e;
			}

			if (changed) {
				this.log(id, candidate.getExpression(), "Changed");
				changedCandidates.push(candidate);
			}
		}
	}

	public getEvents(): string[] {
		return this.events;
	}

	private log(id: string, expression: string, message: string): void {
		this.events.push(`${id} - ${ message } - ${ expression }`);
	}

}

export default LoggingSegmentDigester;
