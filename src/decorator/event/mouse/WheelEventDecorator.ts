import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class WheelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "wheel";
	}

}

export default WheelEventDecorator;
