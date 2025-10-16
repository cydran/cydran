import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

describe("No Behaviors", () => {

	test("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");
		expect(harness.getDocument().body.innerHTML).toEqual("<!--SS--><!--SE--><div>Hello World!</div><!--SS--><!--SE-->");
		expect(segmentDigester.getEvents().length).toEqual(0);
	});

});
