import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

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
				this.events.push(`Evaluated: ${candidate.getExpression()}`);
			} catch (e) {
				throw e;
			}

			if (changed) {
				changedCandidates.push(candidate);
			}
		}
	}

	public getEvents(): string[] {
		return this.events;
	}

}

describe("No Behaviors", () => {

	test("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingleton("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");
		expect(harness.getDocument().body.innerHTML).toEqual("<!--SS--><!--SE--><div>Hello World!</div><!--SS--><!--SE-->");
		expect(segmentDigester.getEvents().length).toEqual(0);
	});

});
