import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Enabled extends AbstractElementMediator<boolean, HTMLInputElement, any> {
	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().disabled = !current;
	}

	protected validate(
		element: HTMLInputElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default Enabled;
