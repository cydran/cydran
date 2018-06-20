import AbstractElementDecorator from "../AbstractDecorator";

class ForceFocusElementDecorator extends AbstractElementDecorator<boolean> {

	private shouldFocus: boolean;

	public wire(): void {
		document.addEventListener('focusout', (event) => this.handle(event), false);
		this.shouldFocus = this.getTarget();

		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	public unwire(): void {
		document.removeEventListener('focusout', (event) => this.handle(event));
	}

	public handle(event: Event): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(value: any): void {
		this.shouldFocus = value;
	}

}

export default ForceFocusElementDecorator;