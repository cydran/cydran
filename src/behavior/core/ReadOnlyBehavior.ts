import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class ReadOnly extends AbstractValueBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

}

BehaviorsRegistry.register("readonly", ["input", "textarea"], ReadOnly);

export default ReadOnly;
