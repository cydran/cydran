import { asBoolean } from "util/AsFunctions";
import ElementReference from "component/ElementReference";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class If extends AbstractValueBehavior<boolean, HTMLElement, any> {

	private reference: ElementReference<HTMLElement>;

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	public onMount() {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getDom(), this.getEl(), "Hidden");
		super.onMount();
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

}

BehaviorsRegistry.register("if", ["*"], If);

export default If;
