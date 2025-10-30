import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<ul c-each="m().items">
		<template c-type="item">
			<li>{{v().name}}</li>
		</template>
	</ul>
	<p data-testid="the-value">{{m().items[0].name}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

interface Item {

	id: string;

	name: string;

}

class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(TEMPLATE);

		this.items = [
			{
				id: "1",
				name: "One"
			},
			{
				id: "2",
				name: "Two"
			}
		];
	}

	public update(): void {
		this.items[0].name = "Uno";
	}

}

describe("Each-Parent", () => {

	test("Test each digest update - Outer interaction", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);
		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.forTestId("the-value").expect().textContent().toEqual("One");
		harness.forText("Change Value").get().click();
		harness.forTestId("the-value").expect().textContent().toEqual("Uno");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-6 - Evaluating - m().items[0].name",
			"0-0-6 - Changed - m().items[0].name",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-15 - Evaluating - v().name",
			"0-0-12 - Evaluating - v().name",
			"0-0-12 - Changed - v().name",
			"0-0-6 - Evaluating - m().items[0].name",
			"0-0-6 - Evaluating - m().items",
			"0-0-15 - Evaluating - v().name",
			"0-0-12 - Evaluating - v().name"
		]);
	});

});
