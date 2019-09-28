import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ErrorEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "error";
	}

}

export default ErrorEventDecorator;
