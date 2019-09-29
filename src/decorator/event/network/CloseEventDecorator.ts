import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class CloseEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "close";
	}

}

export default CloseEventDecorator;
