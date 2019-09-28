import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ResetEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "reset";
	}

}

export default ResetEventDecorator;
