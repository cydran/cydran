import AbstractElementDecorator from "../mvvm/AbstractDecorator";

class ClickElementDecorator extends AbstractElementDecorator<Function> {

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

	public evaluateModel(): void {
		// Prevent method evaluation
	}

}

export default ClickElementDecorator;