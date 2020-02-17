import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";

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

Factories.register(Enabled.KEY, ["*"], Enabled);

export default Enabled;
