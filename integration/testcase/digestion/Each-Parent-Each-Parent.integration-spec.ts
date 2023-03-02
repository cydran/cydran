import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const GRAND_PARENT_TEMPLATE: string = `<div>
	<div c-each="m().values">
		<template c-type="item" c-component="parent"></template>
	</div>
	<p data-testid="grand-parent">{{m().values[0].values[0].value}}</p>
</div>`;

const PARENT_TEMPLATE: string = `<div>
	<div c-each="v().values">
		<template c-type="item" c-component="child"></template>
	</div>
	<p data-testid="parent">{{v().values[0].value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

interface ChildModel {
	id: string;
	value: string;
}

interface ParentModel {

	id: string;
	values: ChildModel[];

}

class GrandParentComponent extends Component {

	private values: ParentModel[];

	constructor() {
		super(GRAND_PARENT_TEMPLATE);
		this.values = [{
			id: "1",
			values: [
				{
					id: "2",
					value: "Alpha"
				}
			]
		}];
	}

}

class ParentComponent extends Component {

	constructor() {
		super(PARENT_TEMPLATE);
	}

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

	public update(): void {
		this.$c().getValue().value = "Beta";
	}

}

test.skip("Connected Region -> Parent -> Connected Region -> Parent", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<GrandParentComponent> = new Harness<GrandParentComponent>(() => new GrandParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.registerPrototype("parent", ParentComponent);
	harness.registerPrototype("child", ChildComponent);
	harness.start();

	harness.forTestId("grand-parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("grand-parent").expect().textContent().toEqual("Beta");
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-8 - Evaluating - v().value',
		'0-0-8 - Changed - v().value',
		'0-0-5 - Evaluating - v().values[0].value',
		'0-0-5 - Changed - v().values[0].value',
		'0-0-5 - Evaluating - v().values',
		'0-0-5 - Changed - v().values',
		'0-0-2 - Evaluating - m().values[0].values[0].value',
		'0-0-2 - Changed - m().values[0].values[0].value',
		'0-0-2 - Evaluating - m().values',
		'0-0-2 - Changed - m().values',
		'0-0-8 - Evaluating - v().value',
		'0-0-5 - Evaluating - v().values[0].value',
		'0-0-5 - Evaluating - v().values',
		'0-0-2 - Evaluating - m().values[0].values[0].value',
		'0-0-2 - Evaluating - m().values'
	]);
});
