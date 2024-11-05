import { JSType } from "CydranConstants";
import { isDefined, requireNotNull } from 'util/Utils';

class ReadyState {

	private readyList: any;

	private readyFired;

	private readyEventHandlersInstalled;

	private windowInstance: Window;

	constructor(windowInstance: Window) {
		this.windowInstance = requireNotNull(windowInstance, "windowInstance");
		this.readyList = [];
		this.readyFired = false;
		this.readyEventHandlersInstalled = false;
	}

	public onReady(callback?: any, thisObject?: Object): void {
		if (typeof callback !== JSType.FN) {
			throw new TypeError("callback for docReady(fn) must be a function");
		}

		if (this.getDocument().readyState === "complete") {
			callback.apply(thisObject, []);
			return;
		}

		// if ready has already fired, then just schedule the callback
		// to fire asynchronously, but right away
		if (this.readyFired) {
			setTimeout(function() { callback.apply(thisObject, []); }, 1);
			return;
		} else {
			// add the function and thisObject to the list
			this.readyList.push({ fn: callback, ctx: thisObject });
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

	private ready(): void {
		if (!this.readyFired) {
			// this must be set to true before we start calling callbacks
			this.readyFired = true;

			// eslint:disable-next-line
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

	private readyStateChange(): void {
		if (this.getDocument().readyState === "complete") {
			this.ready();
		}
	}

	private getDocument(): Document {
		return this.getWindow().document;
	}

	private getWindow(): Window {
		return this.windowInstance;
	}

}

class DomUtils {

	private static windowInstance: Window;

	private static disconnectedDocument: Document;

	public static getDocument(): Document {
		return DomUtils.getWindow().document;
	}

	public static getWindow(): Window {
		return DomUtils.windowInstance;
	}

	public static createElement<E extends HTMLElement>(tagName: string): E {
		return DomUtils.disconnectedDocument.createElement(tagName) as E;
	}

	public static createComment(content: string): Comment {
		return DomUtils.disconnectedDocument.createComment(content);
	}

	public static createDocumentFragment(): DocumentFragment {
		return DomUtils.disconnectedDocument.createDocumentFragment();
	}

	public static createTextNode(text: string): Text {
		return DomUtils.disconnectedDocument.createTextNode(text);
	}

	public static elementIsFocused(element: HTMLElement): boolean {
		const activeElement: HTMLElement = DomUtils.getDocument().activeElement as HTMLElement;

		return isDefined(element) ? element.contains(activeElement) : false;
	}

	public static onReady(callback?: any, thisObject?: Object): void {
		new ReadyState(DomUtils.windowInstance).onReady(callback, thisObject);
	}
	
	public static setWindow(windowInstance: Window): void {
		DomUtils.windowInstance = isDefined(windowInstance) ? windowInstance : window;
		DomUtils.disconnectedDocument = DomUtils.getDocument().implementation.createHTMLDocument("");
	}

}

DomUtils.setWindow(null);

export default DomUtils;
