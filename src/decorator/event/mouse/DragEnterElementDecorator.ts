import {Decorator} from "../../../Core";

class DragEnterElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dragenter");
		this.listenTo("dom", "dragenter", this.handleDragEnter);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDragEnter(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragEnterElementDecorator;
