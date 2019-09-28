import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SuspendEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "suspend";
	}

}

export default SuspendEventDecorator;
