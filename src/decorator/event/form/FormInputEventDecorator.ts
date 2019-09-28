import AbstractEventDecorator from "../AbstractEventDecorator";

class FormInputEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "forminput";
	}

}

export default FormInputEventDecorator;
