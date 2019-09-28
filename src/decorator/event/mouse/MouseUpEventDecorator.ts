import AbstractEventDecorator from "../AbstractEventDecorator";

class MouseUpEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseup";
	}

}

export default MouseUpEventDecorator;
