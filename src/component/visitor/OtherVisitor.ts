import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Attributes from "component/Attributes";
import AttributeBehavior from "behavior/AttributeBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import EventBehavior from "behavior/EventBehavior";
import { startsWith, endsWith, trim, elementAsString } from "util/Utils";
import { MalformedOnEventError } from "error/Errors";
import { TemplateError } from "error/Errors";
import Type from "interface/Type";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorFlags from "behavior/BehaviorFlags";
import BehaviorTransitions from "behavior/BehaviorTransitions";

class OtherVisitor implements ElementVisitor<HTMLElement, ComponentInternals> {

	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger(OtherVisitor.name);
	}

	public visit(element: HTMLElement, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: Attributes = context.getExtractor();
		const attributes: NamedNodeMap = element.attributes;
		const length: number = attributes.length;
		const names: string[] = [];

		for (let i = 0; i < length; i++) {
			names.push(attributes[i].name);
		}

		let shouldConsumeChildren: boolean = true;

		for (const name of names) {
			if (!element.hasAttribute(name)) {
				continue;
			}

			const expression: string = element.getAttribute(name);

			if (extractor.isEventAttribute(name)) {
				element.removeAttribute(name);
				const eventName: string = extractor.extractEventName(name);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(`Event expressor '${ eventName }' MUST correspond to a valid event in the target environment`);
				}

				this.addEventBehavior(eventName.toLowerCase(), this.trimExpression(expression), element, context);
			} else if (extractor.isBehaviorAttribute(name)) {
				const behaviorType: string = extractor.extractBehaviorName(name);
				const mutable: boolean = !(startsWith(expression, "[[") && endsWith(expression, "]]"));
				const consumeChildrenAllowed = this.addBehavior(elName, behaviorType, this.trimExpression(expression), element, topLevel, context, mutable);

				if (!consumeChildrenAllowed) {
					shouldConsumeChildren = false;
				}
			} else if (expression.length > 4 && startsWith(expression, "{{") && endsWith(expression, "}}")) {
				this.addAttributeBehavior(name, this.trimExpression(expression), element, context, true);
			} else if (expression.length > 4 && startsWith(expression, "[[") && endsWith(expression, "]]")) {
				this.addAttributeBehavior( name, this.trimExpression(expression), element, context, false);
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

	private addEventBehavior(eventName: string, expression: string, el: HTMLElement, context: ComponentInternals): void {
		const deps: BehaviorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: true
		};

		const behavior: EventBehavior = new EventBehavior();
		behavior.setEventKey(eventName);
		behavior.tell(BehaviorTransitions.INIT, deps);

		if (context.isValidated()) {
			behavior.tell("validate");
		}

		behavior.tell("populate");
		behavior.tell(BehaviorTransitions.MOUNT);
		context.addBehavior(behavior);
	}

	private addBehavior(tag: string,
		type: string, expression: string, el: HTMLElement, topLevel: boolean, context: ComponentInternals, mutable: boolean): boolean {

		const behaviorPrefix: string = context.getExtractor().asTypePrefix(type);

		const deps: BehaviorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: behaviorPrefix,
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		let behaviorClass: Type<Behavior<any, HTMLElement, any>> = null;

		try {
			behaviorClass = BehaviorsRegistry.lookup(type, tag);
		} catch (e) {
			throw new TemplateError(`${e.message}: ${context.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)}`);
		}

		const behavior: Behavior<any, HTMLElement, any> = new behaviorClass(deps);

		if (topLevel && behavior.isFlagged(BehaviorFlags.ROOT_PROHIBITED)) {
			throw new TemplateError(`${context.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)} is not supported on top level component tags.`);
		}

		behavior.tell(BehaviorTransitions.INIT, deps);
		behavior.tell("populate"); // TODO - Remove populate concept
		context.addBehavior(behavior);

		if (behavior.isFlagged(BehaviorFlags.PROPAGATION)) {
			context.addPropagatingBehavior(behavior);
		}

		return !behavior.isFlagged(BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED);
	}

	private addAttributeBehavior(attributeName: string, expression: string, el: HTMLElement, context: ComponentInternals, mutable: boolean): void {
		const deps: BehaviorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const behavior: AttributeBehavior = new AttributeBehavior();
		behavior.setAttributeName(attributeName);
		behavior.tell(BehaviorTransitions.INIT, deps);
		context.addBehavior(behavior);
	}
}

export default OtherVisitor;
