import { isEqual, cloneDeep } from "util/CloneEquals";
import { NullValueError, ValidationError, InvalidTypeError } from "error/Errors";
import SimpleMap from "interface/SimpleMap";
import { JSType, ATTRIBUTE_DELIMITER, CYDRAN_RELEASE_FN_NAME } from "Constants";
import Releasable from "interface/ables/Releasable";

function compositeArray(text: string, values: string[]): string {
	let result: string = text;

	if (isDefined(text) && values.length > 0) {
		result = text.replace(/\{([1-9]\d*|0)\}/g, (key: string) => {
			const index: number = Number(key.slice(1, -1));
			return (index >= values.length) ? "UNDEFINED" : values[index];
		});
	}

	return result;
}

function composite(text: string, ...values: string[]): string {
	return compositeArray(text, values);
}

function removeChildElements(el: HTMLElement): void {
	while (el.firstChild) {
		el.removeChild(el.lastChild);
	}
}

function extractClassName(type: any): string {
	return isDefined(type) ? type?.constructor?.name: "null";
}

function extractAttribute(element: HTMLElement, prefix: string, name: string): string {
	if (!isDefined(element) || !isDefined(prefix) || !isDefined(name)) {
		return null;
	}

	const fullName: string = prefix + ATTRIBUTE_DELIMITER + name;

	return element.hasAttribute(fullName) ? element.getAttribute(fullName) : null;
}

function elementAsString(element: HTMLElement): string {
	const attributes: NamedNodeMap = element.attributes;
	const length: number = attributes.length;

	let result: string = "<";
	result += element.nodeName.toLowerCase();

	for (let i = 0; i < length; i++) {
		result += ` ${ attributes[i].name }="${ attributes[i].value }"`;
	}

	result += ">";

	return result;
}

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

function defaultTo<T>(value: T, defaultValue: T): T {
	return isDefined(value) ? value : defaultValue;
}

function defaultAsNull<T>(value: T): T {
	return isDefined(value) ? value : null;
}

function hasContents(value: string | any[]): boolean {
	return isDefined(value) && value.length > 0;
}

const SHALL_NOTBE_NULL: string = "shall not be null";

function requireNotNull<T>(value: T, name: string): T {
	if (value === null || value === undefined) {
		throw new NullValueError(`${ name } ${ SHALL_NOTBE_NULL }`);
	}

	return value;
}

function requireValid(value: string, name: string, regex: RegExp): string {
	if (value === null || value === undefined) {
		throw new NullValueError(`${ name } ${ SHALL_NOTBE_NULL }`);
	}

	if (!regex.test(value)) {
		throw new ValidationError(`${ name } must be valid`);
	}

	return value;
}

const MUST_BE_TYPE: string = "must be of type";

function requireType<T>(type: string, value: any, name: string): T {
	requireNotNull(value, name);

	const actualType: string = typeof value;

	if (actualType !== type) {
		throw new InvalidTypeError(`${ name } ${ MUST_BE_TYPE } ${ type } but was ${ actualType }`);
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

	if (typeof value !== JSType.OBJ) {
		throw new InvalidTypeError(`${ name } is not an object but was ${ (typeof value) }`);
	}

	if (!isType(type, value)) {
		throw new InvalidTypeError(`${ name } ${ MUST_BE_TYPE } ${ type }`);
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

function cloneShallow(source: any): any {
	if (!isDefined(source)) {
		return null;
	}

	const result: any = {};

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			result[key] = source[key];
		}
	}

	return result;
}

function equals(limit: number, first: any, second: any): boolean {
	return isEqual(limit, first, second);
}

function merge<T>(sources: any[], customizers?: SimpleMap<(currentValue: any, overlayValue: any) => any>): T {
	requireNotNull(sources, "sources");

	return overlay({} as T, sources, customizers);
}

function overlay<T>(destination: T, sources: any[], customizers?: SimpleMap<(currentValue: any, overlayValue: any) => any>): T {
	requireNotNull(destination, "destination");
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

				destination[name] = isDefined(customizer) ? customizer(destination[name], source[name]) : source[name];
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

				destination[name] = source[name];
			}
		}
	}

	return destination;
}

/**
 * Extracts the attribute names of an element in a way that attempts to be compatible with the various browser implementations.
 * @param element Element from which to extract the array of attribute names
 * @returns String array of attribute names
 */
 function extractAttributeNames(element: HTMLElement): string[] {
	return isDefined(element.getAttributeNames) ? element.getAttributeNames() : extractKeys(element.attributes);
}

function extractKeys(source: any): string[] {
	const result: string[] = [];

	for (const name in source) {
		if (source.hasOwnProperty(name)) {
			result.push(name);
		}
	}

	return result;
}

function extractAttributesWithPrefix<T>(prefix: string, element: HTMLElement): T {
	return (isDefined(element) && isDefined(element.attributes)) ? extractAvailableAttributesWithPrefix(prefix, element) : {} as T;
}

function extractAvailableAttributesWithPrefix<T>(prefix: string, element: HTMLElement): T {
	const result: any = {};
	const lowerCasePrefix: string = prefix.toLowerCase();
	const attributeNames: string[] = extractAttributeNames(element);
	const prefixLength: number = prefix.length;

	// eslint:disable-next-line
	for (let i = 0; i < attributeNames.length; i++) {
		const name: string = attributeNames[i];

		if (startsWith(name, lowerCasePrefix)) {
			const param: string = name.slice(prefixLength);
			const value: string = element.getAttribute(name);
			result[param] = value;
			element.removeAttribute(name);
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

function safeCydranDisposal(instance: any): void {
	if(!isDefined(instance)) {
		return;
	}
	const disposeFn: any = instance[CYDRAN_RELEASE_FN_NAME];
	if (isDefined(disposeFn) && typeof disposeFn === JSType.FN) {
		((instance as unknown) as Releasable).$release();
	}
}

function padLeft(text: string, desiredLength: number, padCharacter: string = " "): string {
	let result: string = isDefined(text) ? text : "";

	while (result.length < desiredLength) {
		result = padCharacter + result;
	}

	return result;
}

function padRight(text: string, desiredLength: number, padCharacter: string = " "): string {
	let result: string = isDefined(text) ? text : "";

	while (result.length < desiredLength) {
		result = result + padCharacter;
	}

	return result;
}

// This should be removed in a future iteration, as padLeft and padRight are explicit with regards to which side of the content is being padded
function padText(text: string, desiredLength: number): string {
	return padRight(text, desiredLength, " ");
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

function defaulted<T>(value: T, defaultValue: T): T {
	return isDefined(value) ? value : defaultValue;
}

function orNull<T>(value: T): T {
	return isDefined(value) ? value : null;
}

function insertNodeAfter(destinationNode: Node, addedNode: Node): void {
	destinationNode.parentElement.insertBefore(addedNode, destinationNode.nextSibling);
}

function forEachField(source: any, callback: (key: string, value: any) => void): void {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const value: any = source[key];
			callback(key, value);
		}
	}
}

function removeFromArray(source: any[], instance: any): void {
	if (!isDefined(source) || !isDefined(instance)) {
		return;
	}

	let index: number = source.indexOf(instance);

	while (index !== -1) {
		source.splice(index, 1);
		index = source.indexOf(instance);
	}
}

const ENTITIES_MAP: SimpleMap<string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};

function sanitize(value: any): any {
    return isDefined(value) ? value.replace(/[&<>"']/g, (key) =>  ENTITIES_MAP[key] ) : null;
}

function hasMethod(instance: any, methodName: string): boolean {
	return isDefined(instance) && typeof instance[methodName] === "function";
}

export {
	composite,
	compositeArray,
	uuidV4,
	startsWith,
	removeFromBeginning,
	endsWith,
	trim,
	extractClassName,
	extractAttributesWithPrefix,
	clone,
	equals,
	requireNotNull,
	requireValid,
	requireType,
	requireObjectType,
	isDefined,
	hasContents,
	encodeHtml,
	setStrictTypeChecksEnabled,
	merge,
	overlay,
	removeChildElements,
	extractAttribute,
	extractAttributeNames,
	extractKeys,
	elementAsString,
	safeCydranDisposal,
	padLeft,
	padRight,
	padText,
	enumKeys,
	defaulted,
	orNull,
	cloneShallow,
	insertNodeAfter,
	defaultTo,
	defaultAsNull,
	forEachField,
	removeFromArray,
	hasMethod,
	sanitize
};
