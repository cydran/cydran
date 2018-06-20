import AbstractElementDecorator from "../AbstractDecorator";

class ValuedModelElementDecorator extends AbstractElementDecorator<Function> {

	public wire():void {
		this.getEl().addEventListener('input', (event) => this.handle(event), false);
		let value = this.getTarget();
		this.getEl()['value'] = value;
	}

	public unwire():void {
		this.getEl().removeEventListener('input', (event) => this.handle(event));
	}

	public handle(event:Event):void {
		this.setTarget(event.target['value']);
	}

	protected onTargetChange(value:any):void {
		this.getEl()['value'] = value;
	}

}

export default ValuedModelElementDecorator;