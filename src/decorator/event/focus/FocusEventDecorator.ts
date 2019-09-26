import AbstractEventDecorator from "../AbstractEventDecorator";

class FocusEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focus";
	}

}

export default FocusEventDecorator;
