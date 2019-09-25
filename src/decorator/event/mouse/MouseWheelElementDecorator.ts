import {Decorator} from "../../../Core";

class MouseWheelElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mousewheel");
		this.listenTo("dom", "mousewheel", this.handleMouseWheel);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseWheel(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseWheelElementDecorator;
