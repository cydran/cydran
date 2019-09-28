import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class EndedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "ended";
	}

}

export default EndedEventDecorator;
