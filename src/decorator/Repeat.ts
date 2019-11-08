import { Component, Decorator, Properties } from "../Core";
import LoggerFactory from "../logger/LoggerFactory";

const LOGGER = LoggerFactory.getLogger("ComponentEachDecorator");

/**
 *
 */
class Repeat extends Decorator<Function> {

	private children: Component[];

	private tag: string;

	private id: string;

	private idKey: string;

	public wire(): void {
		this.children = [];
		this.getMediator().setReducer((input) => input["items"]);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		LOGGER.info("Changed");
		// const el: HTMLElement = this.getEl();

		// // tslint:disable-next-line
		// for (let i = 0; i < this.children.length; i++) {
		// 	this.children[i].dispose();
		// }

		// this.children = [];

		// while (el.firstChild) {
		// 	el.removeChild(el.firstChild);
		// }

		// let items = current;

		// if (!items) {
		// 	items = [];
		// }

		// for (let i = 0; i < items.length; i++) {
		// 	const item: any = items[i];
		// 	const child: HTMLElement = el.appendChild(Properties.getWindow().document.createElement(this.tag));
		// 	item._id = i;
		// 	const component: Component = this.get(this.id);

		// 	if (component) {
		// 		component["data"] = item;
		// 		// component.setEl(child);
		// 		component.setParent(this.getParent());
		// 		this.children.push(component);
		// 	} else {
		// 		LOGGER.fatal("Component " + this.id + " not found in registry");
		// 	}
		// }
	}

}

export default Repeat;
