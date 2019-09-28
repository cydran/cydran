import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "drag";
	}

}

export default DragEventDecorator;
