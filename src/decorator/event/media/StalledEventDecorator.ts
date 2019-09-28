import AbstractEventDecorator from "../AbstractEventDecorator";

class StalledEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "stalled";
	}

}

export default StalledEventDecorator;
