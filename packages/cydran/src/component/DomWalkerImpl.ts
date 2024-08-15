import SimpleMap from "interface/SimpleMap";
import DomWalker from "component/DomWalker";
import ElementVisitor from "component/visitor/ElementVisitor";
import { requireNotNull, isDefined } from "util/Utils";
import { ValidationError } from "error/Errors";
import QueueImpl from "pattern/QueueImpl";
import Queue from 'pattern/Queue';
import { Consumer } from 'interface/Predicate';

class DomWalkerImpl<C> implements DomWalker<C> {

	private visitors: SimpleMap<ElementVisitor<HTMLElement, C>>;

	private defaultVisitor: ElementVisitor<HTMLElement, C>;

	private textVisitor: ElementVisitor<Text, C>;

	private commentVisitor: ElementVisitor<Comment, C>;

	constructor(defaultVisitor: ElementVisitor<HTMLElement, C>, textVisitor: ElementVisitor<Text, C>, commentVisitor: ElementVisitor<Comment, C>) {
		this.visitors = {};
		this.defaultVisitor = requireNotNull(defaultVisitor, "defaultVisitor");
		this.textVisitor = requireNotNull(textVisitor, "textVisitor");
		this.commentVisitor = requireNotNull(commentVisitor, "commentVisitor");
	}

	public walk(root: HTMLElement, internals: C): void {
		const elements: Queue<HTMLElement | Text | Comment> = new QueueImpl<HTMLElement | Text | Comment>();
		elements.add(root);
		let topLevel: boolean = true;

		elements.transform((element: HTMLElement | Text | Comment, consumer: Consumer<HTMLElement | Text | Comment>) => {
			switch (element.nodeType) {
				case Node.TEXT_NODE:
					this.textVisitor.visit(element as Text, internals, consumer, topLevel);
					break;

				case Node.ELEMENT_NODE:
					this.processElement(element as HTMLElement, internals, consumer, topLevel);
					break;

				case Node.COMMENT_NODE:
					this.commentVisitor.visit(element as Comment, internals, consumer, topLevel);
					break;
			}

			topLevel = false;
		});
	}

	public addVisitor(tagName: string, visitor: ElementVisitor<HTMLElement | Text | Comment, C>): void {
		const key: string = requireNotNull(tagName, "tagName").toLowerCase();
		requireNotNull(visitor, "visitor");

		if (isDefined(this.visitors[key])) {
			throw new ValidationError(`Visitor for ${key} is already registered`);
		}

		this.visitors[key] = visitor;
	}

	private processElement(element: HTMLElement, internals: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const htmlElement: HTMLElement = element as HTMLElement;
		const tagName: string = htmlElement.tagName.toLowerCase();
		const visitor: ElementVisitor<HTMLElement, C> = this.visitors[tagName];

		if (isDefined(visitor)) {
			visitor.visit(htmlElement, internals, consumer, topLevel);
		} else if (isDefined(this.defaultVisitor)) {
			this.defaultVisitor.visit(htmlElement, internals, consumer, topLevel);
		} else {
			// tslint:disable-next-line
			for (let i = 0; i < element.childNodes.length; i++) {
				consumer(element.childNodes[i] as HTMLElement | Text | Comment);
			}
		}
	}

}

export default DomWalkerImpl;
