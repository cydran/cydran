import {Decorator} from "../Core";

/**
 *
 */
class InputValueModel extends Decorator<string, HTMLInputElement> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		const isRadio: boolean = this.getEl().type.toLowerCase() === "radio";
		this.listenTo("dom", "input", (isRadio ? this.handleRadioInput : this.handleInput));
		this.getMediator().watch(this, (isRadio ? this.onRadioTargetChange : this.onTargetChange));
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.getMediator().set(this.getEl().value);
		this.notifyModelInteraction();
	}

	public handleRadioInput(event: Event): void {
		if (this.getEl().checked) {
			this.getMediator().set(this.getEl().value);
			this.notifyModelInteraction();
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
