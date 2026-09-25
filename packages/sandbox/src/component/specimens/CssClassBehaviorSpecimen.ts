import { Component } from "@cydran/cydran";
import TEMPLATE from "./CssClassBehaviorSpecimen.html";

/**
 * Specimen: `c-class` toggles CSS classes from an object map while preserving
 * classes not named in the map (here `tag` and `base-class`).
 */
class CssClassBehaviorSpecimen extends Component {

	private active: boolean;

	private danger: boolean;

	constructor() {
		super(TEMPLATE);
		this.active = false;
		this.danger = false;
	}

	public toggleActive(): void {
		this.active = !this.active;
	}

	public toggleDanger(): void {
		this.danger = !this.danger;
	}

}

export default CssClassBehaviorSpecimen;
