import Factories from "@/mvvm/Factories";
import ElementMediator from "@/element/ElementMediator";
import { asBoolean } from "@/model/Reducers";
import Validators from "@/validation/Validators";

/**
 *
 */
class Checked extends ElementMediator<boolean, HTMLInputElement, any> {

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
		this.getEl().checked = !current;
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}
}

Factories.register("checked", ["input"], Checked);

export default Checked;
