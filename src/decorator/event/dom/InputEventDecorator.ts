import {AbstractEventDecorator} from "../AbstractEventDecorator";

class InputEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("input");
		this.listenTo("dom", "input", this.handleEvent);
	}

}

export default InputEventDecorator;
