import AbstractEventDecorator from "../AbstractEventDecorator";

class FocusInEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "focusin";
	}

}

export default FocusInEventDecorator;
