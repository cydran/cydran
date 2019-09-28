import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class HashChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "hashchange";
	}

}

export default HashChangeEventDecorator;
