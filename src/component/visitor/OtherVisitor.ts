import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import Attributes from "component/Attributes";
import AttributeBehavior from "behavior/core/AttributeBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import EventBehavior from "behavior/EventBehavior";
import { startsWith, endsWith, trim, elementAsString, requireNotNull, extractAttributeNames } from "util/Utils";
import { MalformedOnEventError } from "error/Errors";
import { TemplateError } from "error/Errors";
import Type from "interface/Type";
import BehaviorFlags from "behavior/BehaviorFlags";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import CydranContext from "context/CydranContext";
import FormBehavior from "behavior/core/FormBehavior";

class OtherVisitor implements ElementVisitor<HTMLElement, ComponentInternals> {

	private cydranContext: CydranContext;

	constructor(cydranContext: CydranContext) {
		this.cydranContext = requireNotNull(cydranContext, "cydranContext");
	}

	public visit(element: HTMLElement, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: Attributes = context.getExtractor();
		const names: string[] = extractAttributeNames(element);

		let shouldConsumeChildren: boolean = true;

		if (element.tagName.toLowerCase() === "form") {
			context.addForm(element as HTMLFormElement);
			this.addFormBehavior(element, context);
		}

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
			mutable: true,
			cydranContext: this.cydranContext
		};

		const behavior: EventBehavior = new EventBehavior(eventName);
		behavior.tell(BehaviorTransitions.INIT, deps);

		if (context.isValidated()) {
			behavior.tell("validate");
		}

		behavior.tell(BehaviorTransitions.MOUNT);
		context.addBehavior(behavior);
	}

	private addFormBehavior(el: HTMLElement, context: ComponentInternals): void {

		const deps: BehaviorDependencies = {
			parent: context,
			el: el,
			expression: "",
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: "",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: false,
			cydranContext: this.cydranContext
		};

		const behavior: Behavior<any, HTMLElement, any> = new FormBehavior();

		behavior.tell(BehaviorTransitions.INIT, deps);
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
			mutable: mutable,
			cydranContext: this.cydranContext
		};

		let behaviorClass: Type<Behavior<any, HTMLElement, any>> = null;

		try {
			behaviorClass = this.cydranContext.getBehaviorsRegistry().lookup(el, type, tag);
		} catch (e) {
			throw new TemplateError(`${e.message}: ${context.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)}`);
		}

		const behavior: Behavior<any, HTMLElement, any> = new behaviorClass();

		if (topLevel && behavior.isFlagged(BehaviorFlags.ROOT_PROHIBITED)) {
			throw new TemplateError(`${context.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)} is not supported on top level component tags.`);
		}

		behavior.tell(BehaviorTransitions.INIT, deps);
		context.addBehavior(behavior);

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
			mutable: mutable,
			cydranContext: this.cydranContext
		};

		const behavior: AttributeBehavior = new AttributeBehavior(attributeName);
		behavior.tell(BehaviorTransitions.INIT, deps);
		context.addBehavior(behavior);
	}
}

export default OtherVisitor;
