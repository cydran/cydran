import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class KeyUpEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keyup";
	}

}

export default KeyUpEventDecorator;
