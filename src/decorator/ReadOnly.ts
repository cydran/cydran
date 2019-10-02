import {Decorator} from "../Core";

class ReadOnly extends Decorator<boolean> {

	public static readonly KEY: string = "readonly";

	public wire(): void {
		const value = this.getMediator().get();
		this.onTargetChange(null, value);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()["readOnly"] = current;
	}

}

export default ReadOnly;
