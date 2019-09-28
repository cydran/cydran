import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class WheelEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "wheel";
	}

}

export default WheelEventDecorator;
