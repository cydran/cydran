import FormOperations from "component/FormOperations";
import { requireNotNull } from 'util/Utils';

class FormOperationsImpl implements FormOperations {

	private form: HTMLFormElement;

	constructor(form: HTMLFormElement) {
		this.form = requireNotNull(form, "form");
	}

	public submit(): void {
		this.form.submit();
	}

	public requestSubmit(): void {
		this.form.requestSubmit();
	}

	public reset(): void {
		this.form.reset();
	}

}

export default FormOperationsImpl;
