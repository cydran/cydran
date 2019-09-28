import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class CanPlayThroughEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "canplaythrough";
	}

}

export default CanPlayThroughEventDecorator;
