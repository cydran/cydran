import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class AfterPrintEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "afterprint";
	}

}

export default AfterPrintEventDecorator;
