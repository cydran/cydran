import { ElementMediator } from "@/Core";

/**
 *
 */
class ValuedModel extends ElementMediator<string, HTMLInputElement> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		this.listenTo("dom", "input", this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().value);
		}, [], null);
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

}

export default ValuedModel;
