import {Decorator} from "../Core";

class ForceFocusElementDecorator extends Decorator<boolean> {

	private shouldFocus: boolean;

	public wire(): void {
		this.consume("focusout");
		this.listenTo("dom", "focusout", this.handleFocusout);
		this.shouldFocus = this.getMediator().get();
		this.getMediator().watch(this, this.onTargetChange);

		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleFocusout(event: Event): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(previous: any, current: any): void {
		this.shouldFocus = current;
	}

}

export default ForceFocusElementDecorator;