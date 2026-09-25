import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorNumberSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<input type="number">`.
 *
 * The NUMBER accessor strategy of `ValuedModelBehavior` binds via `el.valueAsNumber`,
 * so `value` is a real `number`. The `{{m().value + 1}}` mirror proves that: a numeric
 * add yields e.g. `43`, whereas a string add would yield `"421"`.
 */
class InputModelBehaviorNumberSpecimen extends Component {

	private value: number;

	constructor() {
		super(TEMPLATE);
		this.value = 42;
	}

	public stamp(): void {
		this.value = 100;
	}

	public zero(): void {
		this.value = 0;
	}

}

export default InputModelBehaviorNumberSpecimen;
