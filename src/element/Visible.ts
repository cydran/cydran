import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";

/**
 *
 */
class Visible extends ElementMediator<boolean, HTMLElement, any> {

	public static readonly KEY: string = "visible";

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

Factories.register(Visible.KEY, ["*"], Visible);

export default Visible;
