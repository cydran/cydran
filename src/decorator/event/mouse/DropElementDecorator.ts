import {Decorator} from "../../Core";

class DropElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("drop");
		this.listenTo("dom", "drop", this.handleDrop);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDrop(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DropElementDecorator;
