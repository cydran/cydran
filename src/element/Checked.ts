import ElementMediator from "@/mediator/ElementMediator";

/**
 *
 */
class Checked extends ElementMediator<boolean, HTMLInputElement, any> {

	public static readonly KEY: string = "checked";

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = !current;
	}
}

export default Checked;
