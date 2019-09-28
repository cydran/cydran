import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class UndoEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "undo";
	}

}

export default UndoEventDecorator;
