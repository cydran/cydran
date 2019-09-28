import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ReadyStateChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "readystatechange";
	}

}

export default ReadyStateChangeEventDecorator;
