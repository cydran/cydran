import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class OfflineEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "offline";
	}

}

export default OfflineEventDecorator;
