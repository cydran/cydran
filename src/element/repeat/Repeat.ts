import Evaluator from "@/model/Evaluator";
import ObjectUtils from "@/util/ObjectUtils";
import ScopeImpl from "@/model/ScopeImpl";
import Properties from "@/config/Properties";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import ElementMediator from "@/element/ElementMediator";
import Nestable from "@/component/Nestable";
import MediatorSource from "@/mvvm/MediatorSource";
import Factories from "@/mvvm/Factories";
import SimpleMap from "@/pattern/SimpleMap";
import UtilityComponent from "@/element/repeat/UtilityComponent";
import ItemComponent from "@/element/repeat/ItemComponent";
import { uuidV4 } from "@/util/UuidUtils";

const isDefined = ObjectUtils.isDefined;

const DEFAULT_ID_KEY: string = "id";

interface Params {

	idkey: string;

}

/**
 *
 */
class Repeat extends ElementMediator<any[], HTMLElement, Params> {

	private idKey: string;

	private map: SimpleMap<Nestable>;

	private empty: Nestable;

	private first: Nestable;

	private last: Nestable;

	private ids: string[];

	private localScope: ScopeImpl;

	private scopeItem: any;

	private itemTemplate: string;

	private alternatives: {
		test: Evaluator;
		markup: string;
	}[];

	constructor(deps: any) {
		super(deps, true);
	}

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
		this.idKey = this.getParams().idkey || DEFAULT_ID_KEY;

		const children: HTMLCollection = this.getEl().children;

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if ("template" !== child.nodeName.toLowerCase()) {
				continue;
			}

			const template: HTMLElement = child as HTMLElement;

			if (!isDefined(template.innerHTML)) {
				continue;
			}

			const markup: string = template.innerHTML.trim();
			const type: string = template.getAttribute("type");

			switch (type) {
				case "empty":
					this.empty = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn());
					break;

				case "first":
					this.first = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn());
					break;

				case "after":
					this.last = new UtilityComponent(markup, this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn());
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
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.dispose();
		}

		this.empty = null;
		this.map = {};
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.first) {
			this.first.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.last) {
			this.last.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.empty) {
			this.empty.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}
	}

	protected onTargetChange(previous: any[], current: any[]): void {
		const newIds: string[] = [];

		const items: any[] = current || [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!isDefined(item[this.idKey])) {
				const generatedId: string = uuidV4();
				item[this.idKey] = generatedId;
				this.getLogger().ifDebug(() => "Generated missing id field \"" + this.idKey + "\" @ index " + i);
			}
			const id: string = item[this.idKey] + "";
			newIds.push(id);
		}

		if (!ObjectUtils.equals(this.ids, newIds)) {
			const newMap: SimpleMap<Nestable> = {};
			const components: Nestable[] = [];

			for (const item of items) {
				const id: string = item[this.idKey] + "";
				const component: Nestable = this.map[id] ? this.map[id] : this.create(item);
				newMap[id] = component;
				components.push(component);
				delete this.map[id];
			}

			for (const key in this.map) {
				if (this.map.hasOwnProperty(key)) {
					const component: Nestable = this.map[key];
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
				const fragment: DocumentFragment = Properties.getWindow().document.createDocumentFragment();

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

		this.ids = newIds;
	}

	private create(item: any): Nestable {
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

		return new ItemComponent(template, this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn(), item);
	}

}

Factories.register("repeat", ["*"], Repeat);

export default Repeat;
