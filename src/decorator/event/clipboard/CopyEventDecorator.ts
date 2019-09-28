import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class CopyEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "copy";
	}

}

export default CopyEventDecorator;
