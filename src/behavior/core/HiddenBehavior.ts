import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Hidden extends AbstractBehavior<boolean, HTMLElement, any> {

	constructor() {
		super(asBoolean);
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getMediator().get());
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

}

BehaviorsRegistry.register("hidden", ["*"], Hidden);

export default Hidden;