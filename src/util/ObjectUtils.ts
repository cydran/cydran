import NullValueError from "@/error/NullValueError";
import ValidationError from "@/error/ValidationError";
import InvalidTypeError from "@/error/InvalidTypeError";
import { isEqual, cloneDeep } from "@/util/CloneEquals";

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
		throw new NullValueError(name + " shall not be null");
	}

	return value;
}

function requireValid(value: string, name: string, regex: RegExp): string {
	if (value === null || value === undefined) {
		throw new NullValueError(name + " shall not be null");
	}

	if (!regex.test(value)) {
		throw new ValidationError(name + " must be valid");
	}

	return value;
}

function requireType<T>(type: string, value: any, name: string): T {
	requireNotNull(value, name);

	const actualType: string = typeof value;

	if (actualType !== type) {
		throw new InvalidTypeError(name + " must be of type " + type + " but was " + actualType);
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
		throw new InvalidTypeError(name + " is not an object but was " + (typeof value));
	}

	if (!isType(type, value)) {
		throw new InvalidTypeError(name + " must be of type " + type);
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

export {
	clone,
	equals,
	requireNotNull,
	requireValid,
	requireType,
	requireObjectType,
	isDefined,
	encodeHtml,
	setStrictTypeChecksEnabled
};
