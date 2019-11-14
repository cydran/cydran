import {Decorator} from "../Core";

/**
 *
 */
class MultiSelectValueModel extends Decorator<Function> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		this.listenTo("dom", "input", this.handleInput);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		const selElem = this.getEl() as HTMLSelectElement;
		if (selElem.multiple) {
			const selectedOptions: HTMLCollection = this.getEl()["selectedOptions"];
			const selectedValues: (string|number)[] = [];
			for (let i = 0; i < selectedOptions.length; i++) {
				const optValue: string = selectedOptions.item(i).getAttribute("value");
				selectedValues.push(optValue);
			}
			this.getMediator().set(selectedValues);
		} else {
			this.getMediator().set(this.getEl()["value"]);
		}
		this.notifyModelInteraction();
	}

	protected onTargetChange(previous: any, current: any): void {
		const selElem = this.getEl() as HTMLSelectElement;
		if (selElem.multiple) {
			current = (current === null) ? [] : current;
			const children: HTMLOptionsCollection = selElem.options;
			for (let i = 0; i < selElem.options.length; i++) {
				const optElem: HTMLOptionElement = children.item(i);
				const optValue: string = optElem.value;
				optElem.selected = current.includes(optValue);
			}
		} else {
			this.getEl()["value"] = current;
		}
	}

}

export default MultiSelectValueModel;
