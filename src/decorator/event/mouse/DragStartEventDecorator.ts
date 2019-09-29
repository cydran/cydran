import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DragStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragstart";
	}

}

export default DragStartEventDecorator;
