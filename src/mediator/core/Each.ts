import AbstractElementMediator from "mediator/AbstractElementMediator";
import Params from "interface/Params";
import SimpleMap from "interface/SimpleMap";
import Nestable from "interface/ables/Nestable";
import ScopeImpl from "scope/ScopeImpl";
import ComponentFactory from "component/ComponentFactory";
import IdStrategy from "strat/IdStrategy";
import Evaluator from "eval/Evaluator";
import DEFAULT_ID_KEY from "const/DefaultIdKey";
import GeneratedIdStrategyImpl from "strat/GeneratedIdStrategyImpl";
import ExpressionIdStrategyImpl from "strat/ExpressionIdStrategyImpl";
import NoneIdStrategyImpl from "strat/NoneIdStrategyImpl";
import InvalidIdStrategyImpl from "strat/InvalidIdStrategyImpl";
import UtilityComponentFactoryImpl from "component/UtilityComponentFactoryImpl";
import ItemComponentFactoryImpl from "component/ItemComponentFactoryImpl";
import MediatorSource from "mediator/MediatorSource";
import Validators from "validator/Validators";
import EmbeddedComponentFactoryImpl from "component/EmbeddedComponentFactoryImpl";
import { equals,	createDocumentFragmentOffDom, elementAsString, isDefined } from "util/Utils";
import { asIdentity } from "util/AsFunctions";
import { VALID_ID } from "Constants";
import { AmbiguousMarkupError, TemplateError } from "error/Errors";
import Factories from "internals/Factories";
import ElementMediatorFlags from "const/ElementMediatorFlags";

class Each extends AbstractElementMediator<any[], HTMLElement, Params> {

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

	private populationComplete: boolean;

	constructor() {
		super(asIdentity);
		this.idStrategy = null;
		this.populationComplete = false;
		this.setFlag(ElementMediatorFlags.CHILD_CONSUMPTION_PROHIBITED);
	}

	public onInit(): void {
		this.elIsSelect = this.getEl().tagName.toLowerCase() === "select";
	}

	public onMount(): void {
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

	public onDispose(): void {
		if (this.empty) {
			this.empty.$dispose();
		}

		if (this.first) {
			this.first.$dispose();
		}

		if (this.last) {
			this.last.$dispose();
		}

		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.$dispose();
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
			component.tell("consumeDigestionCandidates", sources);
		}

		if (this.first) {
			this.first.tell("consumeDigestionCandidates", sources);
		}

		if (this.last) {
			this.last.tell("consumeDigestionCandidates", sources);
		}

		if (this.empty) {
			this.empty.tell("consumeDigestionCandidates", sources);
		}
	}

	protected onTargetChange(previous: any[], current: any[]): void {
		if (!this.isMutable() && this.populationComplete) {
			return;
		}

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

		if (!equals(10, this.ids, newIds)) {
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
					component.$dispose();
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
				const workingEl: HTMLElement | DocumentFragment = this.elIsSelect
					? el
					: createDocumentFragmentOffDom();

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

		this.populationComplete = true;
	}

	protected validate(
		element: HTMLElement,
		check: (name: string, value?: any) => Validators
	): void {
		const pfx: string = this.getMediatorPrefix();

		check(`${pfx}:mode`, this.getParams().mode)
			.isDefined()
			.oneOf("none", "generated", "expression")
			.requireIfEquals("expression", `${pfx}:expression`, this.getParams().expression);

		check(`${pfx}:idkey`, this.getParams().idkey).notEmpty();
		check(`${pfx}:expression`, this.getParams().expression).notEmpty();

		let primaryTemplateCount: number = 0;
		let firstTemplateCount: number = 0;
		let afterTemplateCount: number = 0;
		let emptyTemplateCount: number = 0;
		if (this.getEl().children.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < this.getEl().children.length; i++) {
				const child: HTMLElement = this.getEl().children[i] as HTMLElement;

				if (child.tagName.toLowerCase() !== "template") {
					check(elementAsString(child)).reject(
						`not allowed when the parent element has a ${pfx} attribute present as part of a Cydran component template`
					);
					continue;
				}

				const template: HTMLTemplateElement = child as HTMLTemplateElement;

				primaryTemplateCount +=
					this.getExtractor().extract(template, "type").toLowerCase() === "item" ? 1 : 0;
				firstTemplateCount +=
					this.getExtractor().extract(template, "type").toLowerCase() === "first" ? 1 : 0;
				afterTemplateCount +=
					this.getExtractor().extract(template, "type").toLowerCase() === "after" ? 1 : 0;
				emptyTemplateCount +=
					this.getExtractor().extract(template, "type").toLowerCase() === "empty" ? 1 : 0;

				const elemAsStrPhrase: String = ` attribute on ${elementAsString(template)}`;
				check(
					this.getExtractor().asTypePrefix("type") + elemAsStrPhrase,
					this.getExtractor().extract(template, "type")
				)
					.isDefined()
					.oneOf("empty", "first", "after", "alt", "item")
					.requireIfEquals(
						"alt",
						this.getExtractor().asTypePrefix("test"),
						this.getExtractor().extract(template, "test")
					);

				check(
					this.getExtractor().asTypePrefix("component") + elemAsStrPhrase,
					this.getExtractor().extract(template, "component")
				)
					.requireIfTrue(template.content.childElementCount === 0)
					.disallowIfTrue(
						template.content.childElementCount > 0,
						"if a template body is supplied"
					)
					.matches(VALID_ID);

				check(
					this.getExtractor().asTypePrefix("module") + elemAsStrPhrase,
					this.getExtractor().extract(template, "module")
				)
					.disallowIfTrue(
						template.content.childElementCount > 0,
						"if a template body is supplied"
					)
					.matches(VALID_ID);
			}

			const msgMust: string = "must have only ";
			const msgMidPrimary: string = `one child <template ${this.getPrefix()}type=`;
			const msgZeroOne: string = `${msgMust}zero or ${msgMidPrimary}`;
			const msgEnd: string = `> node/element.`;
			if (primaryTemplateCount !== 1) {
				check(elementAsString(this.getEl())).reject(
					`${msgMust}${msgMidPrimary}"item"${msgEnd}`
				);
			}
			if (firstTemplateCount > 1) {
				check(elementAsString(this.getEl())).reject(`${msgZeroOne}"first"${msgEnd}`);
			}
			if (afterTemplateCount > 1) {
				check(elementAsString(this.getEl())).reject(`${msgZeroOne}"after"${msgEnd}`);
			}
			if (emptyTemplateCount > 1) {
				check(elementAsString(this.getEl())).reject(`${msgZeroOne}"empty"${msgEnd}`);
			}
		}
	}

	private create(item: any): Nestable {
		let factory: ComponentFactory = this.itemFactory;
		if (!factory) {
			throw new TemplateError(
				`The template structure for an Each structure is incorrect or incomplete`
			);
		}

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
		const valueExpression: string = this.getExtractor().extract(template, "value");
		const hasComponentId: boolean =
			isDefined(componentId) && componentId.trim().length > 0;

		// TODO - Eliminate redundant validation, if possible

		if (template.content.childElementCount > 0 && hasComponentId) {
			throw new AmbiguousMarkupError(
				`Ambiguous component definition in template for 'each' on expression: ${this.getExpression()} and markup: ${template.innerHTML
				}`
			);
		}

		if (template.content.childElementCount > 1) {
			throw new AmbiguousMarkupError(
				`Template definitions must only have one top-level tag in repeat on expression: ${this.getExpression()} and markup: ${template.innerHTML
				}`
			);
		}

		const valueFn: () => any = isDefined(valueExpression)
			? () => this.mediate(valueExpression).get()
			: this.getValueFn();

		return hasComponentId
			? new EmbeddedComponentFactoryImpl(this.getModule(), componentId, moduleId, this.getParent(), this.getParentId())
			: new factory(this.getModule(), template.innerHTML.trim(), this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn(), valueFn);
	}
}

Factories.register("each", ["*"], Each);

export default Each;
