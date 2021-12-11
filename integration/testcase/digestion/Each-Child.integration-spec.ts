import { builder, Ids, Stage, Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<ul c:each="m().items">
		<template c:type="item">
			<li>
				<p>Id: {{v().id}}</p>
				<p data-testid="{{v().id}}">{{v().title}}</p>
			</li>
		</template>
	</ul>
	<button c:onclick="m().update()">Change Value</button>
</div>`;

interface Item {

	id: string;

	title: string;

}
class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(TEMPLATE);

		this.items = [
			{
				id: "1",
				title: "Alpha"
			},
			{
				id: "2",
				title: "Beta"
			}
		];
	}

	public update(): void {
		this.items[0].title = "Gamma";
	}

}

test("Each Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.forTestId("1")
		.expect()
		.textContent()
		.toEqual("Alpha");

		harness.forTestId("2")
		.expect()
		.textContent()
		.toEqual("Beta");

	harness.forText("Change Value")
		.get()
		.click();

		harness.forTestId("1")
		.expect()
		.textContent()
		.toEqual("Gamma");

		harness.forTestId("2")
		.expect()
		.textContent()
		.toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().update()',
		'0-0-9 - Evaluating - v().id',
		'0-0-9 - Evaluating - v().title',
		'0-0-9 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().title',
		'0-0-5 - Changed - v().title',
		'0-0-5 - Evaluating - v().id',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().update()',
		'0-0-9 - Evaluating - v().id',
		'0-0-9 - Evaluating - v().title',
		'0-0-9 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().title',
		'0-0-5 - Evaluating - v().id'
	]);
});
