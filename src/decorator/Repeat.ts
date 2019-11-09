import { Component, Decorator, Properties } from "../Core";
import LoggerFactory from "../logger/LoggerFactory";

const LOGGER = LoggerFactory.getLogger("ComponentEachDecorator");

const DEFAULT_ID_KEY: string = "id";

const DOCUMENT: Document = Properties.getWindow().document;

interface DecoratorValues {

	idKey: string;

	item: string;

	empty: string;

	items: any[];

}

interface ComponentMap {

	[id: string]: Component;

}

/**
 *
 */
class Repeat extends Decorator<Function> {

	private idKey: string;

	private itemComponentName: string;

	private map: ComponentMap;

	private empty: Component;

	private initialized: boolean = false;

	public wire(): void {
		this.map = {};
		this.empty = null;
		this.getMediator().setReducer((input) => input["items"]);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: DecoratorValues, current: DecoratorValues): void {
		if (!this.initialized) {
			this.idKey = current.idKey || DEFAULT_ID_KEY;
			this.itemComponentName = current.item;

			if (current.empty) {
				this.empty = this.getComponent(current.empty);
			}

			this.initialized = true;
		}

		const newMap: ComponentMap = {};
		const components: Component[] = [];

		for (const item of current.items) {
			const id: string = item[this.idKey] + "";
			const component: Component = this.map[id] ? this.map[id] : this.create(item);
			newMap[id] = component;
			components.push(component);
			delete this.map[id];
		}

		for (const key in this.map) {
			if (this.map.hasOwnProperty(key)) {
				const component: Component = this.map[key];
				component.dispose();
				delete this.map[key];
			}
		}

		this.map = newMap;
		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		if (components.length === 0) {
			if (this.empty) {
				el.appendChild(this.empty.getEl());
			}
		} else {
			const fragment: DocumentFragment = DOCUMENT.createDocumentFragment();

			for (const component of components) {
				fragment.appendChild(component.getEl());
			}

			el.appendChild(fragment);
		}
	}

	private getComponent(name: string): Component {
		return this.getParent().get(name);
	}

	private create(data: any): Component {
		const component: Component = this.getComponent(this.itemComponentName);
		component.setData(data);
		component.setParent(this.getParent());

		return component;
	}

}

export default Repeat;
