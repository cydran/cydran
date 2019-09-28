import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DragOverEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragover";
	}

}

export default DragOverEventDecorator;
