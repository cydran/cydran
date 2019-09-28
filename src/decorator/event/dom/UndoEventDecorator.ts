import AbstractEventDecorator from "../AbstractEventDecorator";

class UndoEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "undo";
	}

}

export default UndoEventDecorator;
