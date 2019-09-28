import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class DblClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dblclick";
	}

}

export default DblClickEventDecorator;
