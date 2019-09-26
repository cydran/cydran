import AbstractEventDecorator from "../AbstractEventDecorator";

class TouchEndEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchend";
	}

}

export default TouchEndEventDecorator;
