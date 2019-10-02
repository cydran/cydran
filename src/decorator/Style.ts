import {Decorator} from "../Core";

class Style extends Decorator<string> {

	public static readonly KEY: string = "style";

	public wire(): void {
		const value = this.getMediator().get();
		this.onTargetChange(null, value);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		if (current === null) {
			return;
		}

		for (const key in current) {
			if (!current.hasOwnProperty(key)) {
				continue;
			}

			const value: any = current[key];
			this.getEl().style[key] = value;
		}
	}

}

export default Style;
