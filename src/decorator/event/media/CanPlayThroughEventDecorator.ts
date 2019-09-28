import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class CanPlayThroughEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "canplaythrough";
	}

}

export default CanPlayThroughEventDecorator;
