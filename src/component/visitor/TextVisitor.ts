import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import TextBehavior from "behavior/TextBehavior";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import ParserState from "component/visitor/ParserState";
import { requireNotNull } from 'util/Utils';
import DomOperations from "dom/DomOperations";

class TextVisitor implements ElementVisitor<Text, ComponentInternals> {

	private domOperations: DomOperations;

	constructor(domOperations: DomOperations) {
		this.domOperations = requireNotNull(domOperations, "domOperations");
	}

	public visit(element: Text, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const result: Node[] = this.splitChild(element, context);

		if (result.length > 1) {
			for (const newNode of result) {
				element.parentNode.insertBefore(newNode, element);
			}

			element.remove();
		}
	}

	private splitChild(node: Node, context: ComponentInternals): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\}|\[\[|\]\])/);

		if (sections.length < 2) {
			return [node];
		}

		let state: number = ParserState.OUTSIDE;

		const collected: Node[] = [];

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
				const beginComment: Comment = this.domOperations.createCommentOffDom("#");
				collected.push(beginComment);
				const textNode: Text = this.domOperations.createTextNodeOffDom(section);
				textNode.textContent = "";
				this.addTextBehavior(section, textNode, context, mutable);
				collected.push(textNode);
				const endComment: Comment = this.domOperations.createCommentOffDom("#");
				collected.push(endComment);
			} else {
				const textNode: Text = this.domOperations.createTextNodeOffDom(section);
				collected.push(textNode);
			}
		}

		return collected;
	}

	private addTextBehavior(expression: string, el: Text, context: ComponentInternals, mutable: boolean): void {
		const deps: BehaviorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: "Text",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable,
			domOperations: this.domOperations
		};

		const behavior: Behavior<string, Text, any> = new TextBehavior();
		behavior.tell(BehaviorTransitions.INIT, deps);
		context.addBehavior(behavior);
	}
}

export default TextVisitor;
