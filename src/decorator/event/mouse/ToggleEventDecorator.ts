import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ToggleEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "toggle";
	}

}

export default ToggleEventDecorator;
