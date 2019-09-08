import {Decorator} from "../../Core";

class DragStartElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dragstart");
		this.listenTo("dom", "dragstart", this.handleDragStart);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDragStart(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragStartElementDecorator;
