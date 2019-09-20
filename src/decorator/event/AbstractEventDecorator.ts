import {Decorator} from "../../Core";

export abstract class AbstractEventDecorator<T> extends Decorator<any> {

	public abstract wire(): void;

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleEvent(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}
