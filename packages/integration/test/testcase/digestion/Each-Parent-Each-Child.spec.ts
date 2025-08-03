import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { expect, test, describe } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item">
			<div>
				<p data-testid="child1">{{v().value}}</p>
				<button c-onclick="v().value = 'Beta'">Change Value</button>
			</div>
		</template>
	</ul>
	<ul c-each="m().items">
		<template c-type="item">
			<div>
				<p data-testid="child2">{{v().value}}</p>
			</div>
		</template>
	</ul>
</div>`;

interface Item {

	id: string;

	value: string;

}

class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(TEMPLATE);
		this.items = [
			{
				id: "1",
				value: "Alpha"
			}
		];
	}

}

describe("Each-Parent-Each-Child", () => {

	test("Each -> Parent -> Each -> Child", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);
		harness.start();

		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child1").expect().textContent().toEqual("Alpha");
		harness.forTestId("child2").expect().textContent().toEqual("Alpha");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("child1").expect().textContent().toEqual("Beta");
		harness.forTestId("child2").expect().textContent().toEqual("Beta");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-15 - Evaluating - v().value",
			"0-0-15 - Changed - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-6 - Changed - m().items[0].value",
			"0-0-11 - Evaluating - v().value",
			"0-0-11 - Changed - v().value",
			"0-0-15 - Evaluating - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-11 - Evaluating - v().value"
		]);
	});

});
