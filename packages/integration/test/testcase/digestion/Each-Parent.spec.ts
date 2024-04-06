import { Component, LoggingSegmentDigester } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";

const PARENT_TEMPLATE: string = `<div>
	<ul c-each="m().items">
		<template c-type="item" c-component="child"></template>
	</ul>
	<p data-testid="outer">{{m().items[0].title}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<li>
	<p>Id: {{v().id}}</p>
	<p data-testid="{{v().id}}">{{v().title}}</p>
	<button c-onclick="m().update()">Change Value {{v().id}}</button>
</li>`;

interface Item {

	id: string;

	title: string;

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

	public update(): void {
		this.$c().getValue().title = "Gamma";
	}

}
class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(PARENT_TEMPLATE);

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

}

test.skip("Each Parent", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.registerPrototype("child", ChildComponent);

	harness.start();

	harness.forTestId("1").expect().textContent().toEqual("Alpha");
	harness.forTestId("2").expect().textContent().toEqual("Beta");
	harness.forTestId("outer").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value 1").get().click();
	harness.forTestId("1").expect().textContent().toEqual("Gamma");
	harness.forTestId("outer").expect().textContent().toEqual("Gamma");
	harness.forTestId("2").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().title',
		'0-0-5 - Changed - v().title',
		'0-0-5 - Evaluating - v().id',
		'0-0-2 - Evaluating - m().items[0].title',
		'0-0-2 - Changed - m().items[0].title',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-11 - Evaluating - v().id',
		'0-0-11 - Evaluating - v().id',
		'0-0-11 - Evaluating - v().title',
		'0-0-11 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().id',
		'0-0-5 - Evaluating - v().title',
		'0-0-5 - Evaluating - v().id',
		'0-0-2 - Evaluating - m().items[0].title',
		'0-0-2 - Evaluating - m().items',
		'0-0-11 - Evaluating - v().id',
		'0-0-11 - Evaluating - v().id',
		'0-0-11 - Evaluating - v().title',
		'0-0-11 - Evaluating - v().id'
	]);
});
