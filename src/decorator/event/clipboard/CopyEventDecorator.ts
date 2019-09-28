import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class CopyEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "copy";
	}

}

export default CopyEventDecorator;
