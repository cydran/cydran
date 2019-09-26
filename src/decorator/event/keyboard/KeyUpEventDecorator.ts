import AbstractEventDecorator from "../AbstractEventDecorator";

class KeyUpEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keyup";
	}

}

export default KeyUpEventDecorator;
