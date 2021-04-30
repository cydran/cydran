import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import Validators from "validator/Validators";
import ElementReference from "element/ElementReference";
import ElementReferenceImpl from "element/ElementReferenceImpl";
import Factories from "internals/Factories";

class If extends AbstractSingleElementMediator<boolean, HTMLElement, any> {
	private reference: ElementReference<HTMLElement>;

	constructor() {
		super(asBoolean);
	}

	public onMount() {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");

		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}
}

Factories.register("if", ["*"], If);

export default If;
