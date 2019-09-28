import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FocusOutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focusout";
	}

}

export default FocusOutEventDecorator;
