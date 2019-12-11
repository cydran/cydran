import { ElementMediator } from "../Core";

/**
 *
 */
class MultiSelectValueModel extends ElementMediator<string | string[], HTMLSelectElement> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		this.listenTo("dom", "input", this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		if (this.getEl().multiple) {
			const selectedValues: Array<string|number> = [];

			for (let i = 0; i < this.getEl().selectedOptions.length; i++) {
				const optValue: string = this.getEl().selectedOptions.item(i).getAttribute("value");
				selectedValues.push(optValue);
			}

			this.getModelMediator().set(selectedValues);
		} else {
			this.getModelMediator().set(this.getEl()["value"]);
		}

		this.notifyModelInteraction();
	}

	protected onTargetChange(previous: string | string[], current: string | string[]): void {
		if (this.getEl().multiple) {
			current = (current === null) ? [] : current;

			for (let i = 0; i < this.getEl().options.length; i++) {
				const element: HTMLOptionElement = this.getEl().options.item(i);
				element.selected = current.includes(element.value);
			}
		} else {
			this.getEl().value = current as string;
		}
	}

}

export default MultiSelectValueModel;
