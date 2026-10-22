import { Component } from "@cydran/cydran";
import TEMPLATE from "./InertBehaviorSpecimen.html";

/**
 * Specimen: `c-inert` sets the element's `inert` property from a boolean expression.
 */
class InertBehaviorSpecimen extends Component {

	private inert: boolean;

	constructor() {
		super(TEMPLATE);
		this.inert = false;
	}

	public toggle(): void {
		this.inert = !this.inert;
	}

}

export default InertBehaviorSpecimen;
