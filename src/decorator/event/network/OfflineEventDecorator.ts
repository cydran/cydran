import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class OfflineEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "offline";
	}

}

export default OfflineEventDecorator;
