import { Component } from "@cydran/cydran";
import TEMPLATE from "./IdBehaviorSpecimen.html";

/**
 * Specimen: `c-id` registers an element under a name (here "myField") so it can be
 * reached programmatically via `$c().forElement(name)`. Note that `c-id` does NOT set
 * the DOM `id` attribute — it is a named-element registration for `ElementOperations`.
 */
class IdBehaviorSpecimen extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public focusField(): void {
		this.$c().forElement("myField").focus();
	}

	public blurField(): void {
		this.$c().forElement("myField").blur();
	}

}

export default IdBehaviorSpecimen;
