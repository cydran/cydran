import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SeekedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "seeked";
	}

}

export default SeekedEventDecorator;
