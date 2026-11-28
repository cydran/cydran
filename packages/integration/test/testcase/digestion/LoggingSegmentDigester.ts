/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

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
