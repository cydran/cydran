import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class MouseDownEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mousedown";
	}

}

export default MouseDownEventDecorator;
