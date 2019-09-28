import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragEnterEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragenter";
	}

}

export default DragEnterEventDecorator;
