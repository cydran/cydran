import AbstractElementMediator from "mediator/AbstractElementMediator";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Validators from "validator/Validators";

class InputValueModel extends AbstractElementMediator<string, HTMLInputElement, any> {
	public wire(): void {
		this.bridge(INPUT_KEY);
		const isRadio: boolean = this.getEl().type.toLowerCase() === "radio";
		this.on(INPUT_KEY)
			.forChannel(DOM_KEY)
			.invoke(isRadio ? this.handleRadioInput : this.handleInput);
		this.getModelMediator().watch(
			this,
			isRadio ? this.onRadioTargetChange : this.onTargetChange
		);
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

	protected validate(
		element: HTMLInputElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default InputValueModel;
