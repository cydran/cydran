import {Decorator} from "../Core";

class AttributeElementDecorator extends Decorator<Function> {

	public wire(): void {
		const value = this.getTarget();
		this.onTargetChange(null, value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().setAttribute(current[0], current[1]);
	}

}

export default AttributeElementDecorator;