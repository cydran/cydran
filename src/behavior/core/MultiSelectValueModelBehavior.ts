import AbstractBehavior from "behavior/AbstractBehavior";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Factories from "internals/Factories";

class MultiSelectValueModel extends AbstractBehavior<string | string[], HTMLSelectElement, any> {

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public populate(): void {
		this.onTargetChange(null, this.getMediator().get());
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
				this.getMediator().set(selectedValues);
			}, []);
		} else {
			this.$apply(() => {
				this.getMediator().set(this.getEl()["value"]);
			}, []);
		}
	}

	protected onTargetChange(previous: string | string[], current: string | string[]): void {
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

}

Factories.register("model", ["select"], MultiSelectValueModel);

export default MultiSelectValueModel;