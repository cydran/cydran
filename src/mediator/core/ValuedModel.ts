import AbstractElementMediator from "mediator/AbstractElementMediator";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Validators from "validator/Validators";
import Factories from "internals/Factories";

class ValuedModel extends AbstractElementMediator<string, HTMLInputElement, any> {
	public wire(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
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

	protected validate(
		element: HTMLInputElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

Factories.register("model", ["textarea"], ValuedModel);

export default ValuedModel;
