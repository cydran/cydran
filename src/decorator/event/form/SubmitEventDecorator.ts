import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class SubmitEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "submit";
	}

}

export default SubmitEventDecorator;
