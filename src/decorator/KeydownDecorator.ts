import {Decorator} from "../Core";

class KeydownElementDecorator extends Decorator<Function> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		document.addEventListener("keydown", this.listener, false);
	}

	public unwire(): void {
		document.removeEventListener("keydown", this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default KeydownElementDecorator;
