import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().value}}</p>
	<script type="cydran/region" c-region-name="child"></script>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item">
			<div>
				<p data-testid="item">{{v().value}}</p>
				<button c-onclick="v().value = 'Beta'">Change Value</button>
			</div>
		</template>
	</ul>
</div>`;

interface Item {

	id: string;

	value: string;

}

class ParentComponent extends Component {

	private value: string;

	constructor() {
		super(PARENT_TEMPLATE);
		this.value = "Gamma";
	}

}

class ChildComponent extends Component {

	private items: Item[];

	constructor() {
		super(CHILD_TEMPLATE);
		this.items = [
			{
				id: "1",
				value: "Alpha"
			}
		];
	}

}

test("Each -> Parent -> Disconnected Region -> Parent", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.getComponent().setChild("child", new ChildComponent());

	harness.forTestId("parent").expect().textContent().toEqual("Gamma");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forTestId("item").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Gamma");
	harness.forTestId("child").expect().textContent().toEqual("Beta");
	harness.forTestId("item").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-8 - Evaluating - v().value',
		'0-0-8 - Changed - v().value',
		'0-0-5 - Evaluating - m().items',
		'0-0-5 - Changed - m().items',
		'0-0-5 - Evaluating - m().items[0].value',
		'0-0-5 - Changed - m().items[0].value',
		'0-0-8 - Evaluating - v().value',
		'0-0-5 - Evaluating - m().items',
		'0-0-5 - Evaluating - m().items[0].value'
	]);
});
