import { Decorator } from "../Core";

/**
 *
 */
class CheckBox extends Decorator<boolean> {

	public static readonly KEY: string = "checked";

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()[CheckBox.KEY] = !current;
	}
}

export default CheckBox;
