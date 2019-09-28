import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FormChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "formchange";
	}

}

export default FormChangeEventDecorator;
