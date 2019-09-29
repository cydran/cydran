import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DurationChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "durationchange";
	}

}

export default DurationChangeEventDecorator;
