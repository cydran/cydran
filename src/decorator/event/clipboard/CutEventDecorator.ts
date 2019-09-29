import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class CutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "cut";
	}

}

export default CutEventDecorator;
