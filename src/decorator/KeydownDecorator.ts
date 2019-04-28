import {Decorator} from "../Core";

class KeydownElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("keydown");
		this.listenTo("dom", "keydown", this.handleKeydown);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleKeydown(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default KeydownElementDecorator;
