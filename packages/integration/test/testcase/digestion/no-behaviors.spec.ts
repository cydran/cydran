import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

describe("No Behaviors", () => {

	test.skip("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';

		const segmentDigester: any = null; // LoggingSegmentDigester = new LoggingSegmentDigester();

		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
			"cydran.internal.factory.segment-digester": () => segmentDigester
		});

		harness.start();

		expect(harness.getDocument().body.innerHTML).toEqual("<div>Hello World!</div>");
		expect(segmentDigester.getEvents().length).toEqual(0);
	});

});
