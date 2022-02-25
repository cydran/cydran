import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item" c-component="item"></template>
	</ul>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const ITEM_TEMPLATE: string = `<div>
	<script type="cydran/region" c-region-name="child" c-region-value="v()"></script>
	<p data-testid="item">{{v().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().value}}</p>
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

	public update(): void {
		this.items[0].value = "Beta";
	}

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

}

class ItemComponent extends Component {

	constructor() {
		super(ITEM_TEMPLATE);
		this.setChild("child", new ChildComponent());
	}

}

test("Connected Region -> Parent -> Each -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.registerPrototype("item", ItemComponent);
	harness.start();

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("item").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("item").expect().textContent().toEqual("Beta");
	harness.forTestId("child").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		'0-0-2 - Changed - m().items[0].value',
		'0-0-6 - Evaluating - v().value',
		'0-0-6 - Changed - v().value',
		'0-0-9 - Evaluating - v().value',
		'0-0-9 - Changed - v().value',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		'0-0-6 - Evaluating - v().value',
		'0-0-9 - Evaluating - v().value'
	]);
});
