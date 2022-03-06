import AbstractBehavior from "behavior/AbstractBehavior";
import Attrs from "const/AttrsFields";
import { INPUT_KEY, DOM_KEY } from "Constants";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { CHANGE_KEY } from "const/HardValues";

class MultiSelectValueModel extends AbstractBehavior<string | string[], HTMLSelectElement, any> {

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.onInput);
		this.bridge(CHANGE_KEY);
		this.on(CHANGE_KEY).forChannel(DOM_KEY).invoke(this.onInput);
	}

	public onMount(): void {
		this.onChange(null, this.getMediator().get());
		this.getMediator().watch(this, this.onChange);
		this.onChange(null, this.getMediator().get());
	}

	public onInput(event: Event): void {
		if (this.getEl().multiple) {
			const selectedValues: (string | number)[] = [];

			for (let i = 0; i < this.getEl().selectedOptions.length; i++) {
				const optValue: string = this.getEl()
					.selectedOptions.item(i)
					.getAttribute(Attrs.VALUE);
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

	protected onChange(previous: string | string[], current: string | string[]): void {
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

BehaviorsRegistry.register("model", ["select"], MultiSelectValueModel);

export default MultiSelectValueModel;
