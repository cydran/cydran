import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child"></c-region>
	<p data-testid="parent">{{m().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(PARENT_TEMPLATE);
		this.value = "Alpha";
	}

}

class ChildComponent extends Component {

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Beta";
	}

	public update(): void {
		this.value = "Gamma";
	}

}

describe("Disconnected Region -> Parent", () => {

	test("Disconnected Region -> Parent", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);
		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.getComponent().$c().regions().set("child", new ChildComponent());

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Beta");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-10 - Evaluating - m().value",
			"0-0-10 - Changed - m().value",
			"0-0-10 - Evaluating - m().value"
		]);
	});

});
