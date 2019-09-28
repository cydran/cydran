import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "change";
	}

}

export default ChangeEventDecorator;
