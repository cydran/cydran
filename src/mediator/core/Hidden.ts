import { AbstractElementMediator } from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Hidden extends AbstractElementMediator<boolean, HTMLElement, any> {
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
		this.getEl().hidden = current;
	}

	protected validate(
		element: HTMLElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default Hidden;