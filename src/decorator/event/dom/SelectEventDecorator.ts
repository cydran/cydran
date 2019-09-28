import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SelectEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "select";
	}

}

export default SelectEventDecorator;
