import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SubmitEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "submit";
	}

}

export default SubmitEventDecorator;
