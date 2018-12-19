import {Decorator} from "../Core";

class ClickElementDecorator extends Decorator<any> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handleClick(event);
		this.getEl().addEventListener("click", this.listener, false);
	}

	public unwire(): void {
		this.getEl().removeEventListener("click", this.listener);
	}

	public handleClick(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ClickElementDecorator;