import AbstractEventDecorator from "../AbstractEventDecorator";

class TouchMoveEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchmove";
	}

}

export default TouchMoveEventDecorator;
