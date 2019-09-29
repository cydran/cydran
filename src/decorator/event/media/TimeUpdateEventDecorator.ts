import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class TimeUpdateEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "timeupdate";
	}

}

export default TimeUpdateEventDecorator;
