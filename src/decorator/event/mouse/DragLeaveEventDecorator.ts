import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DragLeaveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragleave";
	}

}

export default DragLeaveEventDecorator;
