import {Decorator} from "../Core";

class MaxLength extends Decorator<string> {

	public static readonly KEY: string = "maxlength";

	public wire(): void {
		const value = this.getMediator().get();
		this.onTargetChange(null, value);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const value: number = current * 1;
		this.getEl()["maxLength"] = (value > 0) ? value : 0;
	}

}

export default MaxLength;
