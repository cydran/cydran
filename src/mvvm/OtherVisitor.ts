import AttributeElementMediator from "@/element/AttributeElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import Mvvm from "@/mvvm/Mvvm";
import Type from "@/type/Type";
import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import SimpleMap from "@/pattern/SimpleMap";
import EventElementMediator from "@/element/EventElementMediator";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import LoggerFactory from "@/logger/LoggerFactory";
import Logger from "@/logger/Logger";
import ElementVisitor from "@/dom/ElementVisitor";
import AttributeExtractor from "@/mvvm/AttributeExtractor";
import { isDefined } from "@/util/ObjectUtils";

class OtherVisitor implements ElementVisitor<HTMLElement, Mvvm> {

	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger("OtherVisitor");
	}

	public visit(element: HTMLElement, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		// TODO - Only store a single prefix field

		// tslint:disable-next-line
		for (let i = 0; i < element.childNodes.length; i++) {
			consumer(element.childNodes[i] as HTMLElement | Text | Comment);
		}

		const EVT_NAME_ERR = "Event expressor \'%eventName%\' MUST correspond to a valid event in the target environment: \'";
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: AttributeExtractor = context.getExtractor();
		const elementName: string = extractor.extract(element, "name");

		if (isDefined(elementName)) {
			context.addNamedElement(elementName, element);
			extractor.remove(element, "name");
		}

		const attributes: NamedNodeMap = element.attributes;
		const length: number = attributes.length;
		const names: string[] = [];

		for (let i = 0; i < length; i++) {
			names.push(attributes[i].name);
		}

		for (const name of names) {
			const expression: string = element.getAttribute(name);

			if (extractor.isEventAttribute(name)) {
				const eventName: string = extractor.extractEventName(name);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(EVT_NAME_ERR, { "%eventName%": eventName });
				}

				this.addEventElementMediator(eventName.toLowerCase(), this.trimExpression(expression), element, context);
				element.removeAttribute(name);
			} else if (extractor.isMediatorAttribute(name)) {
				const elementMediatorType: string = extractor.extractMediatorName(name);
				this.addElementMediator(elName, elementMediatorType, this.trimExpression(expression), element, topLevel, context);
				element.removeAttribute(name);
			} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
				this.addAttributeElementMediator(name, this.trimExpression(expression), element, context);
			}
		}
	}

	private trimExpression(input: string): string {
		const result: string = (input.length > 4 && input.indexOf("{{") === 0 && input.indexOf("}}", input.length - 2) !== -1)
			? input.substring(2, input.length - 2)
			: input;

		return result;
	}

	private addEventElementMediator(eventName: string, expression: string, el: HTMLElement, context: Mvvm): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated()
		};

		const elementMediator: EventElementMediator = new EventElementMediator(deps);
		elementMediator.setEventKey(eventName);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

	private addElementMediator(tag: string, elementMediatorType: string, attributeValue: string, el: HTMLElement, topLevel: boolean, context: Mvvm): void {
		const tags: SimpleMap<Type<ElementMediator<any, HTMLElement, any>>> = Factories.get(elementMediatorType);
		const mediatorPrefix: string = context.getExtractor().asTypePrefix(elementMediatorType);
		const prefix: string = context.getExtractor().getPrefix();

		let elementMediator: ElementMediator<any, HTMLElement, any> = null;

		if (!tags) {
			return;
		}

		let elementMediatorClass: Type<ElementMediator<any, HTMLElement, any>> = tags[tag];

		if (!elementMediatorClass) {
			elementMediatorClass = tags["*"];
		}

		if (!elementMediatorClass) {
			this.logger.error("Unsupported tag: " + tag + " for elementMediator " + elementMediatorType + ".");
			return;
		}

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: attributeValue,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: mediatorPrefix,
			module: context.getModule(),
			validated: context.isValidated()
		};

		elementMediator = new elementMediatorClass(deps);

		if (topLevel && !elementMediator.isTopLevelSupported()) {
			this.logger.error("Element mediator " + elementMediatorType + " not supported on top level component tags.");
			return;
		}

		elementMediator.init();
		context.addMediator(elementMediator);

		if (elementMediator.hasPropagation()) {
			context.addPropagatingElementMediator(elementMediator);
		}
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement, context: Mvvm): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated()
		};

		const elementMediator: AttributeElementMediator = new AttributeElementMediator(deps);
		elementMediator.setAttributeName(attributeName);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

}

export default OtherVisitor;
