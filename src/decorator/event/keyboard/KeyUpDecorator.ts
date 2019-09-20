import {Decorator} from "../../Core";

class KeyUpElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("keyup");
		this.listenTo("dom", "keyup", this.handleKeyUp);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleKeyUp(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default KeyUpElementDecorator;
