import { asBoolean } from "util/AsFunctions";
import ElementReference from "component/ElementReference";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import BehaviorFlags from "behavior/BehaviorFlags";

class IfBehavior extends AbstractValueBehavior<boolean, HTMLElement, any> {

	private reference: ElementReference<HTMLElement>;

	constructor() {
		super();
		this.setReducerFn(asBoolean);
		this.setFlag(BehaviorFlags.ROOT_PROHIBITED);
	}

	public onMount() {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");
		super.onMount();
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

}

export default IfBehavior;
