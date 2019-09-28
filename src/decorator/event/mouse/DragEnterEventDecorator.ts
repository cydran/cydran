import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DragEnterEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragenter";
	}

}

export default DragEnterEventDecorator;
