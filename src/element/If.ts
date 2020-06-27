import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";
import ElementReference from "@/element/ElementReference";
import ElementReferenceImpl from "@/element/ElementReferenceImpl";

/**
 *
 */
class If extends ElementMediator<boolean, HTMLElement, any> {

	private reference: ElementReference<HTMLElement>;

	constructor(deps: any) {
		super(deps, false, asBoolean, false);
	}

	public wire(): void {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

}

Factories.register("if", ["*"], If);

export default If;
