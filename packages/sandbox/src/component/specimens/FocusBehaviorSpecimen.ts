import { Component } from "@cydran/cydran";
import TEMPLATE from "./FocusBehaviorSpecimen.html";

/**
 * Specimen: `c-focus` focuses its element while `focused` is truthy, and re-focuses it on
 * `focusout` (focus trap). Setting `focused` false releases the trap.
 */
class FocusBehaviorSpecimen extends Component {

	private focused: boolean;

	constructor() {
		super(TEMPLATE);
		this.focused = false;
	}

	public toggle(): void {
		this.focused = !this.focused;
	}

}

export default FocusBehaviorSpecimen;
