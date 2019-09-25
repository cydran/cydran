import {AbstractEventDecorator} from "../AbstractEventDecorator";

class KeyDownEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("keydown");
		this.listenTo("dom", "keydown", this.handleEvent);
	}

}

export default KeyDownEventDecorator;
