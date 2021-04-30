import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import Validators from "validator/Validators";

class Style extends AbstractElementMediator<any, HTMLElement, any> {
	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		if (current === null) {
			return;
		}

		for (const key in current) {
			if (!current.hasOwnProperty(key)) {
				continue;
			}

			this.getEl().style[key] = current[key] + "";
		}
	}

	protected validate(
		element: HTMLElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

Factories.register("style", ["*"], Style);

export default Style;
