import {Decorator} from "../../../Core";

class DragLeaveElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dragleave");
		this.listenTo("dom", "dragleave", this.handleDragLeave);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDragLeave(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DragLeaveElementDecorator;
