import AbstractEventDecorator from "../AbstractEventDecorator";

class OnlineEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "online";
	}

}

export default OnlineEventDecorator;
