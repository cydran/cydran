import AbstractEventDecorator from "../AbstractEventDecorator";

class FormChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "formchange";
	}

}

export default FormChangeEventDecorator;
