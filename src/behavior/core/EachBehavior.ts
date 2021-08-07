import AbstractBehavior from "behavior/AbstractBehavior";
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
import BehaviorSource from "behavior/BehaviorSource";
import Validators from "validator/Validators";
import EmbeddedComponentFactoryImpl from "component/EmbeddedComponentFactoryImpl";
import { equals,	createDocumentFragmentOffDom, elementAsString, isDefined } from "util/Utils";
import { asIdentity } from "util/AsFunctions";
import { VALID_ID } from "Constants";
import { AmbiguousMarkupError, TemplateError } from "error/Errors";
import Factories from "internals/Factories";
import BehaviorFlags from "behavior/BehaviorFlags";
import Attrs from "const/AttrsFields";
import EachIdStrategies from "behavior/core/EachIdStrategies";
import EachTemplateType from "behavior/core/EachTemplateType";
import EachAttributes from "behavior/core/EachAttributes";
import TemplateAliases from "behavior/TemplateAliases";
import TagNames from "const/TagNames";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";

class Each extends AbstractBehavior<any[], HTMLElement, Params> {

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

	private readonly msgMust: string = "must have only";
	private readonly msgMidPrimary: string = `one child <template ${ this.getPrefix() }type="`;
	private readonly msgZeroOne: string = `${ this.msgMust } zero or ${ this.msgMidPrimary }`;
	private readonly msgEnd: string = `"> node/element.`;

	private readonly IF_BODY_SUPPLIED: string = "if a template body is supplied";
	private readonly CONSUME_DIGEST_CANDIDATES: string = "consumeDigestionCandidates";

	private alternatives: {
		test: Evaluator;
		factory: ComponentFactory;
	}[];

	private populationComplete: boolean;

	constructor() {
		super(asIdentity);
		this.idStrategy = null;
		this.populationComplete = false;
		this.setFlag(BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED);
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
		this.localScope.add(TemplateAliases.M, modelFn);
		this.localScope.add(TemplateAliases.V, itemFn);

		this.getMediator().watch(this, this.onTargetChange);
		const idKey: string = this.getParams().idkey || DEFAULT_ID_KEY;
		const idExpression: string = this.getParams().expression;
		const mode: string = this.getParams().mode || null;

		switch (mode) {
			case EachIdStrategies.GENERATED:
				this.idStrategy = new GeneratedIdStrategyImpl(idKey);
				break;

			case EachIdStrategies.NONE:
				this.idStrategy = new NoneIdStrategyImpl(idKey);
				break;

			case EachIdStrategies.EXPRESSION:
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
			const type: string = this.getExtractor().extract(template, Attrs.TYPE);

			switch (type) {
				case EachTemplateType.EMPTY:
					this.empty = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.FIRST:
					this.first = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.AFTER:
					this.last = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.ALT:
					const expression: string = this.getExtractor().extract(template, Attrs.TEST);
					this.alternatives.push({
						factory: this.createFactory(template, ItemComponentFactoryImpl),
						test: new Evaluator(expression, this.localScope)
					});

					break;

				case EachTemplateType.ITEM:
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

	public requestBehaviorSources(sources: BehaviorSource[]): void {
		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.tell(this.CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.first) {
			this.first.tell(this.CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.last) {
			this.last.tell(this.CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.empty) {
			this.empty.tell(this.CONSUME_DIGEST_CANDIDATES, sources);
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
				const workingEl: HTMLElement | DocumentFragment = this.elIsSelect ? el : createDocumentFragmentOffDom();

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

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		const pfx: string = `${ this.getBehaviorPrefix() }${ ATTRIBUTE_DELIMITER }`;

		check(`${ pfx }${ EachAttributes.MODE }`, this.getParams().mode)
			.isDefined()
			.oneOf(EachIdStrategies.NONE, EachIdStrategies.GENERATED, EachIdStrategies.EXPRESSION)
			.requireIfEquals(EachIdStrategies.EXPRESSION, `${ pfx }${ EachAttributes.EXPRESSION }`, this.getParams().expression);

		check(`${ pfx }${ EachAttributes.IDKEY }`, this.getParams().idkey).notEmpty();
		check(`${ pfx }${ EachAttributes.EXPRESSION }`, this.getParams().expression).notEmpty();

		let primaryTemplateCount: number = 0;
		let firstTemplateCount: number = 0;
		let afterTemplateCount: number = 0;
		let emptyTemplateCount: number = 0;

		if (this.getEl().children.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < this.getEl().children.length; i++) {
				const child: HTMLElement = this.getEl().children[i] as HTMLElement;

				if (child.tagName.toLowerCase() !== TagNames.TEMPLATE) {
					check(elementAsString(child)).reject(`not allowed when the parent element has a ${pfx} attribute present as part of a Cydran component template`);
					continue;
				}

				const template: HTMLTemplateElement = child as HTMLTemplateElement;
				switch(this.getExtractor().extract(template, Attrs.TYPE).toLowerCase()) {
					case EachTemplateType.ITEM:
						primaryTemplateCount++;
						break;
					case EachTemplateType.FIRST:
						firstTemplateCount++;
						break;
					case EachTemplateType.AFTER:
						afterTemplateCount++;
						break;
					case EachTemplateType.EMPTY:
						emptyTemplateCount++;
						break;
					default:
						break;
				}

				const elemAsStrPhrase: String = ` attribute on ${ elementAsString(template) }`;

				check(this.getExtractor().asTypePrefix(Attrs.TYPE) + elemAsStrPhrase, this.getExtractor()
					.extract(template, Attrs.TYPE))
					.isDefined()
					.oneOf(EachTemplateType.EMPTY,
						EachTemplateType.FIRST,
						EachTemplateType.AFTER,
						EachTemplateType.ALT,
						EachTemplateType.ITEM)
					.requireIfEquals(
						EachTemplateType.ALT, this.getExtractor().asTypePrefix(Attrs.TEST),
						this.getExtractor().extract(template, Attrs.TEST)
					);

				check(this.getExtractor().asTypePrefix(Attrs.COMPONENT) + elemAsStrPhrase, this.getExtractor().extract(template, Attrs.COMPONENT))
					.requireIfTrue(template.content.childElementCount === 0)
					.disallowIfTrue(template.content.childElementCount > 0, this.IF_BODY_SUPPLIED)
					.matches(VALID_ID);

				check(this.getExtractor().asTypePrefix(Attrs.MODULE) + elemAsStrPhrase, this.getExtractor().extract(template, Attrs.MODULE))
					.disallowIfTrue(template.content.childElementCount > 0, this.IF_BODY_SUPPLIED)
					.matches(VALID_ID);
			}

			if (primaryTemplateCount !== 1) {
				const msgCountReject: string = `${ this.msgMust } ${ this.msgMidPrimary }${ EachTemplateType.ITEM }${ this.msgEnd }`;
				check(elementAsString(this.getEl())).reject(msgCountReject);
			}

			if (firstTemplateCount > 1) {
				const msgCountReject: string = `${ this.msgZeroOne }${ EachTemplateType.FIRST }${ this.msgEnd }`;
				check(elementAsString(this.getEl())).reject(msgCountReject);
			}

			if (afterTemplateCount > 1) {
				const msgCountReject: string = `${ this.msgZeroOne }${ EachTemplateType.AFTER }${ this.msgEnd }`;
				check(elementAsString(this.getEl())).reject(msgCountReject);
			}

			if (emptyTemplateCount > 1) {
				const msgCountReject: string = `${ this.msgZeroOne }${ EachTemplateType.EMPTY }${ this.msgEnd }`;
				check(elementAsString(this.getEl())).reject(msgCountReject);
			}
		}
	}

	private create(item: any): Nestable {
		let factory: ComponentFactory = this.itemFactory;

		if (!factory) {
			throw new TemplateError(`template structure for an ${ Each.name } structure is incorrect or incomplete`);
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
		const componentId: string = this.getExtractor().extract(template, Attrs.COMPONENT);
		const moduleId: string = this.getExtractor().extract(template, Attrs.MODULE);
		const valueExpression: string = this.getExtractor().extract(template, Attrs.VALUE);
		const hasComponentId: boolean = isDefined(componentId) && componentId.trim().length > 0;

		// TODO - Eliminate redundant validation, if possible

		if (template.content.childElementCount > 0 && hasComponentId) {
			throw new AmbiguousMarkupError(`ambiguous component definition in template for ${ Each.name } on expression: ${ this.getExpression() } and markup: ${ template.innerHTML }`
			);
		}

		if (template.content.childElementCount > 1) {
			throw new AmbiguousMarkupError(`template definitions must only have one top-level tag in repeat on expression: ${ this.getExpression() } and markup: ${ template.innerHTML }`
			);
		}

		const valueFn: () => any = isDefined(valueExpression) ? () => this.mediate(valueExpression).get() : this.getValueFn();

		return hasComponentId
			? new EmbeddedComponentFactoryImpl(this.getModule(), componentId, moduleId, this.getParent(), this.getParentId())
			: new factory(this.getModule(), template.innerHTML.trim(), this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn(), valueFn);
	}
}

Factories.register("each", ["*"], Each);

export default Each;
