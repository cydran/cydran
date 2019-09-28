import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class SeekedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "seeked";
	}

}

export default SeekedEventDecorator;
