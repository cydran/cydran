import { builder, Ids, Stage, Component } from 'cydran';
import Harness from '../../Harness';

const TEMPLATE: string = `<div>
	<p data-testid="the-value">{{m().value}}</p>
	<button c:onclick="m().update()">Change Value</button>
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
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());

	harness.forTestId("the-value")
		.expect()
		.textContext()
		.toEqual("Old");

	harness.forText("Change Value")
		.get()
		.click();

	harness.forTestId("the-value")
		.expect()
		.textContext()
		.toEqual("New");
});
