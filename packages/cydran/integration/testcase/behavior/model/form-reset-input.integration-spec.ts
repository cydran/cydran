import { builder, Ids, Stage, Component } from "@cydran/cydran";
import Harness from '../../../Harness';
import { expect } from '@jest/globals';

const TEMPLATE: string = `<div>
	<form>
		<section>
			<input type="text" c-model="m().value0" data-testid="textbox0">
			<p data-testid="display0">{{m().value0}}</p>
		</section>
		<section>
			<input type="text" c-model="m().value1" data-testid="textbox1" value="Epsilon">
			<p data-testid="display1">{{m().value1}}</p>
		</section>
		<input type="reset" data-testid="reset-form-input" value="Reset Form By Input">
	</form>
</div>`;

class TestComponent extends Component {

	private value0: string;

	private value1: string;

	constructor() {
		super(TEMPLATE);
		this.value0 = "Alpha";
		this.value1 = "Gamma";
	}

	public resetForm(): void {
		this.forForms().reset();
	}

	public getValue0(): string {
		return this.value0;
	}

	public getValue1(): string {
		return this.value1;
	}

}

test.skip("Behaviors / Model / Form Reset - element reset", () => {
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent()).start();

	harness.forTestId("display0").expect().textContent().toEqual("Alpha");
	expect(harness.getComponent().getValue0()).toEqual("Alpha");
	expect(harness.forTestId("textbox0").get().value).toEqual("Alpha");

	harness.forTestId("display1").expect().textContent().toEqual("Gamma");
	expect(harness.getComponent().getValue1()).toEqual("Gamma");
	expect(harness.forTestId("textbox1").get().value).toEqual("Gamma");

	harness.forTestId("textbox0").replaceText("Beta");
	harness.forTestId("textbox1").replaceText("Delta");

	harness.forTestId("display0").expect().textContent().toEqual("Beta");
	expect(harness.getComponent().getValue0()).toEqual("Beta");
	expect(harness.forTestId("textbox0").get().value).toEqual("Beta");

	harness.forTestId("display1").expect().textContent().toEqual("Delta");
	expect(harness.getComponent().getValue1()).toEqual("Delta");
	expect(harness.forTestId("textbox1").get().value).toEqual("Delta");

	harness.forTestId("reset-form-input").get().click();

	harness.forTestId("display0").expect().textContent().toEqual("");
	expect(harness.getComponent().getValue0()).toEqual("");
	expect(harness.forTestId("textbox0").get().value).toEqual("");

	harness.forTestId("display1").expect().textContent().toEqual("Epsilon");
	expect(harness.getComponent().getValue1()).toEqual("Epsilon");
	expect(harness.forTestId("textbox1").get().value).toEqual("Epsilon");
});
