import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<c-region c-region-name="child1" c-region-value="m().values"></c-region>
	<c-region c-region-name="child2"></c-region>
	<p data-testid="parent">{{m().values.value}}</p>
</div>`;

const CHILD_TEMPLATE_1: string = `<div>
	<p data-testid="child1">{{v().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const CHILD_TEMPLATE_2: string = `<div>
	<p data-testid="child2">{{m().value}}</p>
</div>`;

interface ValueContainer {

	value: string;

}

class ParentComponent extends Component {

	private values: ValueContainer;

	constructor() {
		super(PARENT_TEMPLATE);
		this.values = {
			value: "Alpha"
		};
	}

}

class ChildComponent1 extends Component {

	constructor() {
		super(CHILD_TEMPLATE_1);
	}

	public update(): void {
		this.$c().getValue().value = "Beta";
	}

}

class ChildComponent2 extends Component {

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE_2);
		this.value = "Gamma";
	}

}

test.skip("Connected Region -> Parent -> Connected Region -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.getComponent().$c().regions().set("child1", new ChildComponent1());
	harness.getComponent().$c().regions().set("child2", new ChildComponent2());

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child1").expect().textContent().toEqual("Alpha");
	harness.forTestId("child2").expect().textContent().toEqual("Gamma");
	harness.forText("Change Value").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child1").expect().textContent().toEqual("Beta");
	harness.forTestId("child2").expect().textContent().toEqual("Gamma");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-6 - Evaluating - v().value',
		'0-0-6 - Changed - v().value',
		'0-0-2 - Evaluating - m().values.value',
		'0-0-2 - Changed - m().values.value',
		'0-0-6 - Evaluating - v().value',
		'0-0-2 - Evaluating - m().values.value'
	]);
});
