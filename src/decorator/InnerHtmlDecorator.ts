import AbstractElementDecorator from "../AbstractDecorator";

class InnerHtmlElementDecorator extends AbstractElementDecorator<string> {

	public wire():void {
		this.getEl().innerHTML = this.getTarget();
	}

	public unwire():void {
		// Intentionally do nothing
	}

	protected onTargetChange(value:any):void {
		// TODO - Handle html entities

		this.getEl().innerHTML = value;
	}

}

export default InnerHtmlElementDecorator;