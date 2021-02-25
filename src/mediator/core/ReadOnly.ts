import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class ReadOnly extends AbstractElementMediator<boolean, HTMLInputElement, any> {
	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

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

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

	protected validate(
		element: HTMLInputElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

Factories.register("readonly", ["*"], ReadOnly);

export default ReadOnly;
