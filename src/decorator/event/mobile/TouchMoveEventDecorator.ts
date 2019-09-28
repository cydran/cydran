import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class TouchMoveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchmove";
	}

}

export default TouchMoveEventDecorator;
