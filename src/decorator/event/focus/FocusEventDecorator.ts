import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FocusEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focus";
	}

}

export default FocusEventDecorator;
