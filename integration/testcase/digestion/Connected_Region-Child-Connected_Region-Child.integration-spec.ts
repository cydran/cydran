import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const GRAND_PARENT_TEMPLATE: string = `<div>
	<script type="cydran/region" c-region-name="child" c-region-value="m().values"></script>
	<p data-testid="grand-parent">{{m().values.value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

const PARENT_TEMPLATE: string = `<div>
	<script type="cydran/region" c-region-name="child" c-region-value="v()"></script>
	<p data-testid="parent">{{v().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{v().value}}</p>
</div>`;

interface ValueContainer {

	value: string;

}

class GrandParentComponent extends Component {

	private values: ValueContainer;

	constructor() {
		super(GRAND_PARENT_TEMPLATE);
		this.values = {
			value: "Alpha"
		};
	}

	public update(): void {
		this.values.value = "Beta";
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

}

test("Connected Region -> Child -> Connected Region -> Child", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<GrandParentComponent> = new Harness<GrandParentComponent>(() => new GrandParentComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	const parent: ParentComponent = new ParentComponent();
	const child: ChildComponent = new ChildComponent();

	parent.$c().regions().set("child", child);

	harness.getComponent().$c().regions().set("child", parent);

	harness.forTestId("grand-parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forText("Change Value").get().click();
	harness.forTestId("grand-parent").expect().textContent().toEqual("Beta");
	harness.forTestId("parent").expect().textContent().toEqual("Beta");
	harness.forTestId("child").expect().textContent().toEqual("Beta");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-2 - Evaluating - m().values.value',
		'0-0-2 - Changed - m().values.value',
		'0-0-6 - Evaluating - v().value',
		'0-0-6 - Changed - v().value',
		'0-0-9 - Evaluating - v().value',
		'0-0-9 - Changed - v().value',
		'0-0-2 - Evaluating - m().values.value',
		'0-0-6 - Evaluating - v().value',
		'0-0-9 - Evaluating - v().value'
	]);
});
