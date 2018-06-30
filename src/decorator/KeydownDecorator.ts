import {Decorator} from "../Core";

class KeydownElementDecorator extends Decorator<Function> {

	public wire(): void {
		document.addEventListener('keydown', (event) => this.handle(event), false);
	}

	public unwire(): void {
		document.removeEventListener('keydown', (event) => this.handle(event));
	}

	public handle(event: Event): void {
		this.invokeTarget(event);
	}

	protected onTargetChange(value: any): void {
		// Intentionally do nothing
	}

	public evaluateModel(): void {
		// Prevent method evaluation
	}

}

export default KeydownElementDecorator;