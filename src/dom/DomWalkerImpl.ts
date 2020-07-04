import SimpleMap from "@/pattern/SimpleMap";
import ElementVisitor from "@/dom/ElementVisitor";
import DomWalker from "@/dom/DomWalker";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import ValidationError from "@/error/ValidationError";
import { TEXT_NODE_TYPE, ELEMENT_NODE_TYPE, COMMENT_NODE_TYPE } from "@/constant/Constants";
import UnknownElementError from "@/error/UnknownElementError";

class DomWalkerImpl<C> implements DomWalker<C> {

	private visitors: SimpleMap<ElementVisitor<HTMLElement, C>>;

	private defaultVisitor: ElementVisitor<HTMLElement, C>;

	private textVisitor: ElementVisitor<Text, C>;

	private commentVisitor: ElementVisitor<Comment, C>;

	constructor() {
		this.visitors = {};
	}

	public walk(root: HTMLElement, context: C): void {
		const pending: (HTMLElement | Text | Comment)[] = [root];
		const consumer = (element: HTMLElement | Text | Comment) => pending.push(element);

		let topLevel: boolean = true;

		while (pending.length > 0) {
			const element: (HTMLElement | Text | Comment) = pending.pop();

			switch (element.nodeType) {
				case TEXT_NODE_TYPE:
					this.processText(element as Text, context, consumer, topLevel);
					break;

				case ELEMENT_NODE_TYPE:
					this.processElement(element as HTMLElement, context, consumer, topLevel);
					break;

				case COMMENT_NODE_TYPE:
					this.processComment(element as Comment, context, consumer, topLevel);
					break;
			}

			topLevel = false;
		}
	}

	public addVisitor(tagName: string, visitor: ElementVisitor<HTMLElement | Text | Comment, C>): void {
		const key: string = requireNotNull(tagName, "tagName").toLowerCase();
		requireNotNull(visitor, "visitor");

		if (isDefined(this.visitors[key])) {
			throw new ValidationError("Visitor for " + key + " is already registered");
		}

		this.visitors[key] = visitor;
	}

	public setTextVisitor(visitor: ElementVisitor<Text, C>): void {
		this.textVisitor = visitor;
	}

	public setCommentVisitor(visitor: ElementVisitor<Comment, C>): void {
		this.commentVisitor = visitor;
	}

	public setDefaultVisitor(visitor: ElementVisitor<HTMLElement, C>): void {
		this.defaultVisitor = visitor;
	}

	private processText(element: Text, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (isDefined(this.textVisitor)) {
			this.textVisitor.visit(element, context, consumer, topLevel);
		}
	}

	private processComment(element: Comment, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (isDefined(this.commentVisitor)) {
			this.commentVisitor.visit(element as Comment, context, consumer, topLevel);
		}
	}

	private processElement(element: HTMLElement, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const htmlElement: HTMLElement = element as HTMLElement;
		const tagName: string = htmlElement.tagName.toLowerCase();
		const visitor: ElementVisitor<HTMLElement, C> = this.visitors[tagName];

		if (isDefined(visitor)) {
			visitor.visit(htmlElement, context, consumer, topLevel);
		} else if (isDefined(this.defaultVisitor)) {
				this.defaultVisitor.visit(htmlElement, context, consumer, topLevel);
		} else {
			// tslint:disable-next-line
			for (let i = 0; i < element.childNodes.length; i++) {
				consumer(element.childNodes[i] as HTMLElement | Text | Comment);
			}
		}
	}

}

export default DomWalkerImpl;
