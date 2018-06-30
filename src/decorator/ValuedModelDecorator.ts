import {Decorator} from "../Core";

class ValuedModelElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.getEl().addEventListener('input', (event) => this.handle(event), false);
		let value = this.getTarget();
		this.getEl()['value'] = value;
	}

	public unwire(): void {
		this.getEl().removeEventListener('input', (event) => this.handle(event));
	}

	public handle(event: Event): void {
		console.log(event);
		this.setTarget(event.target['value']);
	}

	protected onTargetChange(value: any): void {
		this.getEl()['value'] = value;
	}

}

export default ValuedModelElementDecorator;