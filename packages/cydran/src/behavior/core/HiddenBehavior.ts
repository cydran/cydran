import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class HiddenBehavior extends AbstractValueBehavior<boolean, HTMLElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

}

export default HiddenBehavior;