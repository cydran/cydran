import {Decorator} from "../../../Core";

class ChangeDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("change");
		this.listenTo("dom", "change", this.handleChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleChange(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ChangeDecorator;
