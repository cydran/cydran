import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import Attributes from "component/Attributes";
import AttributeBehavior from "behavior/core/AttributeBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import EventBehavior from "behavior/EventBehavior";
import { startsWith, endsWith, trim, elementAsString, requireNotNull, extractAttributeNames } from "util/Utils";
import { MalformedOnEventError, TemplateError } from "error/Errors";
import BehaviorFlags from "behavior/BehaviorFlags";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import FormBehavior from "behavior/core/FormBehavior";
import { Context } from "context/Context";
import Registry from "registry/Registry";

class OtherVisitor implements ElementVisitor<HTMLElement, ComponentInternals> {

	private context: Context;

	constructor(context: Context) {
		this.context = requireNotNull(context, "context");
	}

	public visit(element: HTMLElement, internals: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: Attributes = internals.getExtractor();
		const names: string[] = extractAttributeNames(element);

		let shouldConsumeChildren: boolean = true;

		if (element.tagName.toLowerCase() === "form") {
			internals.addForm(element as HTMLFormElement);
			this.addFormBehavior(element, internals);
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
					throw new MalformedOnEventError(`Event expressor '${ eventName }' MUST correspond to a valid event in the runtime environment`);
				}

				this.addEventBehavior(eventName.toLowerCase(), this.trimExpression(expression), element, internals);
			} else if (extractor.isBehaviorAttribute(name)) {
				const behaviorType: string = extractor.extractBehaviorName(name);
				const mutable: boolean = !(startsWith(expression, "[[") && endsWith(expression, "]]"));
				const consumeChildrenAllowed = this.addBehavior(elName, behaviorType, this.trimExpression(expression), element, topLevel, internals, mutable);

				if (!consumeChildrenAllowed) {
					shouldConsumeChildren = false;
				}
			} else if (expression.length > 4 && startsWith(expression, "{{") && endsWith(expression, "}}")) {
				this.addAttributeBehavior(name, this.trimExpression(expression), element, internals, true);
			} else if (expression.length > 4 && startsWith(expression, "[[") && endsWith(expression, "]]")) {
				this.addAttributeBehavior( name, this.trimExpression(expression), element, internals, false);
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

	private addEventBehavior(eventName: string, expression: string, el: HTMLElement, internals: ComponentInternals): void {
		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: el,
			expression: expression,
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: "Event",
			validated: internals.isValidated(),
			mutable: true
		};

		const behavior: EventBehavior = new EventBehavior(eventName);
		behavior.tell(BehaviorTransitions.INIT, dependencies);

		if (internals.isValidated()) {
			behavior.tell("validate");
		}

		behavior.tell(BehaviorTransitions.MOUNT);
		internals.addBehavior(behavior);
	}

	private addFormBehavior(el: HTMLElement, internals: ComponentInternals): void {

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: el,
			expression: "",
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: "",
			validated: internals.isValidated(),
			mutable: false
		};

		const behavior: Behavior<any, HTMLElement, any> = new FormBehavior();

		behavior.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(behavior);
	}


	private addBehavior(
		tag: string,
		type: string,
		expression: string,
		el: HTMLElement,
		topLevel: boolean,
		internals: ComponentInternals,
		mutable: boolean
	): boolean {
		const behaviorPrefix: string = internals.getExtractor().asTypePrefix(type);

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: el,
			expression: expression,
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: behaviorPrefix,
			validated: internals.isValidated(),
			mutable: mutable
		};

		let behavior: Behavior<any, HTMLElement, any> = null;

		const registry: Registry = this.context.getRegistry();
		const specificName: string = "cydran:behavior:" + type + ":" + tag;
		const wildcardName: string = "cydran:behavior:" + type + ":*";

		if (registry.hasRegistration(specificName)) {
			behavior = registry.getObject(specificName, [el]);
		} else if (registry.hasRegistration(wildcardName)) {
			behavior = registry.getObject(wildcardName, [el]);
		} else {
			throw new TemplateError(`Unsupported tag: ${tag} for behavior ${type}: ${internals.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)}`);
		}

		if (topLevel && behavior.isFlagged(BehaviorFlags.ROOT_PROHIBITED)) {
			throw new TemplateError(`${internals.getExtractor().asTypePrefix(type)} on tag ${elementAsString(el)} is not supported on top level component tags.`);
		}

		behavior.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(behavior);

		return !behavior.isFlagged(BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED);
	}

	private addAttributeBehavior(attributeName: string, expression: string, el: HTMLElement, internals: ComponentInternals, mutable: boolean): void {
		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: el,
			expression: expression,
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: "Event",
			validated: internals.isValidated(),
			mutable: mutable
		};

		const behavior: AttributeBehavior = new AttributeBehavior(attributeName);
		behavior.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(behavior);
	}
}

export default OtherVisitor;
