import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class InvalidEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "invalid";
	}

}

export default InvalidEventDecorator;
