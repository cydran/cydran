import { Component } from "@cydran/cydran";
import TEMPLATE from "./ReadOnlyBehaviorSpecimen.html";

/**
 * Specimen: `c-readonly` sets the element's `readOnly` property from a boolean expression.
 * (Field is named `readOnly` because `readonly` is a TypeScript keyword.)
 */
class ReadOnlyBehaviorSpecimen extends Component {

	private readOnly: boolean;

	constructor() {
		super(TEMPLATE);
		this.readOnly = false;
	}

	public toggle(): void {
		this.readOnly = !this.readOnly;
	}

}

export default ReadOnlyBehaviorSpecimen;
