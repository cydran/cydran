import EachTemplateAttributes from "behavior/core/each/EachTemplateAttributes";
import EachTemplateType from "behavior/core/each/EachTemplateType";
import Messages from "util/Messages";
import { ATTRIBUTE_DELIMITER, Attrs, TagNames } from 'CydranConstants';
import { TemplateError } from 'error/Errors';
import Evaluator from "eval/Evaluator";
import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import UtilityComponentFactoryImpl from "component/UtilityComponentFactoryImpl";
import EachState from "behavior/core/each/EachState";
import { elementAsString, requireNotNull } from 'util/Utils';
import AttributeParserConfig from "validator/AttributeParserConfig";
import AttributeParserConfigImpl from "validator/AttributeParserConfigImpl";
import { validateDefined, validateDefinedIf, validateNotDefinedIf, validateNotEmptyString, validateNotNullIfFieldEquals, validateOneOf, validateValidContextName, validateValidObjectId } from 'validator/Validations';
import { msg } from "behavior/core/each/Bundle";
import EachConfig from "behavior/core/each/EachConfig";
import ComponentFactory from "component/ComponentFactory";
import AttributeParser from "validator/AttributeParser";
import AttributeParserImpl from "validator/AttributeParserImpl";

const TEMPLATE_ATTRIBUTE_PARSER_CONFIG: AttributeParserConfig<EachTemplateAttributes> = new AttributeParserConfigImpl<EachTemplateAttributes>();

TEMPLATE_ATTRIBUTE_PARSER_CONFIG.setDefaults({
	type: null,
	test: null,
	component: null,
	context: null,
	value: null
});

TEMPLATE_ATTRIBUTE_PARSER_CONFIG.setValidations({
	type: [
		validateDefined,
		validateOneOf(EachTemplateType.EMPTY, EachTemplateType.FIRST, EachTemplateType.LAST, EachTemplateType.ALT, EachTemplateType.ITEM)
	],
	test: [validateNotEmptyString, validateNotNullIfFieldEquals(Attrs.TYPE, EachTemplateType.ALT)],
	component: [
		validateValidObjectId,
		validateDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount === 0, "template body was not supplied"),
		validateNotDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount > 0, "template body was supplied")
	],
	context: [
		validateValidContextName,
		validateNotDefinedIf((template: HTMLTemplateElement) => template.content.childElementCount > 0, "template body was supplied")
	]
});

type CreateFactoryFn = (template: HTMLTemplateElement, params: EachTemplateAttributes, factory: any) => ComponentFactory;

class EachChildParser {

	private state: EachState;

	private config: EachConfig;

	private createFactoryFn: CreateFactoryFn;

	private attributeParser: AttributeParser<EachTemplateAttributes>

	constructor(state: EachState, config: EachConfig, createFactoryFn: CreateFactoryFn) {
		this.state = requireNotNull(state, "state");
		this.config = requireNotNull(config, "config");
		this.createFactoryFn = requireNotNull(createFactoryFn, "createFactoryFn");
		this.attributeParser = new AttributeParserImpl<EachTemplateAttributes>();
	}

	public parse(element: HTMLElement, validated: boolean): void {
		requireNotNull(element, "element");
		requireNotNull(validated, "validated");

		const children: NodeListOf<ChildNode> = element.childNodes;
		let primaryCount: number = 0;
		let firstCount: number = 0;
		let lastCount: number = 0;
		let emptyCount: number = 0;

		const errors: Messages = new Messages(`Element with attribute ${this.config.getBehaviorPrefix()} is invalid`);

		// eslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if (child.nodeType === Node.COMMENT_NODE) {
				continue;
			}

			if (child.nodeType === Node.TEXT_NODE && (child as Text).textContent.trim().length === 0) {
				continue;
			}

			if (child.nodeType === Node.TEXT_NODE && (child as Text).textContent.trim().length > 0) {
				errors.add(msg("non-white-space", this.config.getPrefix(), (child as Text).textContent.trim()));
				continue;
			}

			if (child.nodeType !== Node.ELEMENT_NODE || TagNames.TEMPLATE !== child.nodeName.toLowerCase()) {
				errors.add(msg("other-than-template", this.config.getPrefix()));
				continue;
			}

			const template: HTMLTemplateElement = child as HTMLTemplateElement;

			if (template.content.childElementCount > 1) {
				errors.add(msg("one-top-level", this.config.getExpression(), template.innerHTML));
				continue;
			}

			const tagText: string = validated ? elementAsString(template) : null;
			const params: EachTemplateAttributes = this.attributeParser.parse(TEMPLATE_ATTRIBUTE_PARSER_CONFIG, template, this.config.getPrefix(), validated, tagText);

			switch (params.type) {
				case EachTemplateType.EMPTY:
					++emptyCount;
					this.state.setEmpty(this.createFactoryFn(template, params, UtilityComponentFactoryImpl).create());
					break;

				case EachTemplateType.FIRST:
					++firstCount;
					this.state.setFirst(this.createFactoryFn(template, params, UtilityComponentFactoryImpl).create());
					break;

				case EachTemplateType.LAST:
					++lastCount;
					this.state.setLast(this.createFactoryFn(template, params, UtilityComponentFactoryImpl).create());
					break;

				case EachTemplateType.ALT:
					this.state.addAlternative({
						factory: this.createFactoryFn(template, params, ItemComponentFactoryImpl),
						test: new Evaluator(params.test, this.state.getLocalScope())
					});

					break;

				case EachTemplateType.ITEM:
					++primaryCount;
					this.state.setItemFactory(this.createFactoryFn(template, params, ItemComponentFactoryImpl));
					break;
			}
		}

		errors.addIf(primaryCount !== 1, () => msg("only-one-message", this.config.getPrefix(), ATTRIBUTE_DELIMITER, EachTemplateType.ITEM));
		errors.addIf(firstCount > 1, () => msg("only-zero-or-one-message", this.config.getPrefix(), ATTRIBUTE_DELIMITER, EachTemplateType.FIRST));
		errors.addIf(lastCount > 1, () => msg("only-zero-or-one-message", this.config.getPrefix(), ATTRIBUTE_DELIMITER, EachTemplateType.LAST));
		errors.addIf(emptyCount > 1, () => msg("only-zero-or-one-message", this.config.getPrefix(), ATTRIBUTE_DELIMITER, EachTemplateType.EMPTY));

		errors.ifMessages((message) => {
			throw new TemplateError(message);
		});
	}

}

export default EachChildParser;
