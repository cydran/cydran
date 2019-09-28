import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseOverEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseOverEventDecorator;
