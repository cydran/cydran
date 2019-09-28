import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragstart";
	}

}

export default DragStartEventDecorator;
