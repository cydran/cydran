import {AbstractEventDecorator} from "../AbstractEventDecorator";

class KeyUpEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("keyup");
		this.listenTo("dom", "keyup", this.handleEvent);
	}

}

export default KeyUpEventDecorator;
