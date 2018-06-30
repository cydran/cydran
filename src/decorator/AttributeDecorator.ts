import {Decorator} from "../Core";

class AttributeElementDecorator extends Decorator<Function> {

	public wire(): void {
		let value = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		this.getEl().setAttribute(value[0], value[1]);
	}

}

export default AttributeElementDecorator;