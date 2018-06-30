import {Decorator} from "../Core";

class InnerHtmlElementDecorator extends Decorator<string> {

	public wire(): void {
		this.getEl().innerHTML = this.getTarget();
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		// TODO - Handle html entities

		this.getEl().innerHTML = value;
	}

}

export default InnerHtmlElementDecorator;