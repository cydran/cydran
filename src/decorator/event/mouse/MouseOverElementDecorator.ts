import {Decorator} from "../../../Core";

class MouseOverElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("mouseover");
		this.listenTo("dom", "mouseover", this.handleMouseOver);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleMouseOver(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default MouseOverElementDecorator;
