import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import Validators from "@/validation/Validators";

/**
 *
 */
class InputValueModel extends ElementMediator<string, HTMLInputElement, any> {

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
		}, []);
	}

	public handleRadioInput(event: Event): void {
		if (this.getEl().checked) {
			this.$apply(() => {
				this.getModelMediator().set(this.getEl().value);
			}, []);
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

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

Factories.register("model", ["input"], InputValueModel);

export default InputValueModel;
