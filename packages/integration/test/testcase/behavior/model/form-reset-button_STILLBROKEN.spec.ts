import { Component } from "@cydran/cydran";
import { describe, test } from '@jest/globals';
import TestingFacade from "./TestingFacade";

describe("Form Reset Button", () => {

	test("Behaviors / Model / Form Reset - programatic reset", () => {
		const facade: TestingFacade<TestComponent> = new TestingFacade<TestComponent>(() => new TestComponent());

		facade.verifyValueComponent(0, "Alpha");
		facade.verifyValueComponent(1, "Gamma");
		facade.verifyValueComponent(2, "Zeta");
		facade.verifyValueComponent(3, "Eta");
		facade.verifyValueComponent(4, "bar");

		facade.verifyMultiselectComponent(5, "foo,bar", ["foo", "bar"]);

		facade.verifyRadioComponent(6, "foo", "foo", false);
		facade.verifyRadioComponent(6, "bar", "foo", false);
		facade.verifyRadioComponent(6, "baz", "foo", true);

		facade.verifyCheckbox(7, true);
		facade.verifyCheckbox(8, false);
		facade.verifyCheckbox(9, false);

		facade.updateValuedComponent(0, "Beta");
		facade.updateValuedComponent(1, "Delta");
		facade.updateValuedComponent(2, "Theta");
		facade.updateValuedComponent(3, "Iota");
		facade.forTestId("element4").selectIndex(0);
		facade.forTestId("element5").selectIndexes([1, 2]);
		facade.forTestId("radio-bar").get().click();
		facade.updateCheckbox(7, false);
		facade.updateCheckbox(8, true);
		facade.updateCheckbox(9, false);

		facade.verifyValueComponent(0, "Beta");
		facade.verifyValueComponent(1, "Delta");
		facade.verifyValueComponent(2, "Theta");
		facade.verifyValueComponent(3, "Iota");
		facade.verifyValueComponent(4, "foo");

		facade.verifyMultiselectComponent(5, "bar,baz", ["bar", "baz"]);

		facade.verifyRadioComponent(6, "foo", "foo", false);
		facade.verifyRadioComponent(6, "bar", "foo", true);
		facade.verifyRadioComponent(6, "baz", "foo", false);

		facade.verifyCheckbox(7, false);
		facade.verifyCheckbox(8, true);
		facade.verifyCheckbox(9, false);

		facade.forTestId("reset-form-button").get().click();

		facade.verifyValueComponent(0, "");
		facade.verifyValueComponent(1, "Epsilon");
		facade.verifyValueComponent(2, "");
		facade.verifyValueComponent(3, "Kappa");
		facade.verifyValueComponent(4, "baz");

		facade.verifyMultiselectComponent(5, "bar,bat", ["bar", "bat"]);

		facade.verifyRadioComponent(6, "foo", "foo", false);
		facade.verifyRadioComponent(6, "bar", "foo", false);
		facade.verifyRadioComponent(6, "baz", "foo", true);

		facade.verifyCheckbox(7, false);
		facade.verifyCheckbox(8, false);
		facade.verifyCheckbox(9, true);
	});

});

const TEMPLATE: string = `<div>
	<form>

		<section>
			<input type="text" c-model="m().value0" data-testid="element0">
			<p data-testid="display0">{{m().value0}}</p>
		</section>

		<section>
			<input type="text" c-model="m().value1" data-testid="element1" value="Epsilon">
			<p data-testid="display1">{{m().value1}}</p>
		</section>

		<section>
			<textarea c-model="m().value2" data-testid="element2"></textarea>
			<p data-testid="display2">{{m().value2}}</p>
		</section>

		<section>
			<textarea c-model="m().value3" data-testid="element3">Kappa</textarea>
			<p data-testid="display3">{{m().value3}}</p>
		</section>

		<section>
			<select c-model="m().value4" data-testid="element4">
				<option value="foo">Foo</option>
				<option value="bar">Bar</option>
				<option value="baz" selected="selected">Baz</option>
			</select>

			<p data-testid="display4">{{m().value4}}</p>
		</section>

		<section>
			<select c-model="m().value5" data-testid="element5" multiple>
				<option value="foo">Foo</option>
				<option value="bar" selected="selected">Bar</option>
				<option value="baz">Baz</option>
				<option value="bat" selected="selected">Bat</option>
			</select>

			<p data-testid="display5">{{m().value5}}</p>
		</section>

		<section>
			<input type="radio" value="foo" name="value6-name" c-model="m().value6" data-testid="radio-foo">
			<input type="radio" value="bar" name="value6-name" c-model="m().value6" data-testid="radio-bar">
			<input type="radio" value="baz" name="value6-name" c-model="m().value6" data-testid="radio-baz" checked="checked">

			<p data-testid="display6">{{m().value6}}</p>
		</section>

		<section>
			<input type="checkbox" c-checked="m().value7" data-testid="element7">
			<p data-testid="display7">{{m().value7}}</p>
		</section>

		<section>
			<input type="checkbox" c-checked="m().value8" data-testid="element8">
			<p data-testid="display8">{{m().value8}}</p>
		</section>

		<section>
			<input type="checkbox" c-checked="m().value9" data-testid="element9" checked="checked">
			<p data-testid="display9">{{m().value9}}</p>
		</section>

		<button c-onclick="m().resetForm()" data-testid="reset-form-button">Reset Form By Button</button>

	</form>
</div>`;

class TestComponent extends Component {

	private value0: string;

	private value1: string;

	private value2: string;

	private value3: string;

	private value4: string;

	private value5: string[];

	private value6: string;

	private value7: boolean;

	private value8: boolean;

	private value9: boolean;

	constructor() {
		super(TEMPLATE);
		this.value0 = "Alpha";
		this.value1 = "Gamma";
		this.value2 = "Zeta";
		this.value3 = "Eta";
		this.value4 = "bar";
		this.value5 = ["foo", "bar"];
		this.value6 = "foo";
		this.value7 = true;
		this.value8 = false;
		this.value9 = false;
	}

	public resetForm(): void {
		this.$c().forForms().reset();
	}

	public getValue0(): string {
		return this.value0;
	}

	public getValue1(): string {
		return this.value1;
	}

	public getValue2(): string {
		return this.value2;
	}

	public getValue3(): string {
		return this.value3;
	}

	public getValue4(): string {
		return this.value4;
	}

	public getValue5(): string[] {
		return this.value5;
	}

	public getValue6(): string {
		return this.value6;
	}

	public getValue7(): boolean {
		return this.value7;
	}

	public getValue8(): boolean {
		return this.value8;
	}

	public getValue9(): boolean {
		return this.value9;
	}

}
