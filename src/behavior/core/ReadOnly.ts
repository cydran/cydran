import Factories from "internals/Factories";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class ReadOnly extends AbstractBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super(asBoolean);
	}

	public populate(): void {
		this.onTargetChange(null, this.getMediator().get());
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

}

Factories.register("readonly", ["*"], ReadOnly);

export default ReadOnly;
