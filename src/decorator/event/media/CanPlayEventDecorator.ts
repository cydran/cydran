import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class CanPlayEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "canplay";
	}

}

export default CanPlayEventDecorator;
