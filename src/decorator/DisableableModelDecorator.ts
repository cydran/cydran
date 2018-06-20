import AbstractElementDecorator from "../AbstractDecorator";

class DisableableModelElementDecorator extends AbstractElementDecorator<boolean> {

	public wire(): void {
		let value = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		this.getEl()['disabled'] = !value;
	}

}

export default DisableableModelElementDecorator;