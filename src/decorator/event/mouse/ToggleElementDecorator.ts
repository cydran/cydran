import {Decorator} from "../../../Core";

class ToggleElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("toggle");
		this.listenTo("dom", "toggle", this.handleTogle);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleTogle(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ToggleElementDecorator;
