import AbstractEventDecorator from "../AbstractEventDecorator";

class ChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "change";
	}

}

export default ChangeEventDecorator;
