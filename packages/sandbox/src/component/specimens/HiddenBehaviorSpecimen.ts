import { Component } from "@cydran/cydran";
import TEMPLATE from "./HiddenBehaviorSpecimen.html";

/**
 * Specimen: `c-hidden` toggles the element's `hidden` property from a boolean
 * expression. The element remains in the DOM but is visually hidden.
 */
class HiddenBehaviorSpecimen extends Component {

	private hidden: boolean;

	constructor() {
		super(TEMPLATE);
		this.hidden = false;
	}

	public toggle(): void {
		this.hidden = !this.hidden;
	}

}

export default HiddenBehaviorSpecimen;
