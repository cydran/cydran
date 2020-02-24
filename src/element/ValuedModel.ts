import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";

/**
 *
 */
class ValuedModel extends ElementMediator<string, HTMLInputElement, any> {

	public wire(): void {
		this.bridge("input");
		this.on("input").forChannel("dom").invoke(this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().value);
		}, []);
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

}

Factories.register("model", ["textarea"], ValuedModel);

export default ValuedModel;
