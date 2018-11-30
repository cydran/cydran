import {Decorator} from "../Core";

class DisableableModelElementDecorator extends Decorator<boolean> {

	public wire(): void {
		const value = this.getTarget();
		this.onTargetChange(null, value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()['disabled'] = !current;
	}

}

export default DisableableModelElementDecorator;