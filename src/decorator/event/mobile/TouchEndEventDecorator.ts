import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class TouchEndEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchend";
	}

}

export default TouchEndEventDecorator;
