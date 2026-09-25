import { Component } from "@cydran/cydran";
import TEMPLATE from "./StyleBehaviorSpecimen.html";

/**
 * Specimen: `c-style` applies an object of camelCase style properties to the
 * element's inline style. Values are plain strings from the model.
 */
class StyleBehaviorSpecimen extends Component {

	private color: string;

	private weight: string;

	constructor() {
		super(TEMPLATE);
		this.color = "rgb(255, 0, 0)";
		this.weight = "normal";
	}

	public toggle(): void {
		this.color = this.color === "rgb(255, 0, 0)" ? "rgb(0, 0, 255)" : "rgb(255, 0, 0)";
		this.weight = this.weight === "normal" ? "bold" : "normal";
	}

}

export default StyleBehaviorSpecimen;
