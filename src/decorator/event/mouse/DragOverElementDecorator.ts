import {Decorator} from "../../../Core";

class DragOverElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dragover");
		this.listenTo("dom", "dragover", this.handleDragOver);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDragOver(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragOverElementDecorator;
