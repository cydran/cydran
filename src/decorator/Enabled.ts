import {Decorator} from "../Core";

class Enabled extends Decorator<boolean, HTMLInputElement> {

	public static readonly KEY: string = "enabled";

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().disabled = !current;
	}

}

export default Enabled;
