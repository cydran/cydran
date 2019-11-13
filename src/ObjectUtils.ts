/* tslint:disable */

const LARGE_ARRAY_SIZE = 200;
const FUNC_ERROR_TEXT = "Expected a function";
const HASH_UNDEFINED = "__lodash_hash_undefined__";
const CLONE_DEEP_FLAG = 1;
const CLONE_FLAT_FLAG = 2;
const CLONE_SYMBOLS_FLAG = 4;
const COMPARE_PARTIAL_FLAG = 1;
const COMPARE_UNORDERED_FLAG = 2;
const MAX_SAFE_INTEGER = 9007199254740991;
const argsTag = "[object Arguments]";
const arrayTag = "[object Array]";
const asyncTag = "[object AsyncFunction]";
const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const errorTag = "[object Error]";
const funcTag = "[object Function]";
const genTag = "[object GeneratorFunction]";
const mapTag = "[object Map]";
const numberTag = "[object Number]";
const nullTag = "[object Null]";
const objectTag = "[object Object]";
const promiseTag = "[object Promise]";
const proxyTag = "[object Proxy]";
const regexpTag = "[object RegExp]";
const setTag = "[object Set]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const undefinedTag = "[object Undefined]";
const weakMapTag = "[object WeakMap]";
const arrayBufferTag = "[object ArrayBuffer]";
const dataViewTag = "[object DataView]";
const float32Tag = "[object Float32Array]";
const float64Tag = "[object Float64Array]";
const int8Tag = "[object Int8Array]";
const int16Tag = "[object Int16Array]";
const int32Tag = "[object Int32Array]";
const uint8Tag = "[object Uint8Array]";
const uint8ClampedTag = "[object Uint8ClampedArray]";
const uint16Tag = "[object Uint16Array]";
const uint32Tag = "[object Uint32Array]";
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reFlags = /\w*$/;
const reIsHostCtor = /^\[object .+?Constructor\]$/;
const reIsUint = /^(?:0|[1-9]\d*)$/;
const typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;
const cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;
const freeGlobal = typeof global === "object" && global && global.Object === Object && global;
const freeSelf = typeof self === "object" && self && self["Object"] === Object && self;
const root = freeGlobal || freeSelf || Function("return this")();
const freeExports = typeof exports === "object" && exports && !exports.nodeType && exports;
const freeModule = freeExports && typeof module === "object" && module && !module["nodeType"] && module;
const moduleExports = freeModule && freeModule.exports === freeExports;

function arrayEach(array: any[], iteratee: Function): any[] {
	const length = array == null ? 0 : array.length;

	let index = -1;

	while (++index < length) {
		if (iteratee(array[index], index, array) === false) {
			break;
		}
	}

	return array;
}

function arrayFilter(array: any[], predicate: Function): any[] {
	const length = array == null ? 0 : array.length;
	const result = [];

	let index = -1;
	let resIndex = 0;

	while (++index < length) {
		const value = array[index];

		if (predicate(value, index, array)) {
			result[resIndex++] = value;
		}
	}

	return result;
}

function arrayPush(array: any[], values: any[]): any[] {
	const length = values.length;
	const offset = array.length;

	let index = -1;

	while (++index < length) {
		array[offset + index] = values[index];
	}

	return array;
}

function arraySome(array: any[], predicate: Function): boolean {
	const length = array == null ? 0 : array.length;
	let index = -1;

	while (++index < length) {
		if (predicate(array[index], index, array)) {
			return true;
		}
	}

	return false;
}

function baseTimes(n: number, iteratee: Function): any[] {
	const result = Array(n);
	let index = -1;

	while (++index < n) {
		result[index] = iteratee(index);
	}

	return result;
}

function cacheHas(cache: any, key: string): boolean {
	return cache.has(key);
}

function getValue(object: any, key: string): any {
	return object == null ? undefined : object[key];
}

function mapToArray(map: any): any[] {
	const result = Array(map.size);

	let index = -1;

	map.forEach(function(value: any, key: string) {
		result[++index] = [key, value];
	});

	return result;
}

function overArg(func: Function, transform: Function): Function {
	return function(arg: any) {
		return func(transform(arg));
	};
}

function setToArray(set: any): any[] {
	const result = Array(set.size);

	let index = -1;

	set.forEach(function(value: any) {
		result[++index] = value;
	});

	return result;
}

interface ContextType {
	[x: string]: any;
	Array: any;
	Date: any;
	Error: any;
	Function: any;
	Math: any;
	Object: any;
	RegExp: any;
	String: any;
	TypeError: any;
	Buffer: any;
	Symbol: any;
	Uint8Array: any;
	clearTimeout: any;
	setTimeout: any;
	isFinite: any;
	parseInt: any;
}

const context: ContextType = root;

const arrayProto = Array.prototype;
const funcProto = Function.prototype;
const objectProto = Object.prototype;
const coreJsData = context["__core-js_shared__"];
const funcToString = funcProto.toString;
const hasOwnProperty = objectProto.hasOwnProperty;
const maskSrcKey = (function() {
	const uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");

	return uid ? ("Symbol(src)_1." + uid) : "";
}());

const nativeObjectToString = objectProto.toString;
const reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");

const Buffer = moduleExports ? context.Buffer : undefined;
const Symbol = context.Symbol;
const Uint8Array = context.Uint8Array;
const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
const getPrototype = overArg(Object.getPrototypeOf, Object);
const objectCreate = Object.create;
const propertyIsEnumerable = objectProto.propertyIsEnumerable;
const splice = arrayProto.splice;
const symToStringTag = Symbol ? Symbol.toStringTag : undefined;
const nativeGetSymbols = Object.getOwnPropertySymbols;
const nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
const nativeKeys = overArg(Object.keys, Object);
const DataView = getNative(context, "DataView");
const Map = getNative(context, "Map");
const Promise = getNative(context, "Promise");
const Set = getNative(context, "Set");
const WeakMap = getNative(context, "WeakMap");
const nativeCreate = getNative(Object, "create");
const dataViewCtorString = toSource(DataView);
const mapCtorString = toSource(Map);
const promiseCtorString = toSource(Promise);
const setCtorString = toSource(Set);
const weakMapCtorString = toSource(WeakMap);
const symbolProto = Symbol ? Symbol.prototype : undefined;
const symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

const baseCreate = (function() {
	function object() {
		// Intentionally do nothing
	}

	return function(proto: any) {
		if (!isObject(proto)) {
			return {};
		}
		if (objectCreate) {
			return objectCreate(proto);
		}
		object.prototype = proto;
		const result = new object();
		object.prototype = undefined;
		return result;
	};
}());

class Hash {

	public size: number;

	public __DATA__: any;

	constructor(entries?: any[]) {
		let index = -1;
		const length = entries == null ? 0 : entries.length;

		this.clear();
		while (++index < length) {
			const entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.__DATA__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}

	public delete(key: string): boolean {
		const result = this.has(key) && delete this.__DATA__[key];
		this.size -= result ? 1 : 0;
		return result;
	}

	public get(key: string): any {
		const data = this.__DATA__;
		if (nativeCreate) {
			const result = data[key];
			return result === HASH_UNDEFINED ? undefined : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	public has(key: string): boolean {
		const data = this.__DATA__;
		return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	public set(key: string, value: any): any {
		const data = this.__DATA__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
		return this;
	}

}

class ListCache {

	public size: number;

	public __DATA__: any;

	constructor(entries?: any[]) {
		let index = -1;
		const length = entries == null ? 0 : entries.length;

		this.clear();

		while (++index < length) {
			const entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.__DATA__ = [];
		this.size = 0;
	}

	public delete(key: string): boolean {
		const data = this.__DATA__;
		const index = assocIndexOf(data, key);

		if (index < 0) {
			return false;
		}
		const lastIndex = data.length - 1;
		if (index == lastIndex) {
			data.pop();
		} else {
			splice.call(data, index, 1);
		}
		--this.size;
		return true;
	}

	public get(key: string): any {
		const data = this.__DATA__;
		const index = assocIndexOf(data, key);

		return index < 0 ? undefined : data[index][1];
	}

	public has(key: string): boolean {
		return assocIndexOf(this.__DATA__, key) > -1;
	}

	public set(key: string, value: any): any {
		const data = this.__DATA__;
		const index = assocIndexOf(data, key);

		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else {
			data[index][1] = value;
		}
		return this;
	}

}

class MapCache {

	public size: number;

	public __DATA__: any;

	constructor(entries?: any[]) {
		let index = -1;
		const length = entries == null ? 0 : entries.length;

		this.clear();
		while (++index < length) {
			const entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.size = 0;
		this.__DATA__ = {
			hash: new Hash(),
			map: new (Map || ListCache)(),
			string: new Hash(),
		};
	}

	public delete(key: string): boolean {
		const result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}

	public get(key: string): any {
		return getMapData(this, key).get(key);
	}

	public has(key: string): boolean {
		return getMapData(this, key).has(key);
	}

	public set(key: string, value: any): any {
		const data = getMapData(this, key);
		const size = data.size;

		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}

}

class SetCache {

	public __DATA__: any;

	constructor(values?: any[]) {
		let index = -1;
		const length = values == null ? 0 : values.length;

		this.__DATA__ = new MapCache();
		while (++index < length) {
			this.add(values[index]);
		}
	}

	public push(value: any): any {
		return this.add(value);
	}

	public add(value: any): any {
		this.__DATA__.set(value, HASH_UNDEFINED);
		return this;
	}

	public has(value: any): boolean {
		return this.__DATA__.has(value);
	}

}

class Stack {

	public __DATA__: any;

	public size: number;

	constructor(entries?: any[]) {
		const data = this.__DATA__ = new ListCache(entries);
		this.size = data.size;
	}

	public clear(): void {
		this.__DATA__ = new ListCache();
		this.size = 0;
	}

	public delete(key: string): boolean {
		const data = this.__DATA__;
		const result = data["delete"](key);

		this.size = data.size;
		return result;
	}

	public get(key: string): any {
		return this.__DATA__.get(key);
	}

	public has(key: string): boolean {
		return this.__DATA__.has(key);
	}

	public set(key: string, value: any): any {
		let data = this.__DATA__;
		if (data instanceof ListCache) {
			const pairs = data.__DATA__;
			if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
				pairs.push([key, value]);
				this.size = ++data.size;
				return this;
			}
			data = this.__DATA__ = new MapCache(pairs);
		}
		data.set(key, value);
		this.size = data.size;
		return this;
	}

}

function arrayLikeKeys(value: any, inherited?: boolean): string[] {
	const isArr = isArray(value);
	const isArg = !isArr && isArguments(value);
	const isBuff = !isArr && !isArg && isBuffer(value);
	const isType = !isArr && !isArg && !isBuff && isTypedArray(value);
	const skipIndexes = isArr || isArg || isBuff || isType;
	const result = skipIndexes ? baseTimes(value.length, String) : [];
	const length = result.length;

	for (const key in value) {
		if ((inherited || hasOwnProperty.call(value, key)) &&
			!(skipIndexes && (
				// Safari 9 has enumerable `arguments.length` in strict mode.
				key == "length" ||
				// Node.js 0.10 has enumerable non-index properties on buffers.
				(isBuff && (key == "offset" || key == "parent")) ||
				// PhantomJS 2 has enumerable non-index properties on typed arrays.
				(isType && (key == "buffer" || key == "byteLength" || key == "byteOffset")) ||
				// Skip index properties.
				isIndex(key, length)
			))) {
			result.push(key);
		}
	}
	return result;
}

function assignValue(object: any, key: string, value: any): void {
	const objValue = object[key];
	if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
		(value === undefined && !(key in object))) {
		baseAssignValue(object, key, value);
	}
}

function assocIndexOf(array: any[], key: any): number {
	let length = array.length;
	while (length--) {
		if (eq(array[length][0], key)) {
			return length;
		}
	}
	return -1;
}

function baseAssign(object: any, source: any): any {
	return object && copyObject(source, keys(source), object);
}

function baseAssignIn(object: any, source: any): any {
	return object && copyObject(source, keysIn(source), object);
}

function baseAssignValue(object: any, key: string, value: any): void {
	if (key == "__proto__" && Object.defineProperty) {
		Object.defineProperty(object, key, {
			configurable: true,
			enumerable: true,
			value: value,
			writable: true,
		});
	} else {
		object[key] = value;
	}
}

function baseClone(value: any, bitmask: number, customizer?: Function, key?: string, object?: any, stack?: any): any {
	let result: any;
	const isDeep = bitmask & CLONE_DEEP_FLAG;
	const isFlat = bitmask & CLONE_FLAT_FLAG;
	const isFull = bitmask & CLONE_SYMBOLS_FLAG;

	if (customizer) {
		result = object ? customizer(value, key, object, stack) : customizer(value);
	}
	if (result !== undefined) {
		return result;
	}
	if (!isObject(value)) {
		return value;
	}
	const isArr = isArray(value);
	if (isArr) {
		result = initCloneArray(value);
		if (!isDeep) {
			return copyArray(value, result);
		}
	} else {
		const tag = getTag(value);
		const isFunc = tag == funcTag || tag == genTag;

		if (isBuffer(value)) {
			return cloneBuffer(value, !!isDeep);
		}
		if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
			result = (isFlat || isFunc) ? {} : initCloneObject(value);
			if (!isDeep) {
				return isFlat
					? copySymbolsIn(value, baseAssignIn(result, value))
					: copySymbols(value, baseAssign(result, value));
			}
		} else {
			if (!cloneableTags[tag]) {
				return object ? value : {};
			}
			result = initCloneByTag(value, tag, !!isDeep);
		}
	}
	// Check for circular references and return its corresponding clone.
	stack = (!stack) ? new Stack() : stack;
	const stacked = stack.get(value);
	if (stacked) {
		return stacked;
	}
	stack.set(value, result);

	if (isSet(value)) {
		value.forEach(function(subValue: any) {
			result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
		});
	} else if (isMap(value)) {
		value.forEach(function(subValue: any, key: string) {
			result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
		});
	}

	const keysFunc = isFull ? (isFlat ? getAllKeysIn : getAllKeys) : (isFlat ? keysIn : keys);
	const props = isArr ? undefined : keysFunc(value);
	arrayEach(props || value, function(subValue: any, key: string) {
		if (props) {
			key = subValue;
			subValue = value[key];
		}
		// Recursively populate clone (susceptible to call stack limits).
		assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	return result;
}

function baseGetAllKeys(object: any, keysFunc: Function, symbolsFunc: Function): any[] {
	const result = keysFunc(object);
	return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

function baseGetTag(value: any): string {
	if (value == null) {
		return value === undefined ? undefinedTag : nullTag;
	}
	return (symToStringTag && symToStringTag in Object(value))
		? getRawTag(value)
		: objectToString(value);
}

function baseIsArguments(value: any): boolean {
	return isObjectLike(value) && baseGetTag(value) == argsTag;
}

function baseIsEqual(value: any, other: any, bitmask?: number, customizer?: Function, stack?: any): boolean {
	if (value === other) {
		return true;
	}
	if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
		return value !== value && other !== other;
	}
	return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

function baseIsEqualDeep(object: any, other: any, bitmask: number, customizer: Function, equalFunc: Function, stack: any): boolean {
	let objIsArr = isArray(object);
	const othIsArr = isArray(other);
	let objTag = objIsArr ? arrayTag : getTag(object);
	let othTag = othIsArr ? arrayTag : getTag(other);

	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;

	let objIsObj = objTag == objectTag;
	const othIsObj = othTag == objectTag;
	const isSameTag = objTag == othTag;

	if (isSameTag && isBuffer(object)) {
		if (!isBuffer(other)) {
			return false;
		}
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack = (!stack) ? new Stack() : stack;
		return (objIsArr || isTypedArray(object))
			? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
			: equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
		const objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__");
		const othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");

		if (objIsWrapped || othIsWrapped) {
			const objUnwrapped = objIsWrapped ? object.value() : object;
			const othUnwrapped = othIsWrapped ? other.value() : other;

			stack = (!stack) ? new Stack() : stack;
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) {
		return false;
	}
	stack = (!stack) ? new Stack() : stack;
	return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

function baseIsMap(value: any): boolean {
	return isObjectLike(value) && getTag(value) == mapTag;
}

function baseIsNative(value: any): boolean {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	const pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	return pattern.test(toSource(value));
}

function baseIsSet(value: any): boolean {
	return isObjectLike(value) && getTag(value) == setTag;
}

function baseIsTypedArray(value: any): boolean {
	return isObjectLike(value) &&
		isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

function baseKeys(object: any): string[] {
	if (!isPrototype(object)) {
		return nativeKeys(object);
	}
	const result = [];
	for (const key in Object(object)) {
		if (hasOwnProperty.call(object, key) && key != "constructor") {
			result.push(key);
		}
	}
	return result;
}

function baseKeysIn(object: any): string[] {
	if (!isObject(object)) {
		return nativeKeysIn(object);
	}
	const isProto = isPrototype(object);
	const result = [];

	for (const key in object) {
		if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
			result.push(key);
		}
	}
	return result;
}

function cloneBuffer(buffer: Buffer, isDeep: boolean): Buffer {
	if (isDeep) {
		return buffer.slice();
	}
	const length = buffer.length;
	const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	buffer.copy(result);
	return result;
}

function cloneArrayBuffer(arrayBuffer: ArrayBuffer): ArrayBuffer {
	const ctor: any = arrayBuffer["constructor"];
	const result = new ctor(arrayBuffer.byteLength);
	new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	return result;
}

function cloneDataView(dataView: any, isDeep: boolean): any {
	const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

function cloneRegExp(regexp: any): any {
	const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	result.lastIndex = regexp.lastIndex;
	return result;
}

function cloneSymbol(symbol: any): any {
	return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

function cloneTypedArray(typedArray: any, isDeep: boolean): any {
	const buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

function copyArray(source: any[], array?: any[]): any[] {
	let index = -1;
	const length = source.length;

	array = (!array) ? Array(length) : array;
	while (++index < length) {
		array[index] = source[index];
	}
	return array;
}

function copyObject(source: any, props: string[], object?: any, customizer?: Function): any {
	const isNew = !object;
	object = (isNew) ? {} : object;

	let index = -1;
	const length = props.length;

	while (++index < length) {
		const key = props[index];

		let newValue = customizer
			? customizer(object[key], source[key], key, object, source)
			: undefined;

		if (newValue === undefined) {
			newValue = source[key];
		}
		if (isNew) {
			baseAssignValue(object, key, newValue);
		} else {
			assignValue(object, key, newValue);
		}
	}
	return object;
}

function copySymbols(source: any, object: any): any {
	return copyObject(source, getSymbols(source), object);
}

function copySymbolsIn(source: any, object: any): any {
	return copyObject(source, getSymbolsIn(source), object);
}

function equalArrays(array: any[], other: any[], bitmask: number, customizer: Function, equalFunc: Function, stack: any): boolean {
	const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
	const arrLength = array.length;
	const othLength = other.length;

	if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
		return false;
	}
	// Assume cyclic values are equal.
	const stacked = stack.get(array);
	if (stacked && stack.get(other)) {
		return stacked == other;
	}
	let index = -1;
	let result = true;
	const seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache() : undefined;

	stack.set(array, other);
	stack.set(other, array);

	// Ignore non-index properties.
	while (++index < arrLength) {
		const arrValue = array[index];
		const othValue = other[index];

		let compared;
		if (customizer) {
			compared = isPartial
				? customizer(othValue, arrValue, index, other, array, stack)
				: customizer(arrValue, othValue, index, array, other, stack);
		}
		if (compared !== undefined) {
			if (compared) {
				continue;
			}
			result = false;
			break;
		}
		// Recursively compare arrays (susceptible to call stack limits).
		if (seen) {
			if (!arraySome(other, function(othValue: any, othIndex: any) {
				if (!cacheHas(seen, othIndex) &&
					(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
					return seen.push(othIndex);
				}
			})) {
				result = false;
				break;
			}
		} else if (!(
			arrValue === othValue ||
			equalFunc(arrValue, othValue, bitmask, customizer, stack)
		)) {
			result = false;
			break;
		}
	}
	stack["delete"](array);
	stack["delete"](other);
	return result;
}

function equalByTag(object: any, other: any, tag: string, bitmask: number, customizer: Function, equalFunc: Function, stack: any): boolean {
	switch (tag) {
		case dataViewTag:
			if ((object.byteLength != other.byteLength) ||
				(object.byteOffset != other.byteOffset)) {
				return false;
			}
			object = object.buffer;
			other = other.buffer;

		case arrayBufferTag:
			if ((object.byteLength != other.byteLength) ||
				!equalFunc(new Uint8Array(object), new Uint8Array(other))) {
				return false;
			}
			return true;

		case boolTag:
		case dateTag:
		case numberTag:
			// Coerce booleans to `1` or `0` and dates to milliseconds.
			// Invalid dates are coerced to `NaN`.
			return eq(+object, +other);

		case errorTag:
			return object.name == other.name && object.message == other.message;

		case regexpTag:
		case stringTag:
			// Coerce regexes to strings and treat strings, primitives and objects,
			// as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
			// for more details.
			return object == (other + "");

		case mapTag:
			let convert = mapToArray;

		case setTag:
			const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
			convert = (!convert) ? setToArray : convert;

			if (object.size != other.size && !isPartial) {
				return false;
			}
			// Assume cyclic values are equal.
			const stacked = stack.get(object);
			if (stacked) {
				return stacked == other;
			}
			bitmask |= COMPARE_UNORDERED_FLAG;

			// Recursively compare objects (susceptible to call stack limits).
			stack.set(object, other);
			const result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack["delete"](object);
			return result;

		case symbolTag:
			if (symbolValueOf) {
				return symbolValueOf.call(object) == symbolValueOf.call(other);
			}
	}
	return false;
}

function equalObjects(object: any, other: any, bitmask: number, customizer: Function, equalFunc: Function, stack: any): boolean {
	const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
	const objProps = getAllKeys(object);
	const objLength = objProps.length;
	const othProps = getAllKeys(other);
	const othLength = othProps.length;

	if (objLength != othLength && !isPartial) {
		return false;
	}
	let index = objLength;
	while (index--) {
		const key = objProps[index];
		if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
			return false;
		}
	}
	// Assume cyclic values are equal.
	const stacked = stack.get(object);
	if (stacked && stack.get(other)) {
		return stacked == other;
	}
	let result = true;
	stack.set(object, other);
	stack.set(other, object);

	let skipCtor: boolean = !!isPartial;
	while (++index < objLength) {
		const key = objProps[index];
		const objValue = object[key];
		const othValue = other[key];

		let compared;
		if (customizer) {
			compared = isPartial
				? customizer(othValue, objValue, key, other, object, stack)
				: customizer(objValue, othValue, key, object, other, stack);
		}
		// Recursively compare objects (susceptible to call stack limits).
		if (!(compared === undefined
			? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
			: compared
		)) {
			result = false;
			break;
		}
		skipCtor = (!skipCtor) ? key == "constructor" : skipCtor;
	}
	if (result && !skipCtor) {
		const objCtor = object.constructor;
		const othCtor = other.constructor;

		// Non `Object` object instances with different constructors are not equal.
		if (objCtor != othCtor &&
			("constructor" in object && "constructor" in other) &&
			!(typeof objCtor == "function" && objCtor instanceof objCtor &&
				typeof othCtor == "function" && othCtor instanceof othCtor)) {
			result = false;
		}
	}
	stack["delete"](object);
	stack["delete"](other);
	return result;
}

function getAllKeys(object: any): string[] {
	return baseGetAllKeys(object, keys, getSymbols);
}

function getAllKeysIn(object: any): string[] {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

function getMapData(map: any, key: string): any {
	const data = map.__DATA__;

	return isKeyable(key) ? data[typeof key === "string" ? "string" : "hash"]
		: data.map;
}

function getNative(object: any, key: string): any {
	const value = getValue(object, key);
	return baseIsNative(value) ? value : undefined;
}

function getRawTag(value: any): string {
	const isOwn = hasOwnProperty.call(value, symToStringTag);
	const tag = value[symToStringTag];

	let unmasked = false;

	try {
		value[symToStringTag] = undefined;
		unmasked = true;
	} catch (e) {
		// Intentionally do nothing
	}

	const result = nativeObjectToString.call(value);

	if (unmasked) {
		if (isOwn) {
			value[symToStringTag] = tag;
		} else {
			delete value[symToStringTag];
		}
	}

	return result;
}

const getSymbols: (source: any) => string[] = !nativeGetSymbols ? stubArray : function(object) {
	if (object == null) {
		return [];
	}
	object = Object(object);
	return arrayFilter(nativeGetSymbols(object), function(symbol: any) {
		return propertyIsEnumerable.call(object, symbol);
	});
};

const getSymbolsIn: (source: any) => string[] = !nativeGetSymbols ? stubArray : function(object) {
	const result = [];

	while (object) {
		arrayPush(result, getSymbols(object));
		object = getPrototype(object);
	}

	return result;
};

let getTag: (source: any) => string = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) !== dataViewTag) ||
	(Map && getTag(new Map()) !== mapTag) ||
	(Promise && getTag(Promise.resolve()) !== promiseTag) ||
	(Set && getTag(new Set()) !== setTag) ||
	(WeakMap && getTag(new WeakMap()) !== weakMapTag)) {
	getTag = function(value) {
		const result = baseGetTag(value);
		const Ctor = result === objectTag ? value.constructor : undefined;
		const ctorString = Ctor ? toSource(Ctor) : "";

		if (ctorString) {
			switch (ctorString) {
				case dataViewCtorString: return dataViewTag;
				case mapCtorString: return mapTag;
				case promiseCtorString: return promiseTag;
				case setCtorString: return setTag;
				case weakMapCtorString: return weakMapTag;
			}
		}
		return result;
	};
}

function initCloneArray(array: any): any[] {
	const length = array.length;
	const result = new array.constructor(length);

	// Add properties assigned by `RegExp#exec`.
	if (length && typeof array[0] === "string" && hasOwnProperty.call(array, "index")) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}

function initCloneObject(object: any): any {
	return (typeof object.constructor === "function" && !isPrototype(object))
		? baseCreate(getPrototype(object))
		: {};
}

function initCloneByTag(object: any, tag: string, isDeep: boolean): any {
	const Ctor = object.constructor;

	switch (tag) {
		case arrayBufferTag:
			return cloneArrayBuffer(object);

		case boolTag:
		case dateTag:
			return new Ctor(+object);

		case dataViewTag:
			return cloneDataView(object, isDeep);

		case float32Tag: case float64Tag:
		case int8Tag: case int16Tag: case int32Tag:
		case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
			return cloneTypedArray(object, isDeep);

		case mapTag:
			return new Ctor();

		case numberTag:
		case stringTag:
			return new Ctor(object);

		case regexpTag:
			return cloneRegExp(object);

		case setTag:
			return new Ctor();

		case symbolTag:
			return cloneSymbol(object);
	}
}

function isIndex(value: any, length?: number): boolean {
	const type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER : length;

	return !!length &&
		(type === "number" ||
			(type !== "symbol" && reIsUint.test(value))) &&
		(value > -1 && value % 1 === 0 && value < length);
}

function isKeyable(value: any): boolean {
	const type = typeof value;

	return (type === "string" || type === "number" || type === "symbol" || type === "boolean")
		? (value !== "__proto__")
		: (value === null);
}

function isMasked(func: Function): boolean {
	return !!maskSrcKey && (maskSrcKey in func);
}

function isPrototype(value: any): boolean {
	const Ctor = value && value.constructor;
	const proto = (typeof Ctor === "function" && Ctor.prototype) || objectProto;

	return value === proto;
}

function nativeKeysIn(object: any): any[] {
	const result = [];

	if (object != null) {
		/* tslint:disable-next-line */
		for (const key in Object(object)) {
			result.push(key);
		}
	}

	return result;
}

function objectToString(value: any): string {
	return nativeObjectToString.call(value);
}

function toSource(func: Function): string {
	if (func != null) {
		try {
			return funcToString.call(func);
		} catch (e) {
			// Intentionally do nothing
		}
		try {
			return (func + "");
		} catch (e) {
			// Intentionally do nothing
		}
	}
	return "";
}

function memoize(func: Function, resolver: Function): Function {
	if (typeof func !== "function" || (resolver != null && typeof resolver !== "function")) {
		throw new TypeError(FUNC_ERROR_TEXT);
	}

	const memoized = function() {
		const args = arguments;
		const key = resolver ? resolver.apply(this, args) : args[0];
		const cache = memoized["cache"];

		if (cache.has(key)) {
			return cache.get(key);
		}

		const result = func.apply(this, args);
		memoized["cache"] = cache.set(key, result) || cache;

		return result;
	};

	memoized["cache"] = new (memoize.Cache || MapCache)();

	return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

function cloneDeep(value: any): any {
	return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

function eq(value: any, other: any): boolean {
	return value === other || (value !== value && other !== other);
}

const isArguments: (value: any) => boolean = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};

const isArray: (value: any) => boolean = Array.isArray;

function isArrayLike(value: any): boolean {
	return value != null && isLength(value.length) && !isFunction(value);
}

const isBuffer: (value: any) => boolean = nativeIsBuffer || stubFalse;

function isEqual(value: any, other: any): boolean {
	return baseIsEqual(value, other);
}

function isFunction(value: any): boolean {
	if (!isObject(value)) {
		return false;
	}

	const tag = baseGetTag(value);

	return tag === funcTag || tag === genTag || tag === asyncTag || tag === proxyTag;
}

function isLength(value: any): boolean {
	return typeof value === "number" && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

function isObject(value: any): boolean {
	const type = typeof value;
	return value != null && (type === "object" || type === "function");
}

function isObjectLike(value: any): boolean {
	return value != null && typeof value === "object";
}

const isMap: (value: any) => boolean = baseIsMap;

const isSet: (value: any) => boolean = baseIsSet;

const isTypedArray: (value: any) => boolean = baseIsTypedArray;

function keys(object: any): string[] {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function keysIn(object: any): string[] {
	return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

function stubArray(): any[] {
	return [];
}

function stubFalse(): boolean {
	return false;
}

const encodeHtmlMap: any = {
	'"': "&quot;",
	"&": "&amp;",
	"'": "&#39;",
	"<": "&lt;",
	">": "&gt;",
};

function lookupEncodeHtmlMap(key: string): string {
	return encodeHtmlMap[key];
}

function encodeHtml(source: string): string {
	return (source === null) ? null : (source + "").replace(/[&"'<>]/g, lookupEncodeHtmlMap);
}

export default {
	clone: function(source: any) {
		return cloneDeep(source);
	},
	equals: function(first: any, second: any): boolean {
		return isEqual(first, second);
	},
	encodeHtml: encodeHtml
};
