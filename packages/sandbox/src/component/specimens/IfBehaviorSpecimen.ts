import { Component } from "@cydran/cydran";
import TEMPLATE from "./IfBehaviorSpecimen.html";

/**
 * Specimen: `c-if` conditionally attaches/detaches an element from the DOM.
 * When the expression is falsy the element is removed (replaced by a comment
 * placeholder); when truthy it is re-inserted.
 */
class IfBehaviorSpecimen extends Component {

	private visible: boolean;

	constructor() {
		super(TEMPLATE);
		this.visible = true;
	}

	public toggle(): void {
		this.visible = !this.visible;
	}

}

export default IfBehaviorSpecimen;
