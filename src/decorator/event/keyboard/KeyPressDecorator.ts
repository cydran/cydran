import {Decorator} from "../../../Core";

class KeyPressElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("keypress");
		this.listenTo("dom", "keypress", this.handleKeyPress);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleKeyPress(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default KeyPressElementDecorator;
