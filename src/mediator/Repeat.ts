import { ComponentConfig, ComponentConfigImpl } from "@/ComponentConfig";
import { Component, COMPONENT_INTERNALS_FIELD_NAME, ComponentInternals, ElementMediator, INTERNAL_DIRECT_CHANNEL_NAME, Properties } from "@/Core";
import Evaluator from "@/Evaluator";
import Guard from "@/Guard";
import ObjectUtils from "@/ObjectUtils";
import ScopeImpl from "@/ScopeImpl";

const DEFAULT_ID_KEY: string = "id";
const DOCUMENT: Document = Properties.getWindow().document;

interface Params {

	idkey: string;

}

interface ComponentMap {

	[id: string]: Component;

}

class UtilityComponent extends Component {

	constructor(template: string, prefix: string, parent: Component, parentModelFn: () => any) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.withPrefix(prefix);
		config.setParentModelFn(parentModelFn);
		super(template, config);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
	}

}

class ItemComponent extends Component {

	constructor(template: string, prefix: string, parent: Component, parentModelFn: () => any, data: any) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.withPrefix(prefix);
		config.setParentModelFn(parentModelFn);
		super(template, config);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setData", data);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this[COMPONENT_INTERNALS_FIELD_NAME] = new ComponentInternals(this, template, config);
		this[COMPONENT_INTERNALS_FIELD_NAME]["init"]();
	}

}

/**
 *
 */
class Repeat extends ElementMediator<any[], HTMLElement, Params> {

	private idKey: string;

	private map: ComponentMap;

	private empty: Component;

	private first: Component;

	private last: Component;

	private ids: string[];

	private localScope: ScopeImpl;

	private scopeItem: any;

	private itemTemplate: string;

	private alternatives: Array<{
		test: Evaluator;
		markup: string;
	}>;

	public wire(): void {
		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemTemplate = null;
		this.alternatives = [];
		this.localScope = new ScopeImpl(false);

		const modelFn: () => any = () => this.getModelFn();
		const itemFn: () => any = () => this.scopeItem;
		this.localScope.setParent(this.getParent().scope() as ScopeImpl);
		this.localScope.add("m", modelFn);
		this.localScope.add("model", modelFn);
		this.localScope.add("i", itemFn);
		this.localScope.add("item", itemFn);

		this.getModelMediator().watch(this, this.onTargetChange);
		this.getModelMediator().onDigest(this, this.onDigest);

		this.idKey = this.getParams().idkey || DEFAULT_ID_KEY;

		const children: HTMLCollection = this.getEl().children;

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if ("template" === child.nodeName.toLowerCase()) {
				const template: HTMLElement = child as HTMLElement;

				if (template.innerHTML) {
					const markup: string = template.innerHTML.trim();
					const type: string = template.getAttribute("type");

					switch (type) {
						case "empty":
							this.empty = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getModelFn());
							break;

						case "first":
							this.first = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getModelFn());
							break;

						case "after":
							this.last = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getModelFn());
							break;

						case "alt":
							const expression: string = template.getAttribute("test");
							this.alternatives.push({
								markup: markup,
								test: new Evaluator(expression, this.localScope)
							});

							break;

						case "item":
							this.itemTemplate = markup;
							break;

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
			this.map[id].message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", guard);
		}

		this.ids = newIds;
	}

	private create(item: any): Component {
		let template: string = this.itemTemplate;
		this.scopeItem = item;

		try {
			if (this.alternatives.length > 0) {
				for (const alternative of this.alternatives) {
					if (alternative.test.test()) {
						template = alternative.markup;
						break;
					}
				}
			}
		} finally {
			this.scopeItem = null;
		}

		return new ItemComponent(template, this.getParent().getPrefix(), this.getParent(), this.getModelFn(), item);
	}

}

export default Repeat;
