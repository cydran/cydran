import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class SelectEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "select";
	}

}

export default SelectEventDecorator;
