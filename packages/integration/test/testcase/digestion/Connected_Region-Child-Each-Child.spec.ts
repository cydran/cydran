import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";

const PARENT_TEMPLATE: string = `<div>
	<c-region name="child" value="m().values"></c-region>
	<p data-testid="parent">{{m().values.items[0].value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<ul c-each="v().items">
		<template c-type="item" c-component="item"></template>
	</ul>
	<p data-testid="child">{{v().items[0].value}}</p>
</div>`;

const ITEM_TEMPLATE: string = `<div>
	<p data-testid="item">{{v().value}}</p>
</div>`;

interface Item {

	id: string;

	value: string;

}

interface ItemsContainer {

	items: Item[];

}

class ParentComponent extends Component {

	private values: ItemsContainer;

	constructor() {
		super(PARENT_TEMPLATE);
		this.values = {
			items: [
				{
					id: "1",
					value: "Alpha"
				}
			]
		};
	}

	public update(): void {
		this.values.items[0].value = "Beta";
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
	}

}

test.skip("Connected Region -> Child -> Each -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.registerPrototype("item", ItemComponent);
	harness.start();

	harness.getComponent().$c().regions().set("child", new ChildComponent());

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forTestId("item").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child").expect().textContent().toEqual("Beta");
	harness.forTestId("item").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().values.items[0].value',
		'0-0-2 - Changed - m().values.items[0].value',
		'0-0-6 - Evaluating - v().items[0].value',
		'0-0-6 - Changed - v().items[0].value',
		'0-0-6 - Evaluating - v().items',
		'0-0-6 - Changed - v().items',
		'0-0-9 - Evaluating - v().value',
		'0-0-9 - Changed - v().value',
		'0-0-2 - Evaluating - m().values.items[0].value',
		'0-0-6 - Evaluating - v().items[0].value',
		'0-0-6 - Evaluating - v().items',
		'0-0-9 - Evaluating - v().value'
	]);
});
