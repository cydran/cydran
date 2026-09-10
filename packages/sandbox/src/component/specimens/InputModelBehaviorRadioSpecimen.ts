import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorRadioSpecimen.html";

/**
 * Specimen: two-way `c-model` on a radio group (`RadioModelBehavior`). Every radio shares
 * `c-model="m().size"`; checking one sets the model to its value, and setting the model
 * checks the radio whose value matches.
 */
class InputModelBehaviorRadioSpecimen extends Component {

	private size: string;

	constructor() {
		super(TEMPLATE);
		this.size = "medium";
	}

	public pickLarge(): void {
		this.size = "large";
	}

}

export default InputModelBehaviorRadioSpecimen;
