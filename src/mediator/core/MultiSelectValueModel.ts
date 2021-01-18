import AbstractElementMediator from "mediator/AbstractElementMediator";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Validators from "validator/Validators";

class MultiSelectValueModel extends AbstractElementMediator<
	string | string[],
	HTMLSelectElement,
	any
	> {

	public wire(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public handleInput(event: Event): void {
		if (this.getEl().multiple) {
			const selectedValues: (string | number)[] = [];

			for (let i = 0; i < this.getEl().selectedOptions.length; i++) {
				const optValue: string = this.getEl()
					.selectedOptions.item(i)
					.getAttribute("value");
				selectedValues.push(optValue);
			}

			this.$apply(() => {
				this.getModelMediator().set(selectedValues);
			}, []);
		} else {
			this.$apply(() => {
				this.getModelMediator().set(this.getEl()["value"]);
			}, []);
		}
	}

	protected onTargetChange(
		previous: string | string[],
		current: string | string[]
	): void {
		if (this.getEl().multiple) {
			current = current === null ? [] : current;

			for (let i = 0; i < this.getEl().options.length; i++) {
				const element: HTMLOptionElement = this.getEl().options.item(i);
				element.selected = current.indexOf(element.value) !== -1;
			}
		} else {
			this.getEl().value = current as string;
		}
	}

	protected validate(
		element: HTMLSelectElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default MultiSelectValueModel;
