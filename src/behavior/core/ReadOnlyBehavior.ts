import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class ReadOnly extends AbstractBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	public onMount(): void {
		this.onTargetChange(null, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

}

BehaviorsRegistry.register("readonly", ["*"], ReadOnly);

export default ReadOnly;
