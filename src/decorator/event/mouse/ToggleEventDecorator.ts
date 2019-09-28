import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ToggleEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "toggle";
	}

}

export default ToggleEventDecorator;
