import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ResetEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "reset";
	}

}

export default ResetEventDecorator;
