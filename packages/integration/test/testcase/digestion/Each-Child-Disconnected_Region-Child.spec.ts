import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().items[0].value}}</p>
	<ul c-each="m().items">
		<template c-type="item" c-component="item"></template>
	</ul>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const ITEM_TEMPLATE: string = `<div>
	<c-region name="child"></c-region>
	<p data-testid="item">{{v().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().value}}</p>
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

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Gamma";
	}

}

class ItemComponent extends Component {

	constructor() {
		super(ITEM_TEMPLATE);
	}

	public onMount(): void {
		this.$c().regions().set("child", new ChildComponent());	
	}

}

describe("Disconnected Region -> Parent -> Child", () => {

	test("Each -> Child -> Disconnected Region -> Child", () => {
		const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);
		harness.registerPrototype("item", ItemComponent);
		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.forTestId("parent").expect().textContent().toEqual("Alpha");
		harness.forTestId("item").expect().textContent().toEqual("Alpha");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");
		harness.forText("Change Value").get().click();
		harness.forTestId("parent").expect().textContent().toEqual("Beta");
		harness.forTestId("item").expect().textContent().toEqual("Beta");
		harness.forTestId("child").expect().textContent().toEqual("Gamma");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Changed - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-6 - Changed - m().items[0].value",
			"0-0-11 - Evaluating - v().value",
			"0-0-11 - Changed - v().value",
			"0-0-6 - Evaluating - m().items",
			"0-0-6 - Evaluating - m().items[0].value",
			"0-0-11 - Evaluating - v().value"
		]);
	});

});
