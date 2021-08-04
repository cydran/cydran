import ElementVisitor from "element/visitor/ElementVisitor";
import { ComponentInternals } from "internals/Shuttle";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import AttributeExtractor from "element/AttributeExtractor";
import Attrs from "const/AttrsFields";
import AttributeElementMediator from "mediator/AttributeElementMediator";
import ElementMediatorDependencies from "mediator/ElementMediatorDependencies";
import ElementMediator from "mediator/ElementMediator";
import EventElementMediator from "mediator/core/EventElementMediator";
import { isDefined, startsWith, endsWith, trim, elementAsString } from "util/Utils";
import { MalformedOnEventError } from "error/Errors";
import SimpleMap from "interface/SimpleMap";
import { TemplateError } from "error/Errors";
import Type from "interface/Type";
import Factories from "internals/Factories";
import ElementMediatorFlags from "const/ElementMediatorFlags";
import MediatorTransition from "mediator/MediatorTransitions";

class OtherVisitor implements ElementVisitor<HTMLElement, ComponentInternals> {

	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger(OtherVisitor.name);
	}

	public visit(element: HTMLElement, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: AttributeExtractor = context.getExtractor();
		const elementName: string = extractor.extract(element, Attrs.ID);

		if (isDefined(elementName)) {
			context.addNamedElement(elementName, element);
			extractor.remove(element, Attrs.ID);
		}

		const attributes: NamedNodeMap = element.attributes;
		const length: number = attributes.length;
		const names: string[] = [];

		for (let i = 0; i < length; i++) {
			names.push(attributes[i].name);
		}

		let shouldConsumeChildren: boolean = true;

		for (const name of names) {
			const expression: string = element.getAttribute(name);

			if (extractor.isEventAttribute(name)) {
				const eventName: string = extractor.extractEventName(name);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(
						`Event expressor '${eventName}' MUST correspond to a valid event in the target environment`
					);
				}

				this.addEventElementMediator(
					eventName.toLowerCase(),
					this.trimExpression(expression),
					element,
					context
				);
				element.removeAttribute(name);
			} else if (extractor.isMediatorAttribute(name)) {
				const elementMediatorType: string = extractor.extractMediatorName(name);
				const mutable: boolean = !(
					startsWith(expression, "[[") && endsWith(expression, "]]")
				);
				shouldConsumeChildren = this.addElementMediator(
					elName,
					elementMediatorType,
					this.trimExpression(expression),
					element,
					topLevel,
					context,
					mutable
				);
				element.removeAttribute(name);
			} else if (
				expression.length > 4 &&
				expression.indexOf("{{") === 0 &&
				expression.indexOf("}}", expression.length - 2) !== -1
			) {
				this.addAttributeElementMediator(
					name,
					this.trimExpression(expression),
					element,
					context,
					true
				);
			} else if (
				expression.length > 4 &&
				expression.indexOf("[[") === 0 &&
				expression.indexOf("]]", expression.length - 2) !== -1
			) {
				this.addAttributeElementMediator(
					name,
					this.trimExpression(expression),
					element,
					context,
					false
				);
			}
		}

		if (shouldConsumeChildren) {
			this.consumeChildren(element, consumer);
		}
	}

	private consumeChildren(element: HTMLElement, consumer: (element: HTMLElement | Text | Comment) => void): void {
		// tslint:disable-next-line
		for (let i = 0; i < element.childNodes.length; i++) {
			consumer(element.childNodes[i] as HTMLElement | Text | Comment);
		}
	}

	private trimExpression(input: string): string {
		let result: string = trim(input, "{{", "}}");

		if (result === input) {
			result = trim(input, "[[", "]]");
		}

		return result;
	}

	private addEventElementMediator(
		eventName: string,
		expression: string,
		el: HTMLElement,
		context: ComponentInternals
	): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: true
		};

		const elementMediator: EventElementMediator = new EventElementMediator();
		elementMediator.setEventKey(eventName);
		elementMediator.tell(MediatorTransition.INIT, deps);

		// TODO - Make this use the property that indicates that validation is active
		// elementMediator.tell("validate");
		elementMediator.tell("populate");
		elementMediator.tell(MediatorTransition.MOUNT);
		context.addMediator(elementMediator);
	}

	private addElementMediator(tag: string,
		elementMediatorType: string,
		expression: string,
		el: HTMLElement,
		topLevel: boolean,
		context: ComponentInternals,
		mutable: boolean): boolean {

		if (elementMediatorType.indexOf(":") !== -1) {
			return;
		}

		const tags: SimpleMap<Type<ElementMediator<any, HTMLElement, any>>> = Factories.get(
			elementMediatorType
		);
		const mediatorPrefix: string = context
			.getExtractor()
			.asTypePrefix(elementMediatorType);
		const prefix: string = context.getExtractor().getPrefix();

		let elementMediator: ElementMediator<any, HTMLElement, any> = null;

		if (!isDefined(tags)) {
			throw new TemplateError(
				`Unsupported element mediator attribute: ${context
					.getExtractor()
					.asTypePrefix(elementMediatorType)} on tag ${elementAsString(el)}`
			);
		}

		let elementMediatorClass: Type<ElementMediator<any, HTMLElement, any>> = tags[tag];

		if (!isDefined(elementMediatorClass)) {
			elementMediatorClass = tags["*"];
		}

		if (!isDefined(elementMediatorClass)) {
			throw new TemplateError(
				`Unsupported tag: ${tag} for element mediator ${context
					.getExtractor()
					.asTypePrefix(elementMediatorType)} on tag ${elementAsString(el)}`
			);
		}

		const deps: ElementMediatorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: mediatorPrefix,
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		elementMediator = new elementMediatorClass(deps);

		if (topLevel && elementMediator.isFlagged(ElementMediatorFlags.ROOT_PROHIBITED)) {
			this.logger.error(`Element mediator ${elementMediatorType} not supported on top level component tags.`);
			return;
		}

		elementMediator.tell(MediatorTransition.INIT, deps);
		elementMediator.tell("populate");
		elementMediator.tell(MediatorTransition.MOUNT);
		context.addMediator(elementMediator);

		if (elementMediator.isFlagged(ElementMediatorFlags.PROPAGATION)) {
			context.addPropagatingElementMediator(elementMediator);
		}

		return !elementMediator.isFlagged(ElementMediatorFlags.CHILD_CONSUMPTION_PROHIBITED);
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement, context: ComponentInternals, mutable: boolean): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const elementMediator: AttributeElementMediator = new AttributeElementMediator();
		elementMediator.setAttributeName(attributeName);
		elementMediator.tell(MediatorTransition.INIT, deps);
		context.addMediator(elementMediator);
	}
}

export default OtherVisitor;
