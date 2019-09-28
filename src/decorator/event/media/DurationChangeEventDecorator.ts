import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DurationChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "durationchange";
	}

}

export default DurationChangeEventDecorator;
