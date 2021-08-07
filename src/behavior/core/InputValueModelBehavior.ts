import { INPUT_KEY, DOM_KEY } from "Constants";
import Factories from "internals/Factories";
import AbstractSingleBehavior from "behavior/AbstractSingleBehavior";
import { asString } from "util/AsFunctions";

class InputValueModel extends AbstractSingleBehavior<string, HTMLInputElement, any> {

	private isRadio: boolean;

	constructor() {
		super(asString);
		this.isRadio = false;
	}

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.isRadio = this.getEl().type.toLowerCase() === "radio";
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.isRadio ? this.handleRadioInput : this.handleInput);
	}

	public onMount(): void {
		this.getMediator().watch(this, (this.isRadio ? this.onRadioTargetChange : this.onTargetChange));
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getMediator().set(this.getEl().value);
		}, []);
	}

	public handleRadioInput(event: Event): void {
		if (this.getEl().checked) {
			this.$apply(() => {
				this.getMediator().set(this.getEl().value);
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