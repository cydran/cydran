import Dom from "dom/Dom";
import { isDefined } from "util/Utils";

class DomImpl implements Dom {

	private windowInstance: Window;

	private disconnectedDocument: Document;

	private readyList: any;

	private readyFired;

	private readyEventHandlersInstalled;

	constructor(windowInstance?: Window) {
		this.readyList = [];
		this.readyFired = false;
		this.readyEventHandlersInstalled = false;
		this.windowInstance = isDefined(windowInstance) ? windowInstance : window;
		this.disconnectedDocument = this.getDocument().implementation.createHTMLDocument("");
	}

	public getDocument(): Document {
		return this.getWindow().document;
	}

	public getWindow(): Window {
		return this.windowInstance;
	}

	public createElement<E extends HTMLElement>(tagName: string): E {
		return this.disconnectedDocument.createElement(tagName) as E;
	}

	public createComment(content: string): Comment {
		return this.disconnectedDocument.createComment(content);
	}

	public createDocumentFragment(): DocumentFragment {
		return this.disconnectedDocument.createDocumentFragment();
	}

	public createTextNode(text: string): Text {
		return this.disconnectedDocument.createTextNode(text);
	}

	public onReady(callback?: any, context?: any) {
		if (typeof callback !== "function") {
			throw new TypeError("callback for docReady(fn) must be a function");
		}

		if (this.getDocument().readyState === "complete") {
			callback.apply(context, []);
			return;
		}

		// if ready has already fired, then just schedule the callback
		// to fire asynchronously, but right away
		if (this.readyFired) {
			setTimeout(function() { callback.apply(context, []); }, 1);
			return;
		} else {
			// add the function and context to the list
			this.readyList.push({ fn: callback, ctx: context });
		}

		// if document already ready to go, schedule the ready function to run
		// IE only safe when readyState is "complete", others safe when readyState is "interactive"
		if (this.getDocument().readyState === "complete" || (!this.getDocument()["attachEvent"] && this.getDocument().readyState === "interactive")) {
			setTimeout(() => this.ready(), 1);
		} else if (!this.readyEventHandlersInstalled) {
			// otherwise if we don't have event handlers installed, install them
			if (this.getDocument().addEventListener) {
				// first choice is DOMContentLoaded event
				this.getDocument().addEventListener("DOMContentLoaded", () => this.ready(), false);
				// backup is window load event
				this.getWindow().addEventListener("load", () => this.ready(), false);
			} else {
				// must be IE
				this.getDocument()["attachEvent"]("onreadystatechange", () => this.readyStateChange());
				this.getWindow()["attachEvent"]("onload", () => this.ready());
			}

			this.readyEventHandlersInstalled = true;
		}
	}

	private ready() {
		if (!this.readyFired) {
			// this must be set to true before we start calling callbacks
			this.readyFired = true;

			// tslint:disable-next-line
			for (let i = 0; i < this.readyList.length; i++) {
				// if a callback here happens to add new ready handlers,
				// the docReady() function will see that it already fired
				// and will schedule the callback to run right after
				// this event loop finishes so all handlers will still execute
				// in order and no new ones will be added to the readyList
				// while we are processing the list
				this.readyList[i].fn.apply(this.readyList[i].ctx, []);
			}

			// allow any closures held by these functions to free
			this.readyList = [];
		}
	}

	private readyStateChange() {
		if (this.getDocument().readyState === "complete") {
			this.ready();
		}
	}

}

export default DomImpl;
