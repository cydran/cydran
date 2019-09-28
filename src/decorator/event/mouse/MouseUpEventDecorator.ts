import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseUpEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseup";
	}

}

export default MouseUpEventDecorator;
