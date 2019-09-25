import {Decorator} from "../../../Core";

class MouseDownElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mousedown");
		this.listenTo("dom", "mousedown", this.handleMouseDown);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseDown(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseDownElementDecorator;
