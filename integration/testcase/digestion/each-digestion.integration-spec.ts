import { builder, Ids, Stage, Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<ul c:each="m().items">
		<template c:type="item">
			<li>{{v().name}}</li>
		</template>
	</ul>
	<p data-testid="the-value">{{m().items[0].name}}</p>
	<button c:onclick="m().update()">Change Value</button>
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

test("Test each digest update - Outer interaction", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.forTestId("the-value").expect().textContent().toEqual("One");
	harness.forText("Change Value").get().click();
	harness.forTestId("the-value").expect().textContent().toEqual("Uno");

	expect(segmentDigester.getEvents()).toEqual([
		"0-0-2 - Evaluating - m().items[0].name",
		"0-0-2 - Changed - m().items[0].name",
		"0-0-2 - Evaluating - m().items",
		"0-0-2 - Changed - m().items",
		"0-0-8 - Evaluating - v().name",
		"0-0-6 - Evaluating - v().name",
		"0-0-6 - Changed - v().name",
		"0-0-2 - Evaluating - m().items[0].name",
		"0-0-2 - Evaluating - m().items",
		"0-0-8 - Evaluating - v().name",
		"0-0-6 - Evaluating - v().name"
	]);
});
