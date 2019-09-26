import AbstractEventDecorator from "../AbstractEventDecorator";

class TouchCancelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchcancel";
	}

}

export default TouchCancelEventDecorator;
