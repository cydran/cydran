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
import IdStrategy from "@/element/repeat/IdStrategy";
import GeneratedIdStrategyImpl from "@/element/repeat/GeneratedIdStrategyImpl";
import NoneIdStrategyImpl from "@/element/repeat/NoneIdStrategyImpl";
import ComponentFactory from "@/element/repeat/ComponentFactory";
import Params from "@/element/repeat/Params";
import UtilityComponentFactoryImpl from "@/element/repeat/UtilityComponentFactoryImpl";
import ItemComponentFactoryImpl from "@/element/repeat/ItemComponentFactoryImpl";
import EmbeddedComponentFactoryImpl from "@/element/repeat/EmbeddedComponentFactoryImpl";
import InvalidIdStrategyImpl from "@/element/repeat/InvalidIdStrategyImpl";
import ExpressionIdStrategyImpl from "@/element/repeat/ExpressionIdStrategyImpl";
import { asIdentity } from "@/model/Reducers";

const isDefined = ObjectUtils.isDefined;

const DEFAULT_ID_KEY: string = "id";

/**
 *
 */
class Repeat extends ElementMediator<any[], HTMLElement, Params> {

	private map: SimpleMap<Nestable>;

	private empty: Nestable;

	private first: Nestable;

	private last: Nestable;

	private ids: string[];

	private localScope: ScopeImpl;

	private scopeItem: any;

	private itemFactory: ComponentFactory;

	private idStrategy: IdStrategy;

	private elIsSelect: boolean;

	private alternatives: {
		test: Evaluator;
		factory: ComponentFactory;
	}[];

	constructor(deps: any) {
		super(deps, true, asIdentity);
		this.idStrategy = null;
		this.elIsSelect = (this.getEl().tagName.toLowerCase() === "select");
	}

	public wire(): void {
		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemFactory = null;
		this.alternatives = [];
		this.localScope = new ScopeImpl(false);

		const modelFn: () => any = () => this.getModelFn();
		const itemFn: () => any = () => this.scopeItem;
		this.localScope.setParent(this.getParent().scope() as ScopeImpl);
		this.localScope.add("m", modelFn);
		this.localScope.add("model", modelFn);
		this.localScope.add("i", itemFn);
		this.localScope.add("item", itemFn);
		this.localScope.add("v", itemFn);
		this.localScope.add("value", itemFn);

		this.getModelMediator().watch(this, this.onTargetChange);
		const idKey: string = this.getParams().idkey || DEFAULT_ID_KEY;
		const idExpression: string = this.getParams().expression;
		const mode: string = this.getParams().mode || null;

		switch (mode) {
			case "generated":
				this.idStrategy = new GeneratedIdStrategyImpl(idKey);
				break;

			case "none":
				this.idStrategy = new NoneIdStrategyImpl(idKey);
				break;

			case "expression":
				this.idStrategy = new ExpressionIdStrategyImpl(idExpression);
				break;

			default:
				this.idStrategy = new InvalidIdStrategyImpl();
		}

		this.idStrategy.init();

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
					this.empty = this.createFactory(markup, UtilityComponentFactoryImpl).create();
					break;

				case "first":
					this.first = this.createFactory(markup, UtilityComponentFactoryImpl).create();
					break;

				case "after":
					this.last = this.createFactory(markup, UtilityComponentFactoryImpl).create();
					break;

				case "alt":
					const expression: string = template.getAttribute("test");
					this.alternatives.push({
						factory: this.createFactory(markup, ItemComponentFactoryImpl),
						test: new Evaluator(expression, this.localScope)
					});

					break;

				case "item":
					this.itemFactory = this.createFactory(markup, ItemComponentFactoryImpl);
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

		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (!this.idStrategy.check(item)) {
				this.idStrategy.enrich(item, i);
			}

			const id: string = this.idStrategy.extract(item);
			newIds.push(id);
		}

		if (!ObjectUtils.equals(this.ids, newIds)) {
			const newMap: SimpleMap<Nestable> = {};
			const components: Nestable[] = [];

			for (const item of items) {
				const id: string = this.idStrategy.extract(item);
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
				el.removeChild(el.lastChild);
			}

			if (components.length === 0) {
				if (this.empty) {
					el.appendChild(this.empty.getEl());
				}
			} else {
				if (this.elIsSelect) {
					if (this.first) {
						el.appendChild(this.first.getEl());
					}

					for (const component of components) {
						el.appendChild(component.getEl());
					}

					if (this.last) {
						el.appendChild(this.last.getEl());
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
		}

		this.ids = newIds;
	}

	private create(item: any): Nestable {
		let factory: ComponentFactory = this.itemFactory;
		this.scopeItem = item;

		try {
			if (this.alternatives.length > 0) {
				for (const alternative of this.alternatives) {
					if (alternative.test.test()) {
						factory = alternative.factory;
						break;
					}
				}
			}
		} finally {
			this.scopeItem = null;
		}

		return factory.create(item);
	}

	private createFactory(markup: string, factory: any): ComponentFactory {
		const templateEl: HTMLTemplateElement = Properties.getWindow().document.createElement("template");
		templateEl.insertAdjacentHTML("afterbegin", markup.trim());
		const expectedTag: string = this.getParent().getPrefix() + ":component";

		let result: ComponentFactory = null;

		if (templateEl.childElementCount === 1 && templateEl.firstElementChild.nodeName.toLowerCase() === expectedTag.toLowerCase()) {
			const componentId: string = templateEl.firstElementChild.getAttribute("name");
			const moduleId: string = templateEl.firstElementChild.getAttribute("module");
			result = new EmbeddedComponentFactoryImpl(this.getModule(), componentId, moduleId, this.getParent(), this.getParentId());
		} else {
			result = new factory(this.getModule(), markup, this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn());
		}

		return result;
	}

}

Factories.register("repeat", ["*"], Repeat);

export default Repeat;
