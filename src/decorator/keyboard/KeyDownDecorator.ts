import {Decorator} from "../../Core";

class KeyDownElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("keydown");
		this.listenTo("dom", "keydown", this.handleKeyDown);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleKeyDown(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default KeyDownElementDecorator;
