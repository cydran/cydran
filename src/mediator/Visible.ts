import { ElementMediator } from "@/Core";

/**
 *
 */
class Visible extends ElementMediator<boolean, HTMLElement> {

	public static readonly KEY: string = "visible";

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = !current;
	}

}

export default Visible;
