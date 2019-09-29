import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class EndedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "ended";
	}

}

export default EndedEventDecorator;
