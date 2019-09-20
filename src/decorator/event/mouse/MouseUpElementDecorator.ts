import {Decorator} from "../../../Core";

class MouseUpElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mouseup");
		this.listenTo("dom", "mouseup", this.handleMouseUp);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseUp(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseUpElementDecorator;
