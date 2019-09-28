import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class OnlineEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "online";
	}

}

export default OnlineEventDecorator;
