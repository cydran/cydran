import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const GRAND_PARENT_TEMPLATE: string = `<div>
	<c-region name="child"></c-region>
	<p data-testid="grand-parent">{{m().value}}</p>
</div>`;

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child" value="m().values"></c-region>
	<p data-testid="parent">{{m().values.value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

interface ValueContainer {

	value: string;

}

class GrandParentComponent extends Component {

	private value: string;

	constructor() {
		super(GRAND_PARENT_TEMPLATE);
		this.value = "Alpha";
	}

}

class ParentComponent extends Component {

	private values: ValueContainer;

	constructor() {
		super(PARENT_TEMPLATE);

		this.values = {
			value: "Beta"
		};
	}

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

	public update(): void {
		this.$c().getValue<any>().value = "Gamma";
	}

}

describe("Connected Region -> Parent -> Disconnected Region -> Parent", () => {

	test("Connected Region -> Parent -> Disconnected Region -> Parent", () => {
		const harness: Harness<GrandParentComponent> = new Harness<GrandParentComponent>(() => new GrandParentComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();

		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		const parent: ParentComponent = new ParentComponent();
		const child: ChildComponent = new ChildComponent();

		harness.getComponent().$c().regions().set("child", parent);
		parent.$c().regions().set("child", child);

		harness.forTestId("grand-parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("child").expect().textContent().toEqual("Beta");
		harness.forText("Change Value").get().click();
		harness.forTestId("grand-parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("parent").expect().textContent().toEqual("Gamma");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-11 - Evaluating - v().value",
			"0-0-11 - Changed - v().value",
			"0-0-10 - Evaluating - m().values.value",
			"0-0-10 - Changed - m().values.value",
			"0-0-11 - Evaluating - v().value",
			"0-0-10 - Evaluating - m().values.value",
		]);
	});

});
