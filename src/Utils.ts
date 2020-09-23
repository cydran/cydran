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
			readyList[i].fn.apply(readyList[i].ctx, []);
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
		setTimeout(function() { callback.apply(context, []); }, 1);
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
import { isEqual, cloneDeep } from "@/CloneEquals";
import { NullValueError, ValidationError, InvalidTypeError } from "@/Errors";
import { SimpleMap } from "@/Interfaces";

const encodeHtmlMap: any = {
	'"': "&quot;",
	"&": "&amp;",
	"'": "&#39;",
	"<": "&lt;",
	">": "&gt;"
};

function lookupEncodeHtmlMap(key: string): string {
	return encodeHtmlMap[key];
}

function encodeHtml(source: string): string {
	return (source === null) ? null : (source + "").replace(/[&"'<>]/g, lookupEncodeHtmlMap);
}

function isDefined(value: any): boolean {
	return value !== null && value !== undefined;
}

function requireNotNull<T>(value: T, name: string): T {
	if (value === null || value === undefined) {
		throw new NullValueError(`${ name } shall not be null`);
	}

	return value;
}

function requireValid(value: string, name: string, regex: RegExp): string {
	if (value === null || value === undefined) {
		throw new NullValueError(`${ name } shall not be null`);
	}

	if (!regex.test(value)) {
		throw new ValidationError(`${ name } must be valid`);
	}

	return value;
}

function requireType<T>(type: string, value: any, name: string): T {
	requireNotNull(value, name);

	const actualType: string = typeof value;

	if (actualType !== type) {
		throw new InvalidTypeError(`${ name } must be of type ${ type } but was ${ actualType }`);
	}

	return value;
}

function isType(type: string, obj: any): boolean {
	if (!isDefined(obj)) {
		return false;
	}

	const proto: any = Object.getPrototypeOf(obj);

	if (!isDefined(proto)) {
		return false;
	}

	if (!isDefined(proto.constructor)) {
		return false;
	}

	if (!isDefined(proto.constructor.name)) {
		return false;
	}

	if (proto.constructor.name === "Object") {
		return false;
	}

	if (proto.constructor.name === type) {
		return true;
	}

	return isType(type, proto);
}

function requireObjectTypeInternal<T>(type: string, value: any, name: string): T {
	requireNotNull(value, name);

	if (typeof value !== "object") {
		throw new InvalidTypeError(`${ name } is not an object but was ${ (typeof value) }`);
	}

	if (!isType(type, value)) {
		throw new InvalidTypeError(`${ name } must be of type ${ type }`);
	}

	return value;
}

let strictTypeChecksEnabled: boolean = false;

function requireObjectType<T>(type: string, value: any, name: string): T {
	return strictTypeChecksEnabled ? requireObjectTypeInternal(type, value, name) : requireNotNull(value, name);
}

function setStrictTypeChecksEnabled(value: boolean): void {
	strictTypeChecksEnabled = !!value;
}

function clone(limit: number, source: any) {
	return cloneDeep(limit, source);
}

function equals(limit: number, first: any, second: any): boolean {
	return isEqual(limit, first, second);
}

function merge<T>(sources: any[], customizers?: SimpleMap<(currentValue: any, overlayValue: any) => any>): T {
	requireNotNull(sources, "sources");

	return overlay({} as T, sources, customizers);
}

function overlay<T>(target: T, sources: any[], customizers?: SimpleMap<(currentValue: any, overlayValue: any) => any>): T {
	requireNotNull(target, "target");
	requireNotNull(sources, "sources");

	if (isDefined(customizers)) {
		for (const source of sources) {
			if (!isDefined(source)) {
				continue;
			}

			for (const name in source) {
				if (!source.hasOwnProperty(name)) {
					continue;
				}

				if (!isDefined(source[name])) {
					continue;
				}

				const customizer: (currentValue: any, overlayValue: any) => any = customizers[name];

				target[name] = isDefined(customizer) ? customizer(target[name], source[name]) : source[name];
			}
		}
	} else {
		for (const source of sources) {
			if (!isDefined(source)) {
				continue;
			}

			for (const name in source) {
				if (!source.hasOwnProperty(name)) {
					continue;
				}

				if (!isDefined(source[name])) {
					continue;
				}

				target[name] = source[name];
			}
		}
	}

	return target;
}
function extractParams<T>(tagName: string, el: HTMLElement): T {
	const result: any = {};

	// tslint:disable-next-line
	for (let i = 0; i < el.children.length; i++) {
		const child: HTMLElement = el.children[i] as HTMLElement;

		if (child.tagName.toLowerCase() === tagName.toLowerCase()) {
			const paramName: string = child.getAttribute("name");
			const paramValue: string = child.getAttribute("value");
			result[paramName] = paramValue;
		}
	}

	return result;
}

function extractAttributes<T>(prefix: string, el: HTMLElement): T {
	const result: any = {};
	const lowerCasePrefix: string = prefix.toLowerCase() + ":";

	// tslint:disable-next-line
	for (let i = 0; i < el.attributes.length; i++) {
		const attribute: Attr = el.attributes[i] as Attr;

		const name: string = attribute.name.toLowerCase();

		if (name.indexOf(lowerCasePrefix) === 0) {
			const paramName: string = name.slice(lowerCasePrefix.length);
			const paramValue: string = attribute.value;
			result[paramName] = paramValue;
		}
	}

	return result;
}

function startsWith(specimen: string, expected: string): boolean {
	return (specimen.indexOf(expected) === 0);
}

function endsWith(specimen: string, expected: string): boolean {
	const actualIndex: number = specimen.indexOf(expected);
	const expectedIndex: number = specimen.length - expected.length;

	return (actualIndex === expectedIndex);
}

function removeFromBeginning(input: string, removed: string): string {
	if (!startsWith(input, removed)) {
		return input;
	}

	return input.substring(removed.length);
}

function trim(input: string, prefix: string, suffix: string): string {
	const result: string = (input.length > 4 && input.indexOf(prefix) === 0 && input.indexOf(suffix, input.length - 2) !== -1)
		? input.substring(2, input.length - 2)
		: input;

	return result;
}

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

function uuidV4() {
	const chars = CHARS;
	const uuid = new Array(36);
	let rnd = 0;
	let r = null;

	for (let i: number = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid[i] = '-';
		} else if (i === 14) {
			uuid[i] = '4';
		} else {
			if (rnd <= 0x02) {
				rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
			}

			r = rnd & 0xf;
			rnd = rnd >> 4;
			uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
		}
	}

	return uuid.join('');
}

export {
	uuidV4,
	startsWith,
	removeFromBeginning,
	endsWith,
	trim,
	extractParams,
	extractAttributes,
	clone,
	equals,
	requireNotNull,
	requireValid,
	requireType,
	requireObjectType,
	isDefined,
	encodeHtml,
	setStrictTypeChecksEnabled,
	merge,
	overlay,
	domReady,
	createElementOffDom,
	createCommentOffDom,
	createDocumentFragmentOffDom,
	createTextNodeOffDom,
	extractAttribute,
	elementAsString,
	getDocument,
	getWindow
};
