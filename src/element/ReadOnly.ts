import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";

class ReadOnly extends ElementMediator<boolean, HTMLInputElement, any> {

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

}

Factories.register("readonly", ["*"], ReadOnly);

export default ReadOnly;
