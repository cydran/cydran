import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class RequiredBehavior extends AbstractValueBehavior<boolean, HTMLInputElement, unknown> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().required = current;
	}

}

export default RequiredBehavior;
