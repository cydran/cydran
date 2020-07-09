import { isDefined } from "@/util/ObjectUtils";
let offDomDoc: Document = null;

function getWindow(): Window {
	return window;
}

function getDocument(): Document {
	return getWindow().document;
}

function getOffDomDocument(): Document {
	if (!isDefined(offDomDoc)) {
		offDomDoc = getDocument().implementation.createHTMLDocument("");
	}

	return offDomDoc;
}

let readyList: any = [];
let readyFired = false;
let readyEventHandlersInstalled = false;

function ready() {
	if (!readyFired) {
		// this must be set to true before we start calling callbacks
		readyFired = true;

		// tslint:disable-next-line
		for (let i = 0; i < readyList.length; i++) {
			// if a callback here happens to add new ready handlers,
			// the docReady() function will see that it already fired
			// and will schedule the callback to run right after
			// this event loop finishes so all handlers will still execute
			// in order and no new ones will be added to the readyList
			// while we are processing the list
			readyList[i].fn.call(getWindow(), readyList[i].ctx);
		}
		// allow any closures held by these functions to free
		readyList = [];
	}
}

function readyStateChange() {
	if (getDocument().readyState === "complete") {
		ready();
	}
}

function domReady(callback?: any, context?: any) {
	if (typeof callback !== "function") {
		throw new TypeError("callback for docReady(fn) must be a function");
	}

	if (getDocument().readyState === "complete") {
		callback.apply(context, []);
		return;
	}

	// if ready has already fired, then just schedule the callback
	// to fire asynchronously, but right away
	if (readyFired) {
		setTimeout(function() { callback(context); }, 1);
		return;
	} else {
		// add the function and context to the list
		readyList.push({ fn: callback, ctx: context });
	}

	// if document already ready to go, schedule the ready function to run
	// IE only safe when readyState is "complete", others safe when readyState is "interactive"
	if (getDocument().readyState === "complete" || (!getDocument()["attachEvent"] && getDocument().readyState === "interactive")) {
		setTimeout(ready, 1);
	} else if (!readyEventHandlersInstalled) {
		// otherwise if we don't have event handlers installed, install them
		if (getDocument().addEventListener) {
			// first choice is DOMContentLoaded event
			getDocument().addEventListener("DOMContentLoaded", ready, false);
			// backup is window load event
			getWindow().addEventListener("load", ready, false);
		} else {
			// must be IE
			getDocument()["attachEvent"]("onreadystatechange", readyStateChange);
			getWindow()["attachEvent"]("onload", ready);
		}

		readyEventHandlersInstalled = true;
	}
}

function createElementOffDom<E extends HTMLElement>(tagName: string): E {
	return getOffDomDocument().createElement(tagName) as E;
}

function createCommentOffDom(content: string): Comment {
	return getOffDomDocument().createComment(content);
}

function createDocumentFragmentOffDom(): DocumentFragment {
	return getOffDomDocument().createDocumentFragment();
}

function createTextNodeOffDom(text: string): Text {
	return getOffDomDocument().createTextNode(text);
}

function extractAttribute(element: HTMLElement, prefix: string, name: string): string {
	if (!isDefined(element) || !isDefined(prefix) || !isDefined(name)) {
		return null;
	}

	const fullName: string = prefix + name;

	return element.hasAttribute(fullName) ? element.getAttribute(fullName) : null;
}

function elementAsString(element: HTMLElement): string {
	let result: string = "<";
	result += element.nodeName.toLowerCase();

	const attributes: NamedNodeMap = element.attributes;
	const length: number = attributes.length;

	for (let i = 0; i < length; i++) {
		result += " ";
		result += attributes[i].name;
		result += "=\"";
		result += attributes[i].value;
		result += "\"";
	}

	result += ">";

	return result;
}

export { domReady, createElementOffDom, createCommentOffDom, createDocumentFragmentOffDom, createTextNodeOffDom, extractAttribute, elementAsString };
