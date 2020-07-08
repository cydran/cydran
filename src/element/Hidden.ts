import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";
import Validators from "@/validation/Validators";

/**
 *
 */
class Hidden extends ElementMediator<boolean, HTMLElement, any> {

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

Factories.register("hidden", ["*"], Hidden);

export default Hidden;
