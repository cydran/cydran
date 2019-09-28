import AbstractEventDecorator from "../AbstractEventDecorator";

class WaitingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "waiting";
	}

}

export default WaitingEventDecorator;
