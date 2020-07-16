import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";
import ElementReference from "@/element/ElementReference";
import ElementReferenceImpl from "@/element/ElementReferenceImpl";
import Validators from "@/validation/Validators";

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

		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

Factories.register("if", ["*"], If);

export default If;
