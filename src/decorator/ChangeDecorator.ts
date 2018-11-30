import {Decorator} from "../Core";

class ChangeElementDecorator extends Decorator<Function> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		this.getEl().addEventListener('change', this.listener, false);
	}

	public unwire(): void {
		this.getEl().removeEventListener('change', this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.invokeTarget(event);
	}

	protected onTargetChange(previous: any, current: any): void {
		// Intentionally do nothing
	}

	protected isEvaluatable(): boolean {
		return false;
	}

}

export default ChangeElementDecorator;