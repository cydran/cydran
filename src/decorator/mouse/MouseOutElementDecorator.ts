import {Decorator} from "../../Core";

class MouseOutElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mouseout");
		this.listenTo("dom", "mouseout", this.handleMouseOut);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseOut(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseOutElementDecorator;
