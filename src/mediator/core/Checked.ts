import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Factories from "internals/Factories";

class Checked extends AbstractElementMediator<boolean, HTMLInputElement, any> {

	constructor() {
		super(asBoolean);
	}

	public onMount(): void {
		this.bridge(INPUT_KEY);
		this.getModelMediator().watch(this, this.onTargetChange);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().checked);
		}, []);
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = current;
	}

}

Factories.register("checked", ["input"], Checked);

export default Checked;
