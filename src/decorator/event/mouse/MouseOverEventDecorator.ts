import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class MouseOverEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseOverEventDecorator;
