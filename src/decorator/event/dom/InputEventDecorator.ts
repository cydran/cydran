import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class InputEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "input";
	}

}

export default InputEventDecorator;
