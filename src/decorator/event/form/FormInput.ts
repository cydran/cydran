import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FormInput extends AbstractEvent {

	protected getEventKey(): string {
		return "forminput";
	}

}

export default FormInput;
