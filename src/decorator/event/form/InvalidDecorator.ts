import {Decorator} from "../../../Core";

class InvalidDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("invalid");
		this.listenTo("dom", "invalid", this.handleInvalid);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInvalid(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default InvalidDecorator;
