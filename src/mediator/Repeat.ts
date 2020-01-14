import { ComponentConfig } from "@/ComponentConfig";
import { Component, COMPONENT_INTERNALS_FIELD_NAME, ComponentInternals, ElementMediator, INTERNAL_DIRECT_CHANNEL_NAME, Properties } from "@/Core";
import Guard from "@/Guard";
import ObjectUtils from "@/ObjectUtils";
import { extractParams } from "@/ParamUtils";

const DEFAULT_ID_KEY: string = "id";
const DOCUMENT: Document = Properties.getWindow().document;

interface Params {

	idkey: string;

}

interface ComponentMap {

	[id: string]: Component;

}

class UtilityComponent extends Component {

	constructor(template: string, parent: Component) {
		super(template);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
	}

}

class ItemComponent extends Component {

	constructor(template: string, parent: Component, data: any) {
		super(template);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setData", data);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this[COMPONENT_INTERNALS_FIELD_NAME] = new ComponentInternals(this, template, config, true);
		this[COMPONENT_INTERNALS_FIELD_NAME]["init"]();
	}

}

/**
 *
 */
class Repeat extends ElementMediator<any[], HTMLElement> {

	private idKey: string;

	private map: ComponentMap;

	private empty: Component;

	private first: Component;

	private last: Component;

	private ids: string[];

	private itemTemplate: string;

	public wire(): void {
		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemTemplate = null;
		this.getModelMediator().watch(this, this.onTargetChange);
		this.getModelMediator().onDigest(this, this.onDigest);

		const paramTagName: string = this.getPrefix() + "param";
		const params: any = extractParams<Params>(paramTagName, this.getEl());
		this.idKey = params.idKey || DEFAULT_ID_KEY;

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
						this.empty = new UtilityComponent(markup, this.getParent());
					}

					if ("first" === type) {
						this.first = new UtilityComponent(markup, this.getParent());
					}

					if ("after" === type) {
						this.last = new UtilityComponent(markup, this.getParent());
					}

					if ("item" === type) {
						this.itemTemplate = markup;
					}
				}
			}
		}

		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		if (this.empty) {
			el.appendChild(this.empty.getEl());
		}
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
				this.map[id].message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", guard);
			}
		} else {
			this.getLogger().trace("Not propagating to children");
		}
	}

	protected onTargetChange(previous: any[], current: any[], guard: Guard): void {
		const newIds: string[] = [];

		for (const item of current) {
			const id: string = item[this.idKey] + "";
			newIds.push(id);
		}

		if (!ObjectUtils.equals(this.ids, newIds)) {
			const newMap: ComponentMap = {};
			const components: Component[] = [];

			for (const item of current) {
				const id: string = item[this.idKey] + "";
				const component: Component = this.map[id] ? this.map[id] : new ItemComponent(this.itemTemplate, this.getParent(), item);
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
			this.map[id].message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", guard);
		}

		this.ids = newIds;
	}

}

export default Repeat;
