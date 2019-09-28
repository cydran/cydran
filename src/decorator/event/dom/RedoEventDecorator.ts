import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class RedoEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "redo";
	}

}

export default RedoEventDecorator;
