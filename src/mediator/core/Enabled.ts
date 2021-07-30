import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Enabled extends AbstractElementMediator<boolean, HTMLInputElement, any> {

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
		this.getEl().disabled = !current;
	}

}

Factories.register("enabled", ["*"], Enabled);

export default Enabled;
