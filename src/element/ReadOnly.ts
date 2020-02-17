import ElementMediator from "@/element/ElementMediator";
import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";

class ReadOnly extends ElementMediator<boolean, HTMLInputElement, any> {

	public static readonly KEY: string = "readonly";

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

ElementMediatorFactories.register(ReadOnly.KEY, ["*"], ReadOnly);

export default ReadOnly;
