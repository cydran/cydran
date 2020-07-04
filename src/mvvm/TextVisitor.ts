import TextElementMediator from "@/element/TextElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import { createCommentOffDom, createTextNodeOffDom } from "@/util/DomUtils";
import Mvvm from "@/mvvm/Mvvm";
import ElementVisitor from "@/dom/ElementVisitor";

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
		const sections: string[] = source.split(/(\{\{|\}\})/);

		if (sections.length < 2) {
			return [node];
		}

		let inside: boolean = false;

		const collected: Node[] = [];

		for (const section of sections) {
			switch (section) {
				case "{{":
					inside = true;
					break;

				case "}}":
					inside = false;
					break;

				default:
					if (inside) {
						const beginComment: Comment = createCommentOffDom("#");
						collected.push(beginComment);
						const textNode: Text = createTextNodeOffDom(section);
						textNode.textContent = "";
						this.addTextElementMediator(section, textNode, context);
						collected.push(textNode);
						const endComment: Comment = createCommentOffDom("#");
						collected.push(endComment);
					} else {
						const textNode: Text = createTextNodeOffDom(section);
						collected.push(textNode);
					}
					break;
			}
		}

		return collected;
	}

	private addTextElementMediator(expression: string, el: Text, context: Mvvm): void {
		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: "Text",
			module: context.getModule()
		};

		const elementMediator: TextElementMediator = new TextElementMediator(deps);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

}

export default TextVisitor;