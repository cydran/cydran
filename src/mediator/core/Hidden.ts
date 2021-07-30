import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Hidden extends AbstractElementMediator<boolean, HTMLElement, any> {

	constructor() {
		super(asBoolean);
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

}

Factories.register("hidden", ["*"], Hidden);

export default Hidden;