import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseMoveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseMoveEventDecorator;
