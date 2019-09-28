import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class AbortEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "abort";
	}

}

export default AbortEventDecorator;
