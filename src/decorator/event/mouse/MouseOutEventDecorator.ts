import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class MouseOutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseout";
	}

}

export default MouseOutEventDecorator;
