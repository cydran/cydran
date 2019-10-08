import {Decorator} from "../Core";

/**
 *
 */
class SelectOptions extends Decorator<string> {

	public static readonly KEY: string = "options-model";

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		const items: Array<{name: string; value: string;}> = current;

		const child: HTMLElement = el.appendChild(document.createElement("option"));
		child.innerHTML = "Select...";
		child.setAttribute("selected", "selected");
		child.setAttribute("disabled", "disabled");
		child["value"] = "";

		for (const item of items) {
			const itemChild: HTMLElement = el.appendChild(document.createElement("option"));
			itemChild.innerHTML = item.name;
			itemChild["value"] = item.value;
		}
	}

}

export default SelectOptions;
