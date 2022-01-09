import { builder, Ids, Stage, Component } from 'cydran';
import Harness from '../../Harness';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<p data-testid="the-value">{{m().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "Old";
	}

	public update(): void {
		this.value = "New";
	}

}

test("Test digest update", () => {
	const segmentDigester: LoggingSegmentDigester = new LoggingSegmentDigester();

	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent(), {
		"cydran.internal.factory.segment-digester": () => segmentDigester
	});

	harness.start();

	harness.forTestId("the-value").expect().textContent().toEqual("Old");
	harness.forText("Change Value").get().click();
	harness.forTestId("the-value").expect().textContent().toEqual("New");

	expect(segmentDigester.getEvents()).toEqual([
		"0-0-2 - Evaluating - m().value",
		"0-0-2 - Changed - m().value",
		"0-0-2 - Evaluating - m().value"
	]);
});
