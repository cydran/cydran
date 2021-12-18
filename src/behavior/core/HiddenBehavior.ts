import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class Hidden extends AbstractValueBehavior<boolean, HTMLElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

}

BehaviorsRegistry.register("hidden", ["*"], Hidden);

export default Hidden;