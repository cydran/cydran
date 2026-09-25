import { Component } from "@cydran/cydran";
import TEMPLATE from "./ValidatedBehaviorSpecimen.html";

/**
 * Specimen: `c-validated` (`ValidatedBehavior`). Its `onMount()` is currently a TODO stub, so
 * the behavior is a no-op — it mounts without error and does not affect the element. This
 * specimen + test document that current reality; update both when validation is implemented.
 */
class ValidatedBehaviorSpecimen extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "editable";
	}

}

export default ValidatedBehaviorSpecimen;
