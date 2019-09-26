import AbstractEventDecorator from "../AbstractEventDecorator";

class AbortEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "abort";
	}

}

export default AbortEventDecorator;
