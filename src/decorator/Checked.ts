import { Decorator } from "../Core";

/**
 *
 */
class Checked extends Decorator<boolean, HTMLInputElement> {

	public static readonly KEY: string = "checked";

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = !current;
	}
}

export default Checked;
