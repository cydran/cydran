import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";

class Hidden extends AbstractBehavior<boolean, HTMLElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}

		this.onTargetChange(null, this.getMediator().get());
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

}

BehaviorsRegistry.register("hidden", ["*"], Hidden);

export default Hidden;