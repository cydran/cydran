import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseDownEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mousedown";
	}

}

export default MouseDownEventDecorator;
