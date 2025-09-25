import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child"></c-region>
	<p data-testid="parent">{{m().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().value}}</p>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(PARENT_TEMPLATE);
		this.value = "Alpha";
	}

	public update(): void {
		this.value = "Gamma";
	}

}

class ChildComponent extends Component {

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Beta";
	}

}

describe("Disconnected Region -> Parent -> Child", () => {

	test("Each Parent", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.getComponent().$c().regions().set("child", new ChildComponent());

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Beta");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Gamma");
		harness.forTestId("child").expect().textContent().toEqual("Beta");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-6 - Evaluating - m().value",
			"0-0-6 - Changed - m().value",
			"0-0-6 - Evaluating - m().value"
		]);
	});

});
