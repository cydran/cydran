import {Decorator} from "../../Core";

class DragEndElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dragend");
		this.listenTo("dom", "dragend", this.handleDragEnd);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDragEnd(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragEndElementDecorator;
