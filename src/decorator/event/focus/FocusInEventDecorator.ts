import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FocusInEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focusin";
	}

}

export default FocusInEventDecorator;
