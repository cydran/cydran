import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ErrorEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "error";
	}

}

export default ErrorEventDecorator;
