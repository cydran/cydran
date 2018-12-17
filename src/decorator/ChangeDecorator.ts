import {Decorator} from "../Core";

class ChangeElementDecorator extends Decorator<Function> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		this.getEl().addEventListener("change", this.listener, false);
	}

	public unwire(): void {
		this.getEl().removeEventListener("change", this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ChangeElementDecorator;