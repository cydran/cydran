import { Component, LoggingSegmentDigester } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";

const PARENT_TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().container.items[0].value}}</p>
	<c-region name="child" value="m().container"></c-region>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().items[0].value}}</p>
	<ul c-each="v().items">
		<template c-type="item">
			<div>
				<p data-testid="item">{{v().value}}</p>
				<button c-onclick="v().value = 'Beta'">Change Value</button>
			</div>
		</template>
	</ul>
</div>`;

interface Container {

	items: Item[];

}

interface Item {

	id: string;

	value: string;

}

class ParentComponent extends Component {

	private container: Container;

	constructor() {
		super(PARENT_TEMPLATE);
		this.container = {
			items: [
				{
					id: "1",
					value: "Alpha"
				}
			]
		};
	}

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

}

test.skip("Each -> Parent -> Connected Region -> Parent", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

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
		'0-0-8 - Evaluating - v().value',
		'0-0-8 - Changed - v().value',
		'0-0-5 - Evaluating - v().items',
		'0-0-5 - Changed - v().items',
		'0-0-5 - Evaluating - v().items[0].value',
		'0-0-5 - Changed - v().items[0].value',
		'0-0-2 - Evaluating - m().container.items[0].value',
		'0-0-2 - Changed - m().container.items[0].value',
		'0-0-8 - Evaluating - v().value',
		'0-0-5 - Evaluating - v().items',
		'0-0-5 - Evaluating - v().items[0].value',
		'0-0-2 - Evaluating - m().container.items[0].value'
	]);
});
