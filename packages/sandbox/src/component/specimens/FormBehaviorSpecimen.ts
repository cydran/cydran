import { Component } from "@cydran/cydran";
import TEMPLATE from "./FormBehaviorSpecimen.html";

/**
 * Specimen: `FormBehavior` (auto-attached to `<form>`) broadcasts on reset so `c-model`
 * and `c-checked` controls revert to their defaults and update the model. The form is
 * named via `c-id="userForm"`, enabling `$c().forForm("userForm")` submit/reset.
 */
class FormBehaviorSpecimen extends Component {

	private name: string;

	private agree: boolean;

	private submitted: boolean;

	constructor() {
		super(TEMPLATE);
		this.name = "default name";
		this.agree = false;
		this.submitted = false;
	}

	public onSubmit(event: Event): void {
		// Prevent navigation so the submit is observable in-page.
		event.preventDefault();
		this.submitted = true;
	}

	public resetForm(): void {
		this.$c().forForm("userForm").reset();
	}

	public requestSubmitForm(): void {
		this.$c().forForm("userForm").requestSubmit();
	}

}

export default FormBehaviorSpecimen;
