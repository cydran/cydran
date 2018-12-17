import {Decorator} from "../Core";

class ForceFocusElementDecorator extends Decorator<boolean> {

	private listener: EventListenerOrEventListenerObject;

	private shouldFocus: boolean;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		document.addEventListener("focusout", this.listener, false);
		this.shouldFocus = this.getMediator().get();
		this.getMediator().watch(this, this.onTargetChange);

		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	public unwire(): void {
		document.removeEventListener("focusout", this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(previous: any, current: any): void {
		this.shouldFocus = current;
	}

}

export default ForceFocusElementDecorator;