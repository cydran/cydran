import { Component } from "@cydran/cydran";
import TEMPLATE from "./RequiredBehaviorSpecimen.html";

/**
 * Specimen: `c-required` sets the element's `required` property from a boolean expression.
 */
class RequiredBehaviorSpecimen extends Component {

	private required: boolean;

	constructor() {
		super(TEMPLATE);
		this.required = false;
	}

	public toggle(): void {
		this.required = !this.required;
	}

}

export default RequiredBehaviorSpecimen;
