import {Decorator} from "../Core";

class ChangeElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.getEl().addEventListener('change', (event) => this.handle(event), false);
	}

	public unwire(): void {
		this.getEl().removeEventListener('change', (event) => this.handle(event));
	}

	public handle(event: Event): void {
		this.invokeTarget(event);
	}

	protected onTargetChange(value: any): void {
		// Intentionally do nothing
	}

}

export default ChangeElementDecorator;