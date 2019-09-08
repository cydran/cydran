import {Decorator} from "../../Core";

class DragElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("drag");
		this.listenTo("dom", "drag", this.handleDrag);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDrag(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragElementDecorator;
