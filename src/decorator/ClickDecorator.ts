import {Decorator} from "../Core";

class ClickElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("click");
		this.listenTo("dom", "click", this.handleClick);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleClick(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ClickElementDecorator;
