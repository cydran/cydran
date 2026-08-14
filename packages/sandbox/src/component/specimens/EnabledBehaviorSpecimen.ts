import { Component } from "@cydran/cydran";
import TEMPLATE from "./EnabledBehaviorSpecimen.html";

/**
 * Specimen: `c-enabled` sets `el.disabled = !value` from a boolean expression,
 * applied here to both an input and a button.
 */
class EnabledBehaviorSpecimen extends Component {

	private enabled: boolean;

	constructor() {
		super(TEMPLATE);
		this.enabled = true;
	}

	public toggle(): void {
		this.enabled = !this.enabled;
	}

}

export default EnabledBehaviorSpecimen;
