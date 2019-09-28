import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class OpenEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "open";
	}

}

export default OpenEventDecorator;
