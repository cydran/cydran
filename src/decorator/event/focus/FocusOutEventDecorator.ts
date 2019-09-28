import AbstractEventDecorator from "../AbstractEventDecorator";

class FocusOutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focusout";
	}

}

export default FocusOutEventDecorator;
