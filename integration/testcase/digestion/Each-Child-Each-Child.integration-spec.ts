import { Component } from 'cydran';
import Harness from '../../Harness';
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

test("Each -> Child -> Disconnected Region -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().items[0].items[0].value',
		'0-0-2 - Changed - m().items[0].items[0].value',
		'0-0-6 - Evaluating - v().items',
		'0-0-6 - Changed - v().items',
		'0-0-8 - Evaluating - v().value',
		'0-0-8 - Changed - v().value',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().items[0].items[0].value',
		'0-0-6 - Evaluating - v().items',
		'0-0-8 - Evaluating - v().value'
	]);
});
