import Evaluator from "@/model/Evaluator";
import ScopeImpl from "@/model/ScopeImpl";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import ElementMediator from "@/element/ElementMediator";
import Nestable from "@/component/Nestable";
import MediatorSource from "@/mvvm/MediatorSource";
import Factories from "@/mvvm/Factories";
import SimpleMap from "@/pattern/SimpleMap";
import IdStrategy from "@/element/each/IdStrategy";
import GeneratedIdStrategyImpl from "@/element/each/GeneratedIdStrategyImpl";
import NoneIdStrategyImpl from "@/element/each/NoneIdStrategyImpl";
import ComponentFactory from "@/element/each/ComponentFactory";
import Params from "@/element/each/Params";
import UtilityComponentFactoryImpl from "@/element/each/UtilityComponentFactoryImpl";
import ItemComponentFactoryImpl from "@/element/each/ItemComponentFactoryImpl";
import EmbeddedComponentFactoryImpl from "@/element/each/EmbeddedComponentFactoryImpl";
import InvalidIdStrategyImpl from "@/element/each/InvalidIdStrategyImpl";
import ExpressionIdStrategyImpl from "@/element/each/ExpressionIdStrategyImpl";
import { asIdentity } from "@/model/Reducers";
import { isDefined, equals } from "@/util/ObjectUtils";
import { createDocumentFragmentOffDom, elementAsString } from '@/util/DomUtils';
import AmbiguousMarkupError from "@/error/AmbiguousMarkupError";
import AttributeExtractor from "@/mvvm/AttributeExtractor";
import Validators from "@/validation/Validators";
import { VALID_ID } from "@/constant/ValidationRegExp";

const DEFAULT_ID_KEY: string = "id";

/**
 *
 */
class Each extends ElementMediator<any[], HTMLElement, Params> {

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
		this.localScope.add("v", itemFn);

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

			const template: HTMLTemplateElement = child as HTMLTemplateElement;
			const type: string = this.getExtractor().extract(template, "type");

			switch (type) {
				case "empty":
					this.empty = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "first":
					this.first = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "after":
					this.last = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "alt":
					const expression: string = this.getExtractor().extract(template, "test");
					this.alternatives.push({
						factory: this.createFactory(template, ItemComponentFactoryImpl),
						test: new Evaluator(expression, this.localScope)
					});

					break;

				case "item":
					this.itemFactory = this.createFactory(template, ItemComponentFactoryImpl);
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

		if (!equals(this.ids, newIds)) {
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
				const workingEl: HTMLElement | DocumentFragment
					= (this.elIsSelect) ? el : createDocumentFragmentOffDom();

				if (this.first) {
					workingEl.appendChild(this.first.getEl());
				}

				for (const component of components) {
					workingEl.appendChild(component.getEl());
				}

				if (this.last) {
					workingEl.appendChild(this.last.getEl());
				}
				if (!this.elIsSelect) {
					el.appendChild(workingEl);
				}
			}
		}

		this.ids = newIds;
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		check(this.getMediatorPrefix() + ":mode", this.getParams().mode)
			.isDefined()
			.oneOf("none", "generated", "expression")
			.requireIfEquals("expression", this.getMediatorPrefix() + ":expression", this.getParams().expression);

		check(this.getMediatorPrefix() + ":idkey", this.getParams().idkey).notEmpty();
		check(this.getMediatorPrefix() + ":expression", this.getParams().expression).notEmpty();

		if (this.getEl().children.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < this.getEl().children.length; i++) {
				const child: HTMLElement = this.getEl().children[i] as HTMLElement;

				if (child.tagName.toLowerCase() !== "template") {
					check(elementAsString(child)).reject("not allowed as a child element");
					continue;
				}

				const template: HTMLTemplateElement = child as HTMLTemplateElement;

				check(this.getExtractor().asTypePrefix("type") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "type"))
					.isDefined()
					.oneOf("empty", "first", "after", "alt", "item")
					.requireIfEquals("alt", this.getExtractor().asTypePrefix("test"), this.getExtractor().extract(template, "test"));

				check(this.getExtractor().asTypePrefix("component") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "component"))
					.requireIfTrue(template.content.childElementCount === 0)
					.disallowIfTrue(template.content.childElementCount > 0, "if a template body is supplied")
					.matches(VALID_ID);

				check(this.getExtractor().asTypePrefix("module") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "module"))
					.disallowIfTrue(template.content.childElementCount > 0, "if a template body is supplied")
					.matches(VALID_ID);
			}
		}
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

	private createFactory(template: HTMLTemplateElement, factory: any): ComponentFactory {
		const componentId: string = this.getExtractor().extract(template, "component");
		const moduleId: string = this.getExtractor().extract(template, "module");
		const hasComponentId: boolean = isDefined(componentId) && componentId.trim().length > 0;

		// TODO - Eliminate redundant validation, if possible

		if (template.content.childElementCount > 0 && hasComponentId) {
			throw new AmbiguousMarkupError("Ambiguous component definition in template for repeat on expression: "
				+ this.getExpression() + " and markup: " + template.innerHTML);
		}

		if (template.content.childElementCount > 1) {
			throw new AmbiguousMarkupError("Template definitions must only have one top-level tag in repeat on expression: "
				+ this.getExpression() + " and markup: " + template.innerHTML);
		}

		return (hasComponentId)
			? new EmbeddedComponentFactoryImpl(this.getModule(), componentId, moduleId, this.getParent(), this.getParentId())
			: new factory(this.getModule(), template.innerHTML.trim(), this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn());
	}

}

Factories.register("each", ["*"], Each);

export default Each;
