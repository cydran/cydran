import { asBoolean } from "util/AsFunctions";
import ElementReference from "component/ElementReference";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractSingleBehavior from "behavior/AbstractSingleBehavior";

class If extends AbstractSingleBehavior<boolean, HTMLElement, any> {

	private reference: ElementReference<HTMLElement>;

	constructor() {
		super(asBoolean);
	}

	public onMount() {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getMediator().get());
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

}

BehaviorsRegistry.register("if", ["*"], If);

export default If;
