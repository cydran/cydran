import { INPUT_KEY, DOM_KEY } from "Constants";
import Factories from "internals/Factories";
import AbstractSingleElementMediator from "mediator/AbstractSingleElementMediator";
import { asString } from "util/AsFunctions";

class InputValueModel extends AbstractSingleElementMediator<string, HTMLInputElement, any> {

	constructor() {
		super(asString);
	}

	public onMount(): void {
		this.bridge(INPUT_KEY);
		const isRadio: boolean = this.getEl().type.toLowerCase() === "radio";
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(isRadio ? this.handleRadioInput : this.handleInput);
		this.getModelMediator().watch(this, (isRadio ? this.onRadioTargetChange : this.onTargetChange));
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

}

Factories.register("model", ["input"], InputValueModel);

export default InputValueModel;
