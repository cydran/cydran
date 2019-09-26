import AbstractEventDecorator from "../AbstractEventDecorator";

class TouchStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchstart";
	}

}

export default TouchStartEventDecorator;
