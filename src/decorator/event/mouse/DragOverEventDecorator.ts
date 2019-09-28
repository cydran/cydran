import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragOverEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragover";
	}

}

export default DragOverEventDecorator;
