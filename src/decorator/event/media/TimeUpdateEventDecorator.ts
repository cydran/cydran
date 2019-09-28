import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class TimeUpdateEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "timeupdate";
	}

}

export default TimeUpdateEventDecorator;
