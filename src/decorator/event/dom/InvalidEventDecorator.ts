import AbstractEventDecorator from "../AbstractEventDecorator";

class InvalidEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "invalid";
	}

}

export default InvalidEventDecorator;
