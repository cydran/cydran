import AbstractBehavior from "behavior/AbstractBehavior";
import EachAttributes from "behavior/core/each/EachAttributes";
import SimpleMap from "interface/SimpleMap";
import Nestable from "interface/ables/Nestable";
import ScopeImpl from "scope/ScopeImpl";
import ComponentFactory from "component/ComponentFactory";
import IdStrategy from "behavior/core/each/IdStrategy";
import Evaluator from "eval/Evaluator";
import DEFAULT_ID_KEY from "const/DefaultIdKey";
import GeneratedIdStrategyImpl from "behavior/core/each/GeneratedIdStrategyImpl";
import ExpressionIdStrategyImpl from "behavior/core/each/ExpressionIdStrategyImpl";
import NoneIdStrategyImpl from "behavior/core/each/NoneIdStrategyImpl";
import InvalidIdStrategyImpl from "behavior/core/each/InvalidIdStrategyImpl";
import UtilityComponentFactoryImpl from "component/UtilityComponentFactoryImpl";
import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import BehaviorSource from "behavior/BehaviorSource";
import Validators from "validator/Validators";
import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import { equals, createDocumentFragmentOffDom, elementAsString, isDefined } from "util/Utils";
import { VALID_ID } from "Constants";
import { AmbiguousMarkupError, TemplateError } from "error/Errors";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorFlags from "behavior/BehaviorFlags";
import Attrs from "const/AttrsFields";
import EachIdStrategies from "behavior/core/each/EachIdStrategies";
import EachTemplateType from "behavior/core/each/EachTemplateType";
import TemplateAliases from "behavior/TemplateAliases";
import TagNames from "const/TagNames";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";
import { validateDefined, validateNotEmpty, validateOneOf } from 'validator/Validations';
import OldValidator from 'validator/OldValidator';
import OldValidatorImpl from "validator/OldValidatorImpl";
import ComponentTransitions from "component/ComponentTransitions";

const IF_BODY_SUPPLIED: string = "if a template body is supplied";
const CONSUME_DIGEST_CANDIDATES: string = "consumeDigestionCandidates";

const DEFAULT_ATTRIBUTES: EachAttributes = {
	mode: "generated",
	idkey: DEFAULT_ID_KEY,
	expression: null
};

class Each extends AbstractBehavior<any[], HTMLElement, EachAttributes> {

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

	constructor() {
		super();
		this.setFlag(BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED);
		this.setDefaults(DEFAULT_ATTRIBUTES);
		this.setValidations({
			idkey: [validateDefined, validateNotEmpty],
			expression: [validateNotEmpty],
			mode: [validateDefined, validateOneOf('none', 'generated', 'expression')]
		});
	}

	public onInit(): void {
		this.elIsSelect = this.getEl().tagName.toLowerCase() === "select";
		const validator: OldValidator = new OldValidatorImpl();
		const check: (name: string, value?: any) => Validators = validator.getFunction();
		this.validate(this.getEl(), check);
		validator.throwIfErrors(() => "Something really broke");
	}

	public onMount(): void {
		this.initFields();
		this.initScope();
		this.initIdStrategy();
		this.parseChildElements();
		this.onTargetChange(null, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	public onDispose(): void {
		if (this.empty) {
			this.empty.tell(ComponentTransitions.UNMOUNT);
			this.empty.$dispose();
		}

		if (this.first) {
			this.first.tell(ComponentTransitions.UNMOUNT);
			this.first.$dispose();
		}

		if (this.last) {
			this.last.tell(ComponentTransitions.UNMOUNT);
			this.last.$dispose();
		}

		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.tell(ComponentTransitions.UNMOUNT);
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
			component.tell(CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.first) {
			this.first.tell(CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.last) {
			this.last.tell(CONSUME_DIGEST_CANDIDATES, sources);
		}

		if (this.empty) {
			this.empty.tell(CONSUME_DIGEST_CANDIDATES, sources);
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

		if (!equals(10, this.ids, newIds)) {
			const newMap: SimpleMap<Nestable> = {};
			const components: Nestable[] = [];

			for (const item of items) {
				const id: string = this.idStrategy.extract(item);
				const component: Nestable = this.map[id] ? this.map[id] : this.create(item);
				component.tell(ComponentTransitions.MOUNT);
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
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		const pfx: string = `${ this.getBehaviorPrefix() }${ ATTRIBUTE_DELIMITER }`;

		check(`${ pfx }mode`, this.getParams().mode)
			.isDefined()
			.requireIfEquals('expression', `${ pfx }expression`, this.getParams().expression);

		let primaryTemplateCount: number = 0;
		let firstTemplateCount: number = 0;
		let afterTemplateCount: number = 0;
		let emptyTemplateCount: number = 0;

		const el: HTMLElement = this.getEl();

		if (el.children.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < el.children.length; i++) {
				const child: HTMLElement = el.children[i] as HTMLElement;

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
					.disallowIfTrue(template.content.childElementCount > 0, IF_BODY_SUPPLIED)
					.matches(VALID_ID);

				check(this.getExtractor().asTypePrefix(Attrs.MODULE) + elemAsStrPhrase, this.getExtractor().extract(template, Attrs.MODULE))
					.disallowIfTrue(template.content.childElementCount > 0, IF_BODY_SUPPLIED)
					.matches(VALID_ID);
			}

			if (primaryTemplateCount !== 1) {
				const msgCountReject: string = `must have only one child <template ${ this.getPrefix() }type="${ EachTemplateType.ITEM }"> node/element.`;
				check(elementAsString(el)).reject(msgCountReject);
			}

			if (firstTemplateCount > 1) {
				const msgCountReject: string = `must have only zero or one child <template ${ this.getPrefix() }type="${ EachTemplateType.FIRST }"> node/element.`;
				check(elementAsString(el)).reject(msgCountReject);
			}

			if (afterTemplateCount > 1) {
				const msgCountReject: string = `must have only zero or one child <template ${ this.getPrefix() }type="${ EachTemplateType.AFTER }"> node/element.`;
				check(elementAsString(el)).reject(msgCountReject);
			}

			if (emptyTemplateCount > 1) {
				const msgCountReject: string = `must have only zero or one child <template ${ this.getPrefix() }type="${ EachTemplateType.EMPTY }"> node/element.`;
				check(elementAsString(el)).reject(msgCountReject);
			}
		}
	}

	private initFields(): void {
		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemFactory = null;
		this.alternatives = [];
	}

	private initScope(): void {
		this.localScope = new ScopeImpl(false);
		const modelFn: () => any = () => this.getModelFn();
		const itemFn: () => any = () => this.scopeItem;
		this.localScope.setParent(this.getParent().scope() as ScopeImpl);
		this.localScope.add(TemplateAliases.M, modelFn);
		this.localScope.add(TemplateAliases.V, itemFn);
	}

	private initIdStrategy(): void {
		switch (this.getParams().mode) {
			case EachIdStrategies.GENERATED:
				this.idStrategy = new GeneratedIdStrategyImpl(this.getParams().idkey);
				break;

			case EachIdStrategies.NONE:
				this.idStrategy = new NoneIdStrategyImpl(this.getParams().idkey);
				break;

			case EachIdStrategies.EXPRESSION:
				this.idStrategy = new ExpressionIdStrategyImpl(this.getParams().expression);
				break;

			default:
				this.idStrategy = new InvalidIdStrategyImpl();
		}

		this.idStrategy.init();
	}

	private parseChildElements(): void {
		const children: HTMLCollection = this.getEl().children;

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if (TagNames.TEMPLATE !== child.nodeName.toLowerCase()) {
				continue;
			}

			const template: HTMLTemplateElement = child as HTMLTemplateElement;
			const type: string = this.getExtractor().extract(template, Attrs.TYPE);

			switch (type) {
				case EachTemplateType.EMPTY:
					this.empty = this.createFactory(template, UtilityComponentFactoryImpl).create();
					this.empty.tell(ComponentTransitions.MOUNT);
					break;

				case EachTemplateType.FIRST:
					this.first = this.createFactory(template, UtilityComponentFactoryImpl).create();
					this.first.tell(ComponentTransitions.MOUNT);
					break;

				case EachTemplateType.AFTER:
					this.last = this.createFactory(template, UtilityComponentFactoryImpl).create();
					this.last.tell(ComponentTransitions.MOUNT);
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

BehaviorsRegistry.register("each", ["*"], Each);

export default Each;
