import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class RedoEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "redo";
	}

}

export default RedoEventDecorator;
