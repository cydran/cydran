import TextElementMediator from "@/element/TextElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import { createCommentOffDom, createTextNodeOffDom } from "@/util/DomUtils";
import Mvvm from "@/mvvm/Mvvm";
import ElementVisitor from "@/dom/ElementVisitor";
import ElementMediator from "@/element/ElementMediator";

const STATE_OUTSIDE: number = 0;
const STATE_INSIDE_CURLY: number = 1;
const STATE_INSIDE_SQUARE: number = 2;

class TextVisitor implements ElementVisitor<Text, Mvvm> {

	public visit(element: Text, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const result: Node[] = this.splitChild(element, context);

		if (result.length > 1) {
			for (const newNode of result) {
				element.parentNode.insertBefore(newNode, element);
			}

			element.remove();
		}
	}

	private splitChild(node: Node, context: Mvvm): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\}|\[\[|\]\])/);

		if (sections.length < 2) {
			return [node];
		}

		let state: number = STATE_OUTSIDE;

		const collected: Node[] = [];

		for (const section of sections) {
			if (state === STATE_OUTSIDE && section === "{{") {
				state = STATE_INSIDE_CURLY;
			} else if (state === STATE_OUTSIDE && section === "[[") {
				state = STATE_INSIDE_SQUARE;
			} else if (state === STATE_INSIDE_CURLY && section === "}}") {
				state = STATE_OUTSIDE;
			} else if (state === STATE_INSIDE_SQUARE && section === "]]") {
				state = STATE_OUTSIDE;
			} else if (state === STATE_INSIDE_CURLY || state === STATE_INSIDE_SQUARE) {
				const mutable: boolean = (state === STATE_INSIDE_CURLY);
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

	private addTextElementMediator(expression: string, el: Text, context: Mvvm, mutable: boolean): void {
		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			mediatorPrefix: "Text",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const elementMediator: ElementMediator<string, Text, any> = new TextElementMediator(deps);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

}

export default TextVisitor;
