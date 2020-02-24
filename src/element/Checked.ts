import Factories from "@/mvvm/Factories";
import ElementMediator from "@/element/ElementMediator";

/**
 *
 */
class Checked extends ElementMediator<boolean, HTMLInputElement, any> {

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = !current;
	}
}

Factories.register("checked", ["input"], Checked);

export default Checked;
