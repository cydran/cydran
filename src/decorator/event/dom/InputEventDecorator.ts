import AbstractEventDecorator from "../AbstractEventDecorator";

class InputEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "input";
	}

}

export default InputEventDecorator;
