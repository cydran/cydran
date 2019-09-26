import AbstractEventDecorator from "../AbstractEventDecorator";

class DragLeaveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dragleave";
	}

}

export default DragLeaveEventDecorator;
