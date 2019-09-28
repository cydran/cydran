import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class KeyDownEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keydown";
	}

}

export default KeyDownEventDecorator;
