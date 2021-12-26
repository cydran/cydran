import { Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const PARENT_TEMPLATE: string = `<div>
	<script type="cydran/region" c:region:name="child"></script>
	<p data-testid="parent">{{m().value}}</p>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<p data-testid="child">{{m().value}}</p>
	<button c:onclick="m().update()">Change Value</button>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(PARENT_TEMPLATE);
		this.value = "Alpha";
	}

}

class ChildComponent extends Component {

	private value: string;

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Beta";
	}

	public update(): void {
		this.value = "Gamma";
	}

}

test("Disconnected Region -> Parent", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.getComponent().setChild("child", new ChildComponent());

	harness.forTestId("parent")
		.expect()
		.textContent()
		.toEqual("Alpha");

	harness.forTestId("child")
		.expect()
		.textContent()
		.toEqual("Beta");

	harness.forText("Change Value")
		.get()
		.click();

	harness.forTestId("parent")
		.expect()
		.textContent()
		.toEqual("Alpha");

	harness.forTestId("child")
		.expect()
		.textContent()
		.toEqual("Gamma");

	expect(segmentDigester.getEvents()).toEqual([
		'0-0-5 - Evaluating - m().value',
		'0-0-5 - Changed - m().value',
		'0-0-5 - Evaluating - m().update()',
		'0-0-2 - Evaluating - m().value',
		'0-0-5 - Evaluating - m().value',
		'0-0-5 - Evaluating - m().update()',
		'0-0-2 - Evaluating - m().value'
	]);
});
