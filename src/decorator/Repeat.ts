import { Component, Decorator, INTERNAL_DIRECT_CHANNEL_NAME, Properties } from "../Core";
import Guard from "../Guard";
import LoggerFactory from "../logger/LoggerFactory";
import ObjectUtils from "../ObjectUtils";

const LOGGER = LoggerFactory.getLogger("ComponentEachDecorator");
const DEFAULT_ID_KEY: string = "id";
const DOCUMENT: Document = Properties.getWindow().document;

interface DecoratorValues {

	idKey: string;

	item: string;

	empty: string;

	first: string;

	last: string;

	items: any[];

}

interface ComponentMap {

	[id: string]: Component;

}

/**
 *
 */
class Repeat extends Decorator<DecoratorValues, HTMLElement> {

	private idKey: string;

	private itemComponentName: string;

	private map: ComponentMap;

	private empty: Component;

	private first: Component;

	private last: Component;

	private ids: string[];

	private itemTemplate: string;

	private initialized: boolean = false;

	public wire(): void {
		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemTemplate = null;
		this.getMediator().setReducer((input) => input.items);
		this.getMediator().watch(this, this.onTargetChange);
		this.getMediator().onDigest(this, this.onDigest);
	}

	public unwire(): void {
		if (this.empty) {
			this.empty.dispose();
		}

		if (this.first) {
			this.first.dispose();
		}

		if (this.last) {
			this.last.dispose();
		}

		for (const key in this.map) {
			if (this.map.hasOwnProperty(key)) {
				const component: Component = this.map[key];
				component.dispose();
			}
		}

		this.empty = null;
		this.map = {};
	}

	protected onDigest(guard: Guard): void {
		if (guard.isPropagateDown()) {
			for (const id of this.ids) {
				this.map[id].digest(guard);
			}
		} else {
			this.getLogger().debug("Not propagating to children");
		}
	}

	protected onTargetChange(previous: DecoratorValues, current: DecoratorValues, guard: Guard): void {
		if (!this.initialized) {
			const children: HTMLCollection = this.getEl().children;

			// tslint:disable-next-line
			for (let i = 0; i < children.length; i++) {
				const child: ChildNode = children[i];

				if ("template" === child.nodeName.toLowerCase()) {
					const template: HTMLElement = child as HTMLElement;

					if (template.innerHTML) {
						const markup: string = template.innerHTML.trim();
						const type: string = template.getAttribute("type");

						if ("empty" === type) {
							this.empty = new Component("repeatEmpty", markup);
							this.empty.setParent(this.getParent());
						}

						if ("first" === type) {
							this.first = new Component("repeatFirst", markup);
							this.first.setParent(this.getParent());
						}

						if ("after" === type) {
							this.last = new Component("repeatLast", markup);
							this.last.setParent(this.getParent());
						}

						if ("item" === type) {
							this.itemTemplate = markup;
						}
					}
				}
			}

			this.idKey = current.idKey || DEFAULT_ID_KEY;
			this.itemComponentName = current.item;

			if (current.empty && !this.empty) {
				this.empty = this.getComponent(current.empty);
				this.empty.setParent(this.getParent());
			}

			if (current.first && !this.first) {
				this.first = this.getComponent(current.first);
				this.first.setParent(this.getParent());
			}

			if (current.last && !this.last) {
				this.last = this.getComponent(current.last);
				this.last.setParent(this.getParent());
			}

			if (this.empty) {
				this.initAsRepeatable(this.empty);
			}

			if (this.first) {
				this.initAsRepeatable(this.first);
			}

			if (this.last) {
				this.initAsRepeatable(this.last);
			}

			this.initialized = true;
		}

		const newIds: string[] = [];

		for (const item of current.items) {
			const id: string = item[this.idKey] + "";
			newIds.push(id);
		}

		if (!ObjectUtils.equals(this.ids, newIds)) {
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

				if (this.first) {
					fragment.appendChild(this.first.getEl());
				}

				for (const component of components) {
					fragment.appendChild(component.getEl());
				}

				if (this.last) {
					fragment.appendChild(this.last.getEl());
				}

				el.appendChild(fragment);
			}
		}

		for (const id of newIds) {
			this.map[id].digest(guard);
		}

		this.ids = newIds;
	}

	private getComponent(name: string): Component {
		return this.getParent().get(name);
	}

	private create(data: any): Component {
		const component: Component = (this.itemTemplate === null)
			? this.getComponent(this.itemComponentName)
			: new Component("repeatItem", this.itemTemplate);

		this.initAsRepeatable(component);
		component.setData(data);
		component.setParent(this.getParent());

		return component;
	}

	private initAsRepeatable(component: Component): void {
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
	}

}

export default Repeat;
