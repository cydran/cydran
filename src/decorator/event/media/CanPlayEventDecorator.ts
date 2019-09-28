import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class CanPlayEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "canplay";
	}

}

export default CanPlayEventDecorator;
