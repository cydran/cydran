import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Behavior from "behavior/Behavior";
import TextBehavior from "behavior/core/TextBehavior";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import ParserState from "component/visitor/ParserState";
import DomUtils from "dom/DomUtils";
import { HASH, LSB, LSQ, RSB, RSQ } from "Tokens";

class TextVisitor implements ElementVisitor<Text, ComponentInternals> {

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

		for (const section of sections) {
			if (state === ParserState.OUTSIDE && section === LSQ) {
				state = ParserState.INSIDE_CURLY;
			} else if (state === ParserState.OUTSIDE && section === LSB) {
				state = ParserState.INSIDE_SQUARE;
			} else if (state === ParserState.INSIDE_CURLY && section === RSQ) {
				state = ParserState.OUTSIDE;
			} else if (state === ParserState.INSIDE_SQUARE && section === RSB) {
				state = ParserState.OUTSIDE;
			} else if (state === ParserState.INSIDE_CURLY || state === ParserState.INSIDE_SQUARE) {
				const mutable: boolean = state === ParserState.INSIDE_CURLY;
				const beginComment: Comment = DomUtils.createComment(HASH);
				collected.push(beginComment);
				const textNode: Text = DomUtils.createTextNode(section);
				textNode.textContent = "";
				this.addTextBehavior(section, textNode, internals, mutable);
				collected.push(textNode);
				const endComment: Comment = DomUtils.createComment(HASH);
				collected.push(endComment);
			} else {
				const textNode: Text = DomUtils.createTextNode(section);
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
			validated: internals.isValidated(),
			mutable: mutable
		};

		const behavior: Behavior<string, Text, any> = new TextBehavior();
		behavior.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(behavior);
	}
}

export default TextVisitor;
