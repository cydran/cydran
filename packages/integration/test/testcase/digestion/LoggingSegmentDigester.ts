class LoggingSegmentDigester {

	private events: string[];

	constructor() {
		this.events = [];
	}

	public digestSegment(id: string, changedCandidates: any[], candidates: any[]): void {
		for (const candidate of candidates) {
			let changed: boolean = false;

			try {
				changed = candidate.evaluate();
				this.events.push(`${id} - Evaluating - ${candidate.getExpression()}`);
			} catch (e) {
				throw e;
			}

			if (changed) {
				this.events.push(`${id} - Changed - ${candidate.getExpression()}`);
				changedCandidates.push(candidate);
			}
		}
	}

	public getEvents(): string[] {
		return this.events;
	}

}

export default LoggingSegmentDigester;
