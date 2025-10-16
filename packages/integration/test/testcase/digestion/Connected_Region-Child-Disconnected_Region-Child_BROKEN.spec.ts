import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

const GRAND_PARENT_TEMPLATE: string = `<div>
	<c-region name="child" value="m().values"></c-region>
	<p data-testid="grand-parent">{{m().values.value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child"></c-region>
	<p data-testid="parent">{{v().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().value}}</p>
</div>`;

interface ValueContainer {

	value: string;

}

class GrandParentComponent extends Component {

	private values: ValueContainer;

	constructor() {
		super(GRAND_PARENT_TEMPLATE);
		this.values = {
			value: "Alpha"
		};
	}

	public update(): void {
		this.values.value = "Beta";
	}

}

class ParentComponent extends Component {

	constructor() {
		super(PARENT_TEMPLATE);
	}

}

class ChildComponent extends Component {

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Gamma";
	}

}

describe("Connected Region -> Child -> Disconnected Region -> Child", () => {

	test.skip("Connected Region -> Child -> Disconnected Region -> Child", () => {
		const segmentDigester: any = null; //LoggingSegmentDigester = new LoggingSegmentDigester();

		const harness: Harness<GrandParentComponent> = new Harness<GrandParentComponent>(() => new GrandParentComponent(), {
			"cydran.internal.factory.segment-digester": () => segmentDigester
		});

		harness.start();

		const parent: ParentComponent = new ParentComponent();
		const child: ChildComponent = new ChildComponent();

		parent.$c().regions().set("child", child);

		harness.getComponent().$c().regions().set("child", parent);

		harness.forTestId("grand-parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");
		harness.forText("Change Value").get().click();
		harness.forTestId("grand-parent").expect().textContent().toEqual("Beta");
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");

		expect(segmentDigester.getEvents()).toEqual([
			'0-0-2 - Evaluating - m().values.value',
			'0-0-2 - Changed - m().values.value',
			'0-0-6 - Evaluating - v().value',
			'0-0-6 - Changed - v().value',
			'0-0-2 - Evaluating - m().values.value',
			'0-0-6 - Evaluating - v().value'
		]);
	});

});
