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
import DigestableSource from "behavior/DigestableSource";
import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import { equals, elementAsString, isDefined, removeChildElements } from "util/Utils";
import { TemplateError } from "error/Errors";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorFlags from "behavior/BehaviorFlags";
import Attrs from "const/AttrsFields";
import EachIdStrategies from "behavior/core/each/EachIdStrategies";
import EachTemplateType from "behavior/core/each/EachTemplateType";
import TemplateAliases from "behavior/TemplateAliases";
import TagNames from "const/TagNames";
import { validateDefined, validateDefinedIf, validateNotDefinedIf, validateAttribNotEmpty, validateNotNullIfFieldEquals, validateOneOf, validateValidId } from 'validator/Validations';
import ComponentTransitions from "component/ComponentTransitions";
import AttributeParser from 'validator/AttributeParser';
import EachTemplateAttributes from "behavior/core/each/EachTemplateAttributes";
import AttributeParserImpl from "validator/AttributeParserImpl";
import { NodeTypes } from "Constants";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";
import Messages from "util/Messages";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";

const DEFAULT_ATTRIBUTES: EachAttributes = {
	mode: "generated",
	idkey: DEFAULT_ID_KEY,
	expression: null
};

const TEMPLATE_ATTRIBUTE_PARSER: AttributeParser<EachTemplateAttributes> = new AttributeParserImpl<EachTemplateAttributes>();

TEMPLATE_ATTRIBUTE_PARSER.setDefaults({
	type: null,
	test: null,
	component: null,
	module: null,
	value: null
});

TEMPLATE_ATTRIBUTE_PARSER.setValidations({
	type: [
		validateDefined,
		validateOneOf(EachTemplateType.EMPTY, EachTemplateType.FIRST, EachTemplateType.AFTER, EachTemplateType.ALT, EachTemplateType.ITEM)
	],
	test: [validateAttribNotEmpty, validateNotNullIfFieldEquals(Attrs.TYPE, EachTemplateType.ALT)],
	component: [
		validateValidId,
		validateDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount === 0, "template body was not supplied"),
		validateNotDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount > 0, "template body was supplied")
	],
	module: [
		validateValidId,
		validateNotDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount > 0, "template body was supplied")
	]
});


class Each extends AbstractContainerBehavior<any[], HTMLElement, EachAttributes> {

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
			idkey: [validateDefined, validateAttribNotEmpty],
			expression: [validateAttribNotEmpty, validateNotNullIfFieldEquals("mode", "expression")],
			mode: [validateDefined, validateOneOf('none', 'generated', 'expression')]
		});
	}

	public onInit(): void {
		this.elIsSelect = this.getEl().tagName.toLowerCase() === "select";
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

		this.tellChildren(ComponentTransitions.MOUNT);
	}

	public onUnmount(): void {
		this.tellChildren(ComponentTransitions.UNMOUNT);
	}

	public onRemount(): void {
		this.tellChildren(ComponentTransitions.MOUNT);
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			sources.push(component);
		}

		if (this.first) {
			sources.push(this.first);
		}

		if (this.last) {
			sources.push(this.last);
		}

		if (this.empty) {
			sources.push(this.empty);
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
				newMap[id] = component;
				components.push(component);
				delete this.map[id];
			}

			for (const key in this.map) {
				if (this.map.hasOwnProperty(key)) {
					const component: Nestable = this.map[key];
					component.tell(ComponentTransitions.UNMOUNT);
					delete this.map[key];
				}
			}

			this.map = newMap;
			const el: HTMLElement = this.getEl();

			removeChildElements(el);

			if (components.length === 0) {
				if (this.empty) {
					el.appendChild(this.empty.getEl());
				}
			} else {
				const workingEl: HTMLElement | DocumentFragment = this.elIsSelect ? el : this.getDom().createDocumentFragment();

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
		const children: NodeListOf<ChildNode> = this.getEl().childNodes;
		const prefix: string = this.getPrefix();
		const validated: boolean = this.isValidated();

		let primaryCount: number = 0;
		let firstCount: number = 0;
		let afterCount: number = 0;
		let emptyCount: number = 0;

		const errors: Messages = new Messages("Element with attribute " + this.getBehaviorPrefix() + " is invalid");

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if (child.nodeType === NodeTypes.COMMENT) {
				continue;
			}

			if (child.nodeType === NodeTypes.TEXT && (child as Text).textContent.trim().length === 0) {
				continue;
			}

			if (child.nodeType === NodeTypes.TEXT && (child as Text).textContent.trim().length > 0) {
				errors.add(`Non-white space text are not allowed when the parent element has a ${prefix} attribute present on an element as part of a Cydran component template: ` + (child as Text).textContent.trim());
				continue;
			}

			if (child.nodeType !== NodeTypes.ELEMENT || TagNames.TEMPLATE !== child.nodeName.toLowerCase()) {
				errors.add(`Elements other than <template> are not allowed when the parent element has a ${prefix} attribute present on an element as part of a Cydran component template`);
				continue;
			}

			const template: HTMLTemplateElement = child as HTMLTemplateElement;

			if (template.content.childElementCount > 1) {
				errors.add(`template definitions must only have one top-level tag in repeat on expression: ${ this.getExpression() } and markup: ${ template.innerHTML }`);
				continue;
			}

			const tagText: string = validated ? elementAsString(template) : null;
			const params: EachTemplateAttributes = TEMPLATE_ATTRIBUTE_PARSER.parse(template, prefix, validated, tagText);

			switch (params.type) {
				case EachTemplateType.EMPTY:
					++emptyCount;
					this.empty = this.createFactory(template, params, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.FIRST:
					++firstCount;
					this.first = this.createFactory(template, params, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.AFTER:
					++afterCount;
					this.last = this.createFactory(template, params, UtilityComponentFactoryImpl).create();
					break;

				case EachTemplateType.ALT:
					this.alternatives.push({
						factory: this.createFactory(template, params, ItemComponentFactoryImpl),
						test: new Evaluator(params.test, this.localScope)
					});

					break;

				case EachTemplateType.ITEM:
					++primaryCount;
					this.itemFactory = this.createFactory(template, params, ItemComponentFactoryImpl);
					break;
			}
		}


		errors.addIf(primaryCount !== 1, () => `must have only one child <template ${this.getPrefix()}${ATTRIBUTE_DELIMITER}type="${ EachTemplateType.ITEM }"> node/element.`);
		errors.addIf(firstCount > 1, () => `must have only zero or one child <template ${this.getPrefix()}${ATTRIBUTE_DELIMITER}type="${ EachTemplateType.FIRST }"> node/element.`);
		errors.addIf(afterCount > 1, () => `must have only zero or one child <template ${this.getPrefix()}${ATTRIBUTE_DELIMITER}type="${ EachTemplateType.AFTER }"> node/element.`);
		errors.addIf(emptyCount > 1, () => `must have only zero or one child <template ${this.getPrefix()}${ATTRIBUTE_DELIMITER}type="${ EachTemplateType.EMPTY }"> node/element.`);

		errors.ifMessages((message) => {
			throw new TemplateError(message);
		});

		const el: HTMLElement = this.getEl();

		removeChildElements(el);

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

	private createFactory(template: HTMLTemplateElement, params: EachTemplateAttributes, factory: any): ComponentFactory {
		const valueFn: () => any = isDefined(params.value) ? () => this.mediate(params.value).get() : this.getValueFn();

		return isDefined(params.component)
			? new EmbeddedComponentFactoryImpl(this.getModule(), params.component, params.module, this.getParent())
			: new factory(this.getModule(), template.innerHTML.trim(), this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn(), valueFn);
	}

	private tellChildren(name: string, payload?: any): void {
		if (this.empty) {
			this.empty.tell(name, payload);
		}

		if (this.first) {
			this.first.tell(name, payload);
		}

		if (this.last) {
			this.last.tell(name, payload);
		}

		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.tell(name, payload);
		}
	}

}

BehaviorsRegistry.register("each", ["*"], Each);

export default Each;
