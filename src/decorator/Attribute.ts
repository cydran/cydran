import {Decorator} from "../Core";

/**
 * 
 */
class Attribute extends Decorator<Function> {

	public wire(): void {
		this.onTargetChange(null, this.getMediator().get());
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().setAttribute(current[0], current[1]);
	}

}

export default Attribute;
