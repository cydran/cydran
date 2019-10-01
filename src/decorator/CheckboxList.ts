import _ from "lodash";
import { Decorator } from "../Core";
import Logger from "../logger/Logger";
import LoggerFactory from "../logger/LoggerFactory";
import ModelMediator from "../ModelMediator";

const LOGGER: Logger = LoggerFactory.getLogger("CheckboxListDecorator");

/**
 * 
 */
class CheckboxList extends Decorator<Function> {

	private itemsExpression: string;

	private items: HTMLElement[];

	private itemsMediator: ModelMediator;

	private checkboxChangeListener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.itemsExpression = this.getRequiredParam("items");
		this.itemsMediator = this.mediate(this.itemsExpression);
		this.items = [];
		this.getMediator().watch(this, this.onTargetChange);
		this.itemsMediator.watch(this, this.onItemsChange);
		this.onChange(this.getMediator().get(), this.itemsMediator.get());

		this.checkboxChangeListener = (event: Event) => {
			this.onCheckboxChange(event);
		};

		this.getEl().addEventListener("change", this.checkboxChangeListener);
	}

	public unwire(): void {
		this.getEl().removeEventListener("change", this.checkboxChangeListener);
		this.checkboxChangeListener = null;
	}

	public onCheckboxChange(event: Event): void {
		if (event.target !== event.currentTarget) {
			const checkboxElement: HTMLInputElement = event.target as HTMLInputElement;
			const id: string = checkboxElement.getAttribute("data-id");
			const checkedValues: string[] = _.cloneDeep(this.getMediator().get());

			_.remove(checkedValues, (value) => value === id);

			if (checkboxElement.checked) {
				checkedValues.push(id);
			}

			this.getMediator().set(checkedValues);
			this.notifyModelInteraction();
		}

		event.stopPropagation();
	}

	protected onChange(checked: string[], checkboxes: Array<{ title: string; id: string; }>): void {
		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		if (checkboxes === null) {
			return;
		}

		for (const item of checkboxes) {
			const child: HTMLElement = el.appendChild(document.createElement("li"));
			const checkbox: HTMLInputElement = child.appendChild(document.createElement("input"));
			checkbox.setAttribute("type", "checkbox");
			checkbox.setAttribute("data-id", item.id);
			checkbox.checked = _.includes(checked, item.id);

			const label: HTMLElement = child.appendChild(document.createElement("label"));
			label.innerText = item.title;
		}
	}

	protected onTargetChange(previous: any, value: any): void {
		this.onChange(value, this.itemsMediator.get());
	}

	protected onItemsChange(previous: any, value: any): void {
		this.onChange(this.getMediator().get(), value);
	}

}

export default CheckboxList;
