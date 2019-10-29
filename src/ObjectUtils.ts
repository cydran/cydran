/* tslint:disable */

// var undefined;
var LARGE_ARRAY_SIZE = 200;
var FUNC_ERROR_TEXT = 'Expected a function';
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var CLONE_DEEP_FLAG = 1,
	CLONE_FLAT_FLAG = 2,
	CLONE_SYMBOLS_FLAG = 4;
var COMPARE_PARTIAL_FLAG = 1,
	COMPARE_UNORDERED_FLAG = 2;
var MAX_SAFE_INTEGER = 9007199254740991;
var argsTag = '[object Arguments]',
	arrayTag = '[object Array]',
	asyncTag = '[object AsyncFunction]',
	boolTag = '[object Boolean]',
	dateTag = '[object Date]',
	errorTag = '[object Error]',
	funcTag = '[object Function]',
	genTag = '[object GeneratorFunction]',
	mapTag = '[object Map]',
	numberTag = '[object Number]',
	nullTag = '[object Null]',
	objectTag = '[object Object]',
	promiseTag = '[object Promise]',
	proxyTag = '[object Proxy]',
	regexpTag = '[object RegExp]',
	setTag = '[object Set]',
	stringTag = '[object String]',
	symbolTag = '[object Symbol]',
	undefinedTag = '[object Undefined]',
	weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
	dataViewTag = '[object DataView]',
	float32Tag = '[object Float32Array]',
	float64Tag = '[object Float64Array]',
	int8Tag = '[object Int8Array]',
	int16Tag = '[object Int16Array]',
	int32Tag = '[object Int32Array]',
	uint8Tag = '[object Uint8Array]',
	uint8ClampedTag = '[object Uint8ClampedArray]',
	uint16Tag = '[object Uint16Array]',
	uint32Tag = '[object Uint32Array]';
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reFlags = /\w*$/;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var reIsUint = /^(?:0|[1-9]\d*)$/;
var typedArrayTags = {};
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
var cloneableTags = {};
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
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
var freeSelf = typeof self == 'object' && self && self["Object"] === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module["nodeType"] && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal.process;

var nodeUtil = (function () {
	try {
		// Use `util.types` for Node.js 10+.
		var types = freeModule && freeModule.require && freeModule.require('util').types;

		if (types) {
			return types;
		}

		// Legacy `process.binding('util')` for Node.js < 10.
		return freeProcess && freeProcess["binding"] && freeProcess["binding"]('util');
	} catch (e) { }
}());

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap,
	nodeIsSet = nodeUtil && nodeUtil.isSet,
	nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

function arrayEach(array: any[], iteratee: Function): any[] {
	var index = -1,
		length = array == null ? 0 : array.length;

	while (++index < length) {
		if (iteratee(array[index], index, array) === false) {
			break;
		}
	}
	return array;
}

function arrayFilter(array: any[], predicate: Function): any[] {
	var index = -1,
		length = array == null ? 0 : array.length,
		resIndex = 0,
		result = [];

	while (++index < length) {
		var value = array[index];
		if (predicate(value, index, array)) {
			result[resIndex++] = value;
		}
	}
	return result;
}

function arrayPush(array: any[], values: any[]): any[] {
	var index = -1,
		length = values.length,
		offset = array.length;

	while (++index < length) {
		array[offset + index] = values[index];
	}
	return array;
}

function arraySome(array: any[], predicate: Function): boolean {
	var index = -1,
		length = array == null ? 0 : array.length;

	while (++index < length) {
		if (predicate(array[index], index, array)) {
			return true;
		}
	}
	return false;
}

function baseTimes(n: number, iteratee: Function): any[] {
	var index = -1,
		result = Array(n);

	while (++index < n) {
		result[index] = iteratee(index);
	}
	return result;
}

function baseUnary(func: Function): (value: any) => boolean {
	return function (value: any): any {
		return func(value);
	};
}

function cacheHas(cache: any, key: string): boolean {
	return cache.has(key);
}

function getValue(object: any, key: string): any {
	return object == null ? undefined : object[key];
}

function mapToArray(map: any): any[] {
	var index = -1,
		result = Array(map.size);

	map.forEach(function (value: any, key: string) {
		result[++index] = [key, value];
	});
	return result;
}

function overArg(func: Function, transform: Function): Function {
	return function (arg: any) {
		return func(transform(arg));
	};
}

function setToArray(set: any): any[] {
	var index = -1,
		result = Array(set.size);

	set.forEach(function (value: any) {
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

var context: ContextType = root;

var arrayProto = Array.prototype,
	funcProto = Function.prototype,
	objectProto = Object.prototype;
var coreJsData = context['__core-js_shared__'];
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var maskSrcKey = (function () {
	var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	return uid ? ('Symbol(src)_1.' + uid) : '';
}());

var nativeObjectToString = objectProto.toString;
var reIsNative = RegExp('^' +
	funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
		.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);
var Buffer = moduleExports ? context.Buffer : undefined,
	Symbol = context.Symbol,
	Uint8Array = context.Uint8Array,
	allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
	getPrototype = overArg(Object.getPrototypeOf, Object),
	objectCreate = Object.create,
	propertyIsEnumerable = objectProto.propertyIsEnumerable,
	splice = arrayProto.splice,
	symToStringTag = Symbol ? Symbol.toStringTag : undefined;
var nativeGetSymbols = Object.getOwnPropertySymbols,
	nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	nativeKeys = overArg(Object.keys, Object);
var DataView = getNative(context, 'DataView'),
	Map = getNative(context, 'Map'),
	Promise = getNative(context, 'Promise'),
	Set = getNative(context, 'Set'),
	WeakMap = getNative(context, 'WeakMap'),
	nativeCreate = getNative(Object, 'create');
var dataViewCtorString = toSource(DataView),
	mapCtorString = toSource(Map),
	promiseCtorString = toSource(Promise),
	setCtorString = toSource(Set),
	weakMapCtorString = toSource(WeakMap);
var symbolProto = Symbol ? Symbol.prototype : undefined,
	symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

var baseCreate = (function () {
	function object() { }
	return function (proto: any) {
		if (!isObject(proto)) {
			return {};
		}
		if (objectCreate) {
			return objectCreate(proto);
		}
		object.prototype = proto;
		var result = new object;
		object.prototype = undefined;
		return result;
	};
}());

class Hash {

	public size: number;

	public __data__: any;

	constructor(entries?: any[]) {
		var index = -1,
			length = entries == null ? 0 : entries.length;

		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}

	public delete(key: string): boolean {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}

	public get(key: string): any {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? undefined : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	public has(key: string): boolean {
		var data = this.__data__;
		return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	public set(key: string, value: any): any {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
		return this;
	}

}

class ListCache {

	public size: number;

	public __data__: any;

	constructor(entries?: any[]) {
		var index = -1,
			length = entries == null ? 0 : entries.length;

		this.clear();

		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.__data__ = [];
		this.size = 0;
	}

	public delete(key: string): boolean {
		var data = this.__data__,
			index = assocIndexOf(data, key);

		if (index < 0) {
			return false;
		}
		var lastIndex = data.length - 1;
		if (index == lastIndex) {
			data.pop();
		} else {
			splice.call(data, index, 1);
		}
		--this.size;
		return true;
	}

	public get(key: string): any {
		var data = this.__data__,
			index = assocIndexOf(data, key);

		return index < 0 ? undefined : data[index][1];
	}

	public has(key: string): boolean {
		return assocIndexOf(this.__data__, key) > -1;
	}

	public set(key: string, value: any): any {
		var data = this.__data__,
			index = assocIndexOf(data, key);

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

	public __data__: any;

	constructor(entries?: any[]) {
		var index = -1,
			length = entries == null ? 0 : entries.length;

		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	public clear(): void {
		this.size = 0;
		this.__data__ = {
			'hash': new Hash(),
			'map': new (Map || ListCache),
			'string': new Hash()
		};
	}

	public delete(key: string): boolean {
		var result = getMapData(this, key)['delete'](key);
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
		var data = getMapData(this, key),
			size = data.size;

		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}

}

class SetCache {

	public __data__: any;

	constructor(values?: any[]) {
		var index = -1,
			length = values == null ? 0 : values.length;

		this.__data__ = new MapCache();
		while (++index < length) {
			this.add(values[index]);
		}
	}

	public push(value: any): any {
		return this.add(value);
	}

	public add(value: any): any {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}

	public has(value: any): boolean {
		return this.__data__.has(value);
	}

}

class Stack {

	public __data__: any;

	public size: number;

	constructor(entries?: any[]) {
		var data = this.__data__ = new ListCache(entries);
		this.size = data.size;
	}

	public clear(): void {
		this.__data__ = new ListCache();
		this.size = 0;
	}

	public delete(key: string): boolean {
		var data = this.__data__,
			result = data['delete'](key);

		this.size = data.size;
		return result;
	}

	public get(key: string): any {
		return this.__data__.get(key);
	}

	public has(key: string): boolean {
		return this.__data__.has(key);
	}

	public set(key: string, value: any): any {
		var data = this.__data__;
		if (data instanceof ListCache) {
			var pairs = data.__data__;
			if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
				pairs.push([key, value]);
				this.size = ++data.size;
				return this;
			}
			data = this.__data__ = new MapCache(pairs);
		}
		data.set(key, value);
		this.size = data.size;
		return this;
	}

}

function arrayLikeKeys(value: any, inherited?: boolean): string[] {
	var isArr = isArray(value),
		isArg = !isArr && isArguments(value),
		isBuff = !isArr && !isArg && isBuffer(value),
		isType = !isArr && !isArg && !isBuff && isTypedArray(value),
		skipIndexes = isArr || isArg || isBuff || isType,
		result = skipIndexes ? baseTimes(value.length, String) : [],
		length = result.length;

	for (var key in value) {
		if ((inherited || hasOwnProperty.call(value, key)) &&
			!(skipIndexes && (
				// Safari 9 has enumerable `arguments.length` in strict mode.
				key == 'length' ||
				// Node.js 0.10 has enumerable non-index properties on buffers.
				(isBuff && (key == 'offset' || key == 'parent')) ||
				// PhantomJS 2 has enumerable non-index properties on typed arrays.
				(isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
				// Skip index properties.
				isIndex(key, length)
			))) {
			result.push(key);
		}
	}
	return result;
}

function assignValue(object: any, key: string, value: any): void {
	var objValue = object[key];
	if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
		(value === undefined && !(key in object))) {
		baseAssignValue(object, key, value);
	}
}

function assocIndexOf(array: any[], key: any): number {
	var length = array.length;
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
	if (key == '__proto__' && Object.defineProperty) {
		Object.defineProperty(object, key, {
			'configurable': true,
			'enumerable': true,
			'value': value,
			'writable': true
		});
	} else {
		object[key] = value;
	}
}

function baseClone(value: any, bitmask: number, customizer?: Function, key?: string, object?: any, stack?: any): any {
	var result: any,
		isDeep = bitmask & CLONE_DEEP_FLAG,
		isFlat = bitmask & CLONE_FLAT_FLAG,
		isFull = bitmask & CLONE_SYMBOLS_FLAG;

	if (customizer) {
		result = object ? customizer(value, key, object, stack) : customizer(value);
	}
	if (result !== undefined) {
		return result;
	}
	if (!isObject(value)) {
		return value;
	}
	var isArr = isArray(value);
	if (isArr) {
		result = initCloneArray(value);
		if (!isDeep) {
			return copyArray(value, result);
		}
	} else {
		var tag = getTag(value),
			isFunc = tag == funcTag || tag == genTag;

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
	stack || (stack = new Stack());
	var stacked = stack.get(value);
	if (stacked) {
		return stacked;
	}
	stack.set(value, result);

	if (isSet(value)) {
		value.forEach(function (subValue: any) {
			result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
		});
	} else if (isMap(value)) {
		value.forEach(function (subValue: any, key: string) {
			result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
		});
	}

	var keysFunc = isFull
		? (isFlat ? getAllKeysIn : getAllKeys)
		: (isFlat ? keysIn : keys);

	var props = isArr ? undefined : keysFunc(value);
	arrayEach(props || value, function (subValue: any, key: string) {
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
	var result = keysFunc(object);
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
	var objIsArr = isArray(object),
		othIsArr = isArray(other),
		objTag = objIsArr ? arrayTag : getTag(object),
		othTag = othIsArr ? arrayTag : getTag(other);

	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;

	var objIsObj = objTag == objectTag,
		othIsObj = othTag == objectTag,
		isSameTag = objTag == othTag;

	if (isSameTag && isBuffer(object)) {
		if (!isBuffer(other)) {
			return false;
		}
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack || (stack = new Stack);
		return (objIsArr || isTypedArray(object))
			? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
			: equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
		var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
			othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

		if (objIsWrapped || othIsWrapped) {
			var objUnwrapped = objIsWrapped ? object.value() : object,
				othUnwrapped = othIsWrapped ? other.value() : other;

			stack || (stack = new Stack);
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) {
		return false;
	}
	stack || (stack = new Stack);
	return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

function baseIsMap(value: any): boolean {
	return isObjectLike(value) && getTag(value) == mapTag;
}

function baseIsNative(value: any): boolean {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
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
	var result = [];
	for (var key in Object(object)) {
		if (hasOwnProperty.call(object, key) && key != 'constructor') {
			result.push(key);
		}
	}
	return result;
}

function baseKeysIn(object: any): string[] {
	if (!isObject(object)) {
		return nativeKeysIn(object);
	}
	var isProto = isPrototype(object),
		result = [];

	for (var key in object) {
		if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
			result.push(key);
		}
	}
	return result;
}

function cloneBuffer(buffer: Buffer, isDeep: boolean): Buffer {
	if (isDeep) {
		return buffer.slice();
	}
	var length = buffer.length,
		result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	buffer.copy(result);
	return result;
}

function cloneArrayBuffer(arrayBuffer: ArrayBuffer): ArrayBuffer {
	var ctor: any = arrayBuffer["constructor"];
	var result = new ctor(arrayBuffer.byteLength);
	new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	return result;
}

function cloneDataView(dataView: any, isDeep: boolean): any {
	var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

function cloneRegExp(regexp: any): any {
	var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	result.lastIndex = regexp.lastIndex;
	return result;
}

function cloneSymbol(symbol: any): any {
	return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

function cloneTypedArray(typedArray: any, isDeep: boolean): any {
	var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

function copyArray(source: any[], array?: any[]): any[] {
	var index = -1,
		length = source.length;

	array || (array = Array(length));
	while (++index < length) {
		array[index] = source[index];
	}
	return array;
}

function copyObject(source: any, props: string[], object?: any, customizer?: Function): any {
	var isNew = !object;
	object || (object = {});

	var index = -1,
		length = props.length;

	while (++index < length) {
		var key = props[index];

		var newValue = customizer
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
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
		arrLength = array.length,
		othLength = other.length;

	if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
		return false;
	}
	// Assume cyclic values are equal.
	var stacked = stack.get(array);
	if (stacked && stack.get(other)) {
		return stacked == other;
	}
	var index = -1,
		result = true,
		seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

	stack.set(array, other);
	stack.set(other, array);

	// Ignore non-index properties.
	while (++index < arrLength) {
		var arrValue = array[index],
			othValue = other[index];

		if (customizer) {
			var compared = isPartial
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
			if (!arraySome(other, function (othValue: any, othIndex: any) {
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
	stack['delete'](array);
	stack['delete'](other);
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
			return object == (other + '');

		case mapTag:
			var convert = mapToArray;

		case setTag:
			var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
			convert || (convert = setToArray);

			if (object.size != other.size && !isPartial) {
				return false;
			}
			// Assume cyclic values are equal.
			var stacked = stack.get(object);
			if (stacked) {
				return stacked == other;
			}
			bitmask |= COMPARE_UNORDERED_FLAG;

			// Recursively compare objects (susceptible to call stack limits).
			stack.set(object, other);
			var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack['delete'](object);
			return result;

		case symbolTag:
			if (symbolValueOf) {
				return symbolValueOf.call(object) == symbolValueOf.call(other);
			}
	}
	return false;
}

function equalObjects(object: any, other: any, bitmask: number, customizer: Function, equalFunc: Function, stack: any): boolean {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
		objProps = getAllKeys(object),
		objLength = objProps.length,
		othProps = getAllKeys(other),
		othLength = othProps.length;

	if (objLength != othLength && !isPartial) {
		return false;
	}
	var index = objLength;
	while (index--) {
		var key = objProps[index];
		if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
			return false;
		}
	}
	// Assume cyclic values are equal.
	var stacked = stack.get(object);
	if (stacked && stack.get(other)) {
		return stacked == other;
	}
	var result = true;
	stack.set(object, other);
	stack.set(other, object);

	var skipCtor: boolean = !!isPartial;
	while (++index < objLength) {
		key = objProps[index];
		var objValue = object[key],
			othValue = other[key];

		if (customizer) {
			var compared = isPartial
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
		skipCtor || (skipCtor = key == 'constructor');
	}
	if (result && !skipCtor) {
		var objCtor = object.constructor,
			othCtor = other.constructor;

		// Non `Object` object instances with different constructors are not equal.
		if (objCtor != othCtor &&
			('constructor' in object && 'constructor' in other) &&
			!(typeof objCtor == 'function' && objCtor instanceof objCtor &&
				typeof othCtor == 'function' && othCtor instanceof othCtor)) {
			result = false;
		}
	}
	stack['delete'](object);
	stack['delete'](other);
	return result;
}

function getAllKeys(object: any): string[] {
	return baseGetAllKeys(object, keys, getSymbols);
}

function getAllKeysIn(object: any): string[] {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

function getMapData(map: any, key: string): any {
	var data = map.__data__;
	return isKeyable(key)
		? data[typeof key == 'string' ? 'string' : 'hash']
		: data.map;
}

function getNative(object: any, key: string): any {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : undefined;
}

function getRawTag(value: any): string {
	var isOwn = hasOwnProperty.call(value, symToStringTag),
		tag = value[symToStringTag];

	try {
		value[symToStringTag] = undefined;
		var unmasked = true;
	} catch (e) { }

	var result = nativeObjectToString.call(value);
	if (unmasked) {
		if (isOwn) {
			value[symToStringTag] = tag;
		} else {
			delete value[symToStringTag];
		}
	}
	return result;
}

var getSymbols: (source: any) => string[] = !nativeGetSymbols ? stubArray : function (object) {
	if (object == null) {
		return [];
	}
	object = Object(object);
	return arrayFilter(nativeGetSymbols(object), function (symbol: any) {
		return propertyIsEnumerable.call(object, symbol);
	});
};

var getSymbolsIn: (source: any) => string[] = !nativeGetSymbols ? stubArray : function (object) {
	var result = [];
	while (object) {
		arrayPush(result, getSymbols(object));
		object = getPrototype(object);
	}
	return result;
};

var getTag: (source: any) => string = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	(Map && getTag(new Map) != mapTag) ||
	(Promise && getTag(Promise.resolve()) != promiseTag) ||
	(Set && getTag(new Set) != setTag) ||
	(WeakMap && getTag(new WeakMap) != weakMapTag)) {
	getTag = function (value) {
		var result = baseGetTag(value),
			Ctor = result == objectTag ? value.constructor : undefined,
			ctorString = Ctor ? toSource(Ctor) : '';

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
	var length = array.length,
		result = new array.constructor(length);

	// Add properties assigned by `RegExp#exec`.
	if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}

function initCloneObject(object: any): any {
	return (typeof object.constructor == 'function' && !isPrototype(object))
		? baseCreate(getPrototype(object))
		: {};
}

function initCloneByTag(object: any, tag: string, isDeep: boolean): any {
	var Ctor = object.constructor;
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
			return new Ctor;

		case numberTag:
		case stringTag:
			return new Ctor(object);

		case regexpTag:
			return cloneRegExp(object);

		case setTag:
			return new Ctor;

		case symbolTag:
			return cloneSymbol(object);
	}
}

function isIndex(value: any, length?: number): boolean {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER : length;

	return !!length &&
		(type == 'number' ||
			(type != 'symbol' && reIsUint.test(value))) &&
		(value > -1 && value % 1 == 0 && value < length);
}

function isKeyable(value: any): boolean {
	var type = typeof value;
	return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		? (value !== '__proto__')
		: (value === null);
}

function isMasked(func: Function): boolean {
	return !!maskSrcKey && (maskSrcKey in func);
}

function isPrototype(value: any): boolean {
	var Ctor = value && value.constructor,
		proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	return value === proto;
}

function nativeKeysIn(object: any): any[] {
	var result = [];
	if (object != null) {
		for (var key in Object(object)) {
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
		} catch (e) { }
		try {
			return (func + '');
		} catch (e) { }
	}
	return '';
}

function memoize(func: Function, resolver: Function): Function {
	if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
		throw new TypeError(FUNC_ERROR_TEXT);
	}
	var memoized = function () {
		var args = arguments,
			key = resolver ? resolver.apply(this, args) : args[0],
			cache = memoized["cache"];

		if (cache.has(key)) {
			return cache.get(key);
		}
		var result = func.apply(this, args);
		memoized["cache"] = cache.set(key, result) || cache;
		return result;
	};
	memoized["cache"] = new (memoize.Cache || MapCache);
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

var isArguments: (value: any) => boolean = baseIsArguments(function () { return arguments; }()) ? baseIsArguments : function (value) {
	return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

var isArray: (value: any) => boolean = Array.isArray;

function isArrayLike(value: any): boolean {
	return value != null && isLength(value.length) && !isFunction(value);
}

var isBuffer: (value: any) => boolean = nativeIsBuffer || stubFalse;

function isEqual(value: any, other: any): boolean {
	return baseIsEqual(value, other);
}

function isFunction(value: any): boolean {
	if (!isObject(value)) {
		return false;
	}
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 9 which returns 'object' for typed arrays and other constructors.
	var tag = baseGetTag(value);
	return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

function isLength(value: any): boolean {
	return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isObject(value: any): boolean {
	var type = typeof value;
	return value != null && (type == 'object' || type == 'function');
}

function isObjectLike(value: any): boolean {
	return value != null && typeof value == 'object';
}

var isMap: (value: any) => boolean = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

var isSet: (value: any) => boolean = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var isTypedArray: (value: any) => boolean = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

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

export default {
	clone: function (source: any) {
		return cloneDeep(source);
	},
	equals: function (first: any, second: any): boolean {
		return isEqual(first, second);
	},
};
