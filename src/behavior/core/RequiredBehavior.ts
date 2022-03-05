import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class Required extends AbstractValueBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().required = current;
	}

}

BehaviorsRegistry.register("required", ["input", "select", "textarea"], Required);

export default Required;
