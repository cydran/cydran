import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";

/**
 *
 */
class Visible extends ElementMediator<boolean, HTMLElement, any> {

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
		this.getEl().hidden = !current;
	}

}

Factories.register("visible", ["*"], Visible);

export default Visible;
