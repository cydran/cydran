import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class InertBehavior extends AbstractValueBehavior<boolean, HTMLInputElement, unknown> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		// Keyed access to field due to newness of inert in HTMLElement spec such that it hasn't made into TypeScript yet
		this.getEl()["inert"] = current;
	}

}

export default InertBehavior;
