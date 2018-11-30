import {Decorator} from "../Core";

class ClickElementDecorator extends Decorator<Function> {

	public wire(): void {
		this.getEl().addEventListener('click', (event) => this.handleClick(event), false);
	}

	public unwire(): void {
		this.getEl().removeEventListener('click', (event) => this.handleClick(event));
	}

	public handleClick(event: Event): void {
		this.invokeTarget(event);
	}

	protected onTargetChange(value: any): void {
		// Intentionally do nothing
	}

	protected isEvaluatable(): boolean {
		return false;
	}

}

export default ClickElementDecorator;