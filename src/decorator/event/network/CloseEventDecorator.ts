import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class CloseEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "close";
	}

}

export default CloseEventDecorator;
