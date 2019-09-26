import AbstractEventDecorator from "../AbstractEventDecorator";

class MouseMoveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseMoveEventDecorator;
