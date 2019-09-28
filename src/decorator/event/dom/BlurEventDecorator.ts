import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class BlurEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "blur";
	}

}

export default BlurEventDecorator;
