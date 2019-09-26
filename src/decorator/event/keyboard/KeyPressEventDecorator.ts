import AbstractEventDecorator from "../AbstractEventDecorator";

class KeyPressEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "keypress";
	}

}

export default KeyPressEventDecorator;
