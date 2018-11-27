import {Component, Decorator} from "../Core";
import Logger from "../logger/Logger";
import LoggerFactory from "../logger/LoggerFactory";

const LOGGER = LoggerFactory.getLogger("ComponentEachDecorator");

class ComponentEachDecorator extends Decorator<any> {

	private children: Component[];

	private tag: string;

	private id: string;

	public wire(): void {
		this.children = [];
		let value = this.getTarget();
		this.tag = this.getParam("tag", "div");
		this.id = this.getRequiredParam("id");
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		let el: HTMLElement = this.getEl();

		for (var i = 0;i < this.children.length;i++) {
			this.children[i].dispose();
		}

		this.children = [];

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		let items = value;

		if (!items) {
			items = [];
		}

		for (var i = 0;i < items.length;i++) {
			let item: any = items[i];
			let child: HTMLElement = el.appendChild(document.createElement(this.tag));
			item._id = i;
			let component: Component = this.get(this.id);

			if (component) {
				component["data"] = item;
				component.setEl(child);
				component.setParentView(this.getParentView());
				this.children.push(component);
			} else {
				LOGGER.fatal("Component " + this.id + " not found in registry");
			}
		}
	}

	protected isEqual(first: any, second: any): boolean {
		const firstArr:string[] = first;
		const secondArr:string[] = second;

		if (firstArr.length !== secondArr.length) {
			return false;
		}

		let matches: boolean = true;

		for (let i = 0; i < firstArr.length; i++) {
			if (firstArr[i] !== secondArr[i]) {
				matches = false;
				break;
			}
		}

		return matches;
	}

	protected computeDigest(value: any): any {
		const source: Array<{ id: string }> = value;
		const result: string[] = [];

		source.forEach((v) => result.push(v.id));

		return result;
	}

}

export default ComponentEachDecorator;
