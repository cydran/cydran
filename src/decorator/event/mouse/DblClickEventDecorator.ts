import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class DblClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "dblclick";
	}

}

export default DblClickEventDecorator;
