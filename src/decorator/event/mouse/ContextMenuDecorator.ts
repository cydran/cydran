import {Decorator} from "../../Core";

class ContextMenuDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("contextmenu");
		this.listenTo("dom", "contextmenu", this.handleContextMenuEvent);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleContextMenuEvent(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ContextMenuDecorator;
