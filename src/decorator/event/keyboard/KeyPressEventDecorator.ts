import {AbstractEventDecorator} from "../AbstractEventDecorator";

class KeyPressEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("keypress");
		this.listenTo("dom", "keypress", this.handleEvent);
	}

}

export default KeyPressEventDecorator;
