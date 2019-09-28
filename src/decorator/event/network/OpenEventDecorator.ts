import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class OpenEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "open";
	}

}

export default OpenEventDecorator;
