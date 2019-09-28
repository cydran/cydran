import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragEndEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragend";
	}

}

export default DragEndEventDecorator;
