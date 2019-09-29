import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class BeforePrintEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "beforeprint";
	}

}

export default BeforePrintEventDecorator;
