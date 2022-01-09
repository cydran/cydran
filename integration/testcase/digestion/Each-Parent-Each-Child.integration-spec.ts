import { Component } from 'cydran';
import Harness from '../../Harness';
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

test("Each -> Parent -> Each -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child1").expect().textContent().toEqual("Alpha");
	harness.forTestId("child2").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child1").expect().textContent().toEqual("Beta");
	harness.forTestId("child2").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-8 - Evaluating - v().value',
		'0-0-8 - Changed - v().value',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		'0-0-2 - Changed - m().items[0].value',
		'0-0-6 - Evaluating - v().value',
		'0-0-6 - Changed - v().value',
		'0-0-8 - Evaluating - v().value',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		'0-0-6 - Evaluating - v().value'
	]);
});
