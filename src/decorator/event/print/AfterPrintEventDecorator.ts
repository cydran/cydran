import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class AfterPrintEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "afterprint";
	}

}

export default AfterPrintEventDecorator;
