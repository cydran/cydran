import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class ReadOnly extends AbstractElementMediator<boolean, HTMLInputElement, any> {

	constructor() {
		super(asBoolean);
	}

	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

}

Factories.register("readonly", ["*"], ReadOnly);

export default ReadOnly;
