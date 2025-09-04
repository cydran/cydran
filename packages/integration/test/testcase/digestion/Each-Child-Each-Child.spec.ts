import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().items[0].items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item">
			<div>
				<ul c-each="v().items">
					<template c-type="item">
						<div>
							<p data-testid="child">{{v().value}}</p>
						</div>
					</template>
				</ul>
			</div>
		</template>
	</ul>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

interface ParentItem {

	id: string;

	items: Item[];

}

interface Item {

	id: string;

	value: string;

}

class TestComponent extends Component {

	private items: ParentItem[];

	constructor() {
		super(TEMPLATE);
		this.items = [
			{
				id: "1",
				items: [
					{
						id: "2",
						value: "Alpha"
					}
				]
			}
		];
	}

	public update(): void {
		this.items[0].items[0].value = "Beta";
	}

}

describe("Disconnected Region -> Parent", () => {

	test("Each -> Child -> Disconnected Region -> Child", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Alpha");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("child").expect().textContent().toEqual("Beta");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-6 - Evaluating - m().items[0].items[0].value",
			"0-0-6 - Changed - m().items[0].items[0].value",
 			"0-0-11 - Evaluating - v().items",
			"0-0-11 - Changed - v().items",
			"0-0-14 - Evaluating - v().value",
			"0-0-14 - Changed - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Evaluating - m().items[0].items[0].value",
			"0-0-11 - Evaluating - v().items",
			"0-0-14 - Evaluating - v().value"
		]);
	});

});
