import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class Enabled extends AbstractValueBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().disabled = !current;
	}

}

BehaviorsRegistry.register("enabled", ["*"], Enabled);

export default Enabled;
