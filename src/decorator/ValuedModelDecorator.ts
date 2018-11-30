import {Decorator} from "../Core";

class ValuedModelElementDecorator extends Decorator<Function> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		this.getEl().addEventListener('input', this.listener, false);
		const value = this.getTarget();
		this.getEl()['value'] = value;
	}

	public unwire(): void {
		this.getEl().removeEventListener('input', this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.setTarget(event.target['value']);
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()['value'] = current;
	}

}

export default ValuedModelElementDecorator;