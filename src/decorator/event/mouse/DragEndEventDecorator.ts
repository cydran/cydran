import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DragEndEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragend";
	}

}

export default DragEndEventDecorator;
