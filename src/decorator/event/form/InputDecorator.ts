import {Decorator} from "../../../Core";

class InputDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("input");
		this.listenTo("dom", "input", this.handleInput);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default InputDecorator;
