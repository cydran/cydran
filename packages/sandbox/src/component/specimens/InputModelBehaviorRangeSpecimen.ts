import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorRangeSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<input type="range">`.
 *
 * Shares the NUMBER accessor strategy (`el.valueAsNumber`) with `number`, so `value`
 * is a real `number`. Range inputs are driven by dispatched `input` events in the test,
 * as a slider drag would emit.
 */
class InputModelBehaviorRangeSpecimen extends Component {

	private value: number;

	constructor() {
		super(TEMPLATE);
		this.value = 50;
	}

	public stamp(): void {
		this.value = 75;
	}

}

export default InputModelBehaviorRangeSpecimen;
