import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class TouchCancelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchcancel";
	}

}

export default TouchCancelEventDecorator;
