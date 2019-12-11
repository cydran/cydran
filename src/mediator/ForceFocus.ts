import { ElementMediator } from "../Core";


class ForceFocus extends ElementMediator<boolean, HTMLElement> {

	public static readonly KEY: string = "force-focus";

	private shouldFocus: boolean;

	public wire(): void {
		this.bridge("focusout");
		this.listenTo("dom", "focusout", this.handleFocusout);
		this.shouldFocus = false;
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleFocusout(event: Event): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.shouldFocus = current;
	}

}

export default ForceFocus;
