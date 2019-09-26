import AbstractEventDecorator from "../AbstractEventDecorator";

class PauseEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pause";
	}

}

export default PauseEventDecorator;
