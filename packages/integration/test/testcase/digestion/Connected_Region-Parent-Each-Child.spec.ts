import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child" value="m().items[0]"></c-region>
	<p data-testid="parent">{{m().items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item">
			<p data-testid="item">{{v().value}}</p>
		</template>
	</ul>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

interface Item {

	id: string;

	value: string;

}

class ParentComponent extends Component {

	private items: Item[];

	constructor() {
		super(PARENT_TEMPLATE);
		this.items = [
			{
				id: "1",
				value: "Alpha"
			}
		];
	}

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

	public update(): void {
		this.$c().getValue<any>().value = "Beta";
	}

}

describe("Connected Region -> Parent -> Each -> Child", () => {

	test("Connected Region -> Parent -> Each -> Child", () => {
		const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.getComponent().$c().regions().set("child", new ChildComponent());

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Alpha");
		harness.forTestId("item").expect().textContent().toEqual("Alpha");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("child").expect().textContent().toEqual("Beta");
		harness.forTestId("item").expect().textContent().toEqual("Beta");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-15 - Evaluating - v().value",
			"0-0-15 - Changed - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-6 - Changed - m().items[0].value",
			"0-0-11 - Evaluating - v().value",
			"0-0-11 - Changed - v().value",
			"0-0-15 - Evaluating - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-11 - Evaluating - v().value",
		]);
	});

});
