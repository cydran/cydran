import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";

class Enabled extends ElementMediator<boolean, HTMLInputElement, any> {

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
		this.getEl().disabled = !current;
	}

}

Factories.register("enabled", ["*"], Enabled);

export default Enabled;
