import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { expect, test } from '@jest/globals';

test.skip("Behaviors / Model / Form Reset - programatic reset", () => {
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent()).start();

	verifyValueComponents(harness, ["Alpha", "Gamma", "Zeta", "Eta", "bar"]);
	verifyMultiselectComponent(harness, 5, "foo,bar", ["foo", "bar"]);
	verifyRadioComponents(harness, 6, "radio", "foo", true, false, false);
	verifyCheckbox(harness, 7, true);
	verifyCheckbox(harness, 8, false);
	verifyCheckbox(harness, 9, false);

	updateValuedComponents(harness, ["Beta", "Delta", "Theta", "Iota"]);
	harness.forTestId("element4").selectIndex(0);
	harness.forTestId("element5").selectIndexes([1, 2]);
	harness.forTestId("radio-bar").get().click();
	updateCheckbox(harness, 7, false);
	updateCheckbox(harness, 8, true);
	updateCheckbox(harness, 9, false);

	verifyValueComponents(harness, ["Beta", "Delta", "Theta", "Iota", "foo"]);
	verifyMultiselectComponent(harness, 5, "bar,baz", ["bar", "baz"]);
	verifyRadioComponents(harness, 6, "radio", "bar", false, true, false);
	verifyCheckbox(harness, 7, false);
	verifyCheckbox(harness, 8, true);
	verifyCheckbox(harness, 9, false);

	harness.forTestId("reset-form-button").get().click();

	verifyValueComponents(harness, ["", "Epsilon", "", "Kappa", "baz"]);
	verifyMultiselectComponent(harness, 5, "bar,bat", ["bar", "bat"]);
	verifyRadioComponents(harness, 6, "radio", "baz", false, false, true);
	verifyCheckbox(harness, 7, false);
	verifyCheckbox(harness, 8, false);
	verifyCheckbox(harness, 9, true);
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

function updateCheckbox(harness: Harness<TestComponent>, id: number, value: boolean): void {
	harness.forTestId("element" + id).setCheckedState(value);
}

function verifyCheckbox(harness: Harness<TestComponent>, id: number, expected: boolean): void {
	harness.forTestId("display" + id).expect().textContent().toEqual(expected + "");
	expect(harness.getComponent()["getValue" + id]()).toEqual(expected);
	expect(harness.forTestId("element" + id).get().checked).toEqual(expected);
}

function verifyValueComponent(harness: Harness<TestComponent>, id: number, expected: string): void {
	harness.forTestId("display" + id).expect().textContent().toEqual(expected);
	expect(harness.getComponent()["getValue" + id]()).toEqual(expected);
	expect(harness.forTestId("element" + id).get().value).toEqual(expected);
}

function verifyValueComponents(harness: Harness<TestComponent>, values: string[]): void {
	expect(values).not.toBeNull();
	expect(values.length > 0).toBeTruthy();

	// tslint:disable-next-line
	for (let i: number = 0; i < values.length; i++) {
		const expected: string = values[i];
		verifyValueComponent(harness, i, expected);
	}
}

function verifyMultiselectComponent(harness: Harness<TestComponent>, id: number, expectedValue: string, expectedValues: string[]): void {
	harness.forTestId("display" + id).expect().textContent().toEqual(expectedValue);
	expect(harness.getComponent()["getValue" + id]()).toEqual(expectedValues);
	harness.forTestId("element" + id).expect().selectedValues().toEqual(expectedValues);
}

function verifyRadioComponents(harness: Harness<TestComponent>, id: number, prefix: string, expected: string, v0: boolean, v1: boolean, v2: boolean): void {
	harness.forTestId("display" + id).expect().textContent().toEqual(expected);
	expect(harness.getComponent()["getValue" + id]()).toEqual(expected);
	expect(harness.forTestId(prefix + "-foo").get().checked).toEqual(v0);
	expect(harness.forTestId(prefix + "-bar").get().checked).toEqual(v1);
	expect(harness.forTestId(prefix + "-baz").get().checked).toEqual(v2);
}

function updateValuedComponents(harness: Harness<TestComponent>, values: string[]): void {
	expect(values).not.toBeNull();
	expect(values.length > 0).toBeTruthy();

	// tslint:disable-next-line
	for (let i: number = 0; i < values.length; i++) {
		const value: string = values[i];
		harness.forTestId("element" + i).replaceText(value);
	}
}
