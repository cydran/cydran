import {Decorator} from "../Core";

/**
 *
 */
class ForceFocus extends Decorator<boolean> {

	private shouldFocus: boolean;
	public static readonly KEY: string = "force-focus";

	public wire(): void {
		this.bridge("focusout");
		this.listenTo("dom", "focusout", this.handleFocusout);
		this.shouldFocus = false;
		this.getMediator().watch(this, this.onTargetChange);
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

export default ForceFocus;
