import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class BlurEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "blur";
	}

}

export default BlurEventDecorator;
