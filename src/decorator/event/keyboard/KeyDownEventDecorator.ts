import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class KeyDownEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keydown";
	}

}

export default KeyDownEventDecorator;
