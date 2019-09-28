import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class CutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "cut";
	}

}

export default CutEventDecorator;
