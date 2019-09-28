import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class StalledEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "stalled";
	}

}

export default StalledEventDecorator;
