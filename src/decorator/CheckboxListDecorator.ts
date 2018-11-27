import { Decorator } from "../Core";
import Logger from "../logger/Logger";
import LoggerFactory from "../logger/LoggerFactory";

const LOGGER = LoggerFactory.getLogger("CheckboxListDecorator");

class CheckboxListDecorator extends Decorator<any> {

	private items: HTMLElement[];

	public wire(): void {
		this.items = [];
		let value = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		// let el: HTMLElement = this.getEl();

		// this.items = [];

		// while (el.firstChild) {
		// 	el.removeChild(el.firstChild);
		// }

		// let tag: string = value[0];
		// let id: string = value[1];
		// let items = value[2];

		// if (!items) {
		// 	items = [];
		// }

		// for (var i = 0;i < items.length;i++) {
		// 	let item: any = items[i];
		// 	let child: HTMLElement = el.appendChild(document.createElement(tag));
		// 	item._id = i;
		// 	let component: Component = this.get(id);

		// 	if (component) {
		// 		component["data"] = item;
		// 		component.setEl(child);
		// 		component.setParentView(this.getParentView());
		// 		this.children.push(component);
		// 	} else {
		// 		LOGGER.fatal("Component " + id + " not found in registry");
		// 	}
		// }
	}

}

export default CheckboxListDecorator;
