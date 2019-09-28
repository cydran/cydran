import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseWheelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mousewheel";
	}

}

export default MouseWheelEventDecorator;
