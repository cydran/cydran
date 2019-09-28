import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class WaitingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "waiting";
	}

}

export default WaitingEventDecorator;
