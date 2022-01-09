import { isEqual, cloneDeep } from "util/CloneEquals";
import { NullValueError, ValidationError, InvalidTypeError } from "error/Errors";
import SimpleMap from "interface/SimpleMap";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";
import Type from "interface/Type";

function removeChildElements(el: HTMLElement): void {
	while (el.firstChild) {
		el.removeChild(el.lastChild);
	}
}

function extractClassName(type: any): string {
	return isDefined(type) ? type?.constructor?.name: "null";
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

	if (typeof value !== "object") {
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

function extractAttributes<T>(prefix: string, el: HTMLElement): T {
	return (isDefined(el) && isDefined(el.attributes)) ? extractAvailableAttributes(prefix, el) : {} as T;
}

function extractAvailableAttributes<T>(prefix: string, el: HTMLElement): T {
	const result: any = {};

	const lowerCasePrefix: string = prefix.toLowerCase();

	const attributeNames: string[] = [];

	// tslint:disable-next-line
	for (let i = 0; i < el.attributes.length; i++) {
		const attribute: Attr = el.attributes[i] as Attr;
		const name: string = attribute.name.toLowerCase();
		attributeNames.push(name);
	}

	const prefixLength: number = prefix.length;

	// tslint:disable-next-line
	for (let i = 0; i < attributeNames.length; i++) {
		const name: string = attributeNames[i];

		if (startsWith(name, lowerCasePrefix)) {
			const param: string = name.slice(prefixLength);
			const value: string = el.getAttribute(name);
			result[param] = value;
			el.removeAttribute(name);
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
	extractClassName,
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
	removeChildElements,
	extractAttribute,
	extractAttributeNames,
	extractKeys,
	elementAsString
};
