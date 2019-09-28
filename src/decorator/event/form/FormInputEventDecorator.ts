import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FormInputEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "forminput";
	}

}

export default FormInputEventDecorator;
