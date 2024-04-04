import { Component } from "@cydran/cydran";
import Harness from "../../Harness";
import LoggingSegmentDigester from "./LoggingSegmentDigester";

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

test.skip("Digestion - No behaviors", () => {
	document.body.innerHTML = '<div></div>';

	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	expect(harness.getDocument().body.innerHTML).toEqual("<div>Hello World!</div>");
	expect(segmentDigester.getEvents().length).toEqual(0);
});
