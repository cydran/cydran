import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ReadyStateChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "readystatechange";
	}

}

export default ReadyStateChangeEventDecorator;
