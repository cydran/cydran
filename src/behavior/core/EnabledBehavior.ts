import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";

class Enabled extends AbstractBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getMediator().get());
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().disabled = !current;
	}

}

BehaviorsRegistry.register("enabled", ["*"], Enabled);

export default Enabled;
