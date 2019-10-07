import {Decorator} from "../Core";

/**
 *
 */
class Visible extends Decorator<boolean> {

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().hidden = !current;
	}

}

export default Visible;
