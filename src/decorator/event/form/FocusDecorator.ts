import {Decorator} from "../../../Core";

class FocusDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("focus");
		this.listenTo("dom", "focus", this.handleFocus);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleFocus(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default FocusDecorator;
