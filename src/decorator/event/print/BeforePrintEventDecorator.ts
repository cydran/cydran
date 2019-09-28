import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class BeforePrintEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "beforeprint";
	}

}

export default BeforePrintEventDecorator;
