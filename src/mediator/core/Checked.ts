import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Validators from "validator/Validators";
import Factories from "internals/Factories";

class Checked extends AbstractElementMediator<boolean, HTMLInputElement, any> {
	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.bridge(INPUT_KEY);
		this.getModelMediator().watch(this, this.onTargetChange);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().checked);
		}, []);
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = current;
	}

	protected validate(
		element: HTMLInputElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

Factories.register("checked", ["input"], Checked);

export default Checked;
