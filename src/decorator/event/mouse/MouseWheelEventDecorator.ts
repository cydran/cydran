import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class MouseWheelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mousewheel";
	}

}

export default MouseWheelEventDecorator;
