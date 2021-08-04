import ElementVisitor from "element/visitor/ElementVisitor";
import { ComponentInternals } from "internals/Shuttle";
import ElementMediatorDependencies from "mediator/ElementMediatorDependencies";
import { createCommentOffDom, createTextNodeOffDom } from "util/Utils";
import ElementMediator from "mediator/ElementMediator";
import TextElementMediator from "mediator/TextElementMediator";
import MediatorTransition from "mediator/MediatorTransitions";
import ParserState from "element/visitor/ParserState";

class TextVisitor implements ElementVisitor<Text, ComponentInternals> {

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
				const beginComment: Comment = createCommentOffDom("#");
				collected.push(beginComment);
				const textNode: Text = createTextNodeOffDom(section);
				textNode.textContent = "";
				this.addTextElementMediator(section, textNode, context, mutable);
				collected.push(textNode);
				const endComment: Comment = createCommentOffDom("#");
				collected.push(endComment);
			} else {
				const textNode: Text = createTextNodeOffDom(section);
				collected.push(textNode);
			}
		}

		return collected;
	}

	private addTextElementMediator(expression: string, el: Text, context: ComponentInternals, mutable: boolean): void {
		const deps: ElementMediatorDependencies = {
			parent: context,
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			mediatorPrefix: "Text",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const elementMediator: ElementMediator<string, Text, any> = new TextElementMediator();
		elementMediator.tell(MediatorTransition.INIT, deps);
		context.addMediator(elementMediator);
	}
}

export default TextVisitor;
