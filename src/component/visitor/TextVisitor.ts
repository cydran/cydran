import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import TextBehavior from "behavior/core/TextBehavior";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import ParserState from "component/visitor/ParserState";
import { requireNotNull } from 'util/Utils';
import Services from "service/Services";
import Dom from "dom/Dom";

class TextVisitor implements ElementVisitor<Text, ComponentInternals> {

	private services: Services;

	constructor(services: Services) {
		this.services = requireNotNull(services, "services");
	}

	public visit(element: Text, internals: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const result: Node[] = this.splitChild(element, internals);

		if (result.length > 1) {
			for (const newNode of result) {
				element.parentNode.insertBefore(newNode, element);
			}

			element.remove();
		}
	}

	private splitChild(node: Node, internals: ComponentInternals): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\}|\[\[|\]\])/);

		if (sections.length < 2) {
			return [node];
		}

		let state: number = ParserState.OUTSIDE;

		const collected: Node[] = [];

		const dom: Dom = this.services.getDom();

		for (const section of sections) {
			if (state === ParserState.OUTSIDE && section === "{{") {
				state = ParserState.INSIDE_CURLY;
			} else if (state === ParserState.OUTSIDE && section === "[[") {
				state = ParserState.INSIDE_SQUARE;
			} else if (state === ParserState.INSIDE_CURLY && section === "}}") {
				state = ParserState.OUTSIDE;
			} else if (state === ParserState.INSIDE_SQUARE && section === "]]") {
				state = ParserState.OUTSIDE;
			} else if (state === ParserState.INSIDE_CURLY || state === ParserState.INSIDE_SQUARE) {
				const mutable: boolean = state === ParserState.INSIDE_CURLY;
				const beginComment: Comment = dom.createComment("#");
				collected.push(beginComment);
				const textNode: Text = dom.createTextNode(section);
				textNode.textContent = "";
				this.addTextBehavior(section, textNode, internals, mutable);
				collected.push(textNode);
				const endComment: Comment = dom.createComment("#");
				collected.push(endComment);
			} else {
				const textNode: Text = dom.createTextNode(section);
				collected.push(textNode);
			}
		}

		return collected;
	}

	private addTextBehavior(expression: string, el: Text, internals: ComponentInternals, mutable: boolean): void {
		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: el,
			expression: expression,
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: "Text",
			context: internals.getContext(),
			validated: internals.isValidated(),
			mutable: mutable,
			services: this.services
		};

		const behavior: Behavior<string, Text, any> = new TextBehavior();
		behavior.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(behavior);
	}
}

export default TextVisitor;
