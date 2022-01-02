import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<p data-testid="parent">{{m().items[0].value}}</p>
	<ul c:each="m().items">
		<template c:type="item">
			<div>
				<p data-testid="child1">{{v().value}}</p>
			</div>
		</template>
	</ul>
	<script type="cydran/region" c:region:name="child" c:region:value="m().items[0]"></script>
	<button c:onclick="m().items[0].value = 'Beta'">Change Value</button>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child2">{{v().value}}</p>
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

}

class ChildComponent extends Component {

	constructor() {
		super(CHILD_TEMPLATE);
	}

}

test("Each -> Parent -> Connected Region -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.getComponent().setChild("child", new ChildComponent());

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child1").expect().textContent().toEqual("Alpha");
	harness.forTestId("child2").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child1").expect().textContent().toEqual("Beta");
	harness.forTestId("child2").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Changed - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		'0-0-2 - Changed - m().items[0].value',
		"0-0-2 - Evaluating - m().items[0].value = 'Beta'",
		'0-0-7 - Evaluating - v().value',
		'0-0-7 - Changed - v().value',
		'0-0-9 - Evaluating - v().value',
		'0-0-9 - Changed - v().value',
		'0-0-2 - Evaluating - m().items',
		'0-0-2 - Evaluating - m().items[0].value',
		"0-0-2 - Evaluating - m().items[0].value = 'Beta'",
		'0-0-7 - Evaluating - v().value',
		'0-0-9 - Evaluating - v().value'
	]);
});
