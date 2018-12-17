import {Decorator} from "../Core";

class InnerHtmlElementDecorator extends Decorator<string> {

	public wire(): void {
		this.getEl().innerHTML = this.getMediator().get();
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		// TODO - Handle html entities

		this.getEl().innerHTML = current;
	}

}

export default InnerHtmlElementDecorator;