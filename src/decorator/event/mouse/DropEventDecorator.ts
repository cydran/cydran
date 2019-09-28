import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DropEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "drop";
	}

}

export default DropEventDecorator;
