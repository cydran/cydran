import {Decorator} from "../../Core";

class MouseMoveElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mousemove");
		this.listenTo("dom", "mousemove", this.handleMouseMove);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseMove(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseMoveElementDecorator;
