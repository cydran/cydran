import FormOperations from 'component/FormOperations';
import { requireNotNull } from 'util/Utils';

class MultipleFormOperationsImpl implements FormOperations {

	private forms: HTMLFormElement[];

	constructor(forms: HTMLFormElement[]) {
		this.forms = requireNotNull(forms, "forms");
	}

	public submit(): void {
		for (const form of this.forms) {
			form.submit();
		}
	}

	public requestSubmit(): void {
		for (const form of this.forms) {
			form.requestSubmit();
		}
	}

	public reset(): void {
		for (const form of this.forms) {
			form.reset();
		}
	}

}

export default MultipleFormOperationsImpl;
