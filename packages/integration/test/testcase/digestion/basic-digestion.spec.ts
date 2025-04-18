import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

const TEMPLATE: string = `<div>
	<p data-testid="the-value">{{m().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "Old";
	}

	public update(): void {
		this.value = "New";
	}

}

describe("Basic Digestion", () => {

	test.skip("Test digest update", () => {
		const segmentDigester: any = null; // LoggingSegmentDigester = new LoggingSegmentDigester();

		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
			"cydran.internal.factory.segment-digester": () => segmentDigester
		});

		harness.start();

		harness.forTestId("the-value").expect().textContent().toEqual("Old");
		harness.forText("Change Value").get().click();
		harness.forTestId("the-value").expect().textContent().toEqual("New");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-2 - Evaluating - m().value",
			"0-0-2 - Changed - m().value",
			"0-0-2 - Evaluating - m().value"
		]);
	});

});
