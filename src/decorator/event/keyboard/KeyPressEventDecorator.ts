import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class KeyPressEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keypress";
	}

}

export default KeyPressEventDecorator;
