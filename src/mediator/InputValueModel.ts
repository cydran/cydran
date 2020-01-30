import { ElementMediator } from "@/Core";

/**
 *
 */
class InputValueModel extends ElementMediator<string, HTMLInputElement, any> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		const isRadio: boolean = this.getEl().type.toLowerCase() === "radio";
		this.on("input").forChannel("dom").invoke(isRadio ? this.handleRadioInput : this.handleInput);
		this.getModelMediator().watch(this, (isRadio ? this.onRadioTargetChange : this.onTargetChange));
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().value);
		}, [], null);
	}

	public handleRadioInput(event: Event): void {
		if (this.getEl().checked) {
			this.$apply(() => {
				this.getModelMediator().set(this.getEl().value);
			}, [], null);
		}
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

	protected onRadioTargetChange(previous: string, current: string): void {
		if (this.getEl().value === current) {
			this.getEl().checked = true;
		}
	}

}

export default InputValueModel;
