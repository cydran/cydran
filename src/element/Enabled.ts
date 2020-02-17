import ElementMediator from "@/element/ElementMediator";
import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";

class Enabled extends ElementMediator<boolean, HTMLInputElement, any> {

	public static readonly KEY: string = "enabled";

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

ElementMediatorFactories.register(Enabled.KEY, ["*"], Enabled);

export default Enabled;
