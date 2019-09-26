import AbstractEventDecorator from "../AbstractEventDecorator";

class SuspendEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "suspend";
	}

}

export default SuspendEventDecorator;
