/* tslint:disable */

var undefined;
var VERSION = '4.17.15';
var LARGE_ARRAY_SIZE = 200;
var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
	FUNC_ERROR_TEXT = 'Expected a function';
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var MAX_MEMOIZE_SIZE = 500;
var PLACEHOLDER = '__lodash_placeholder__';
var CLONE_DEEP_FLAG = 1,
	CLONE_FLAT_FLAG = 2,
	CLONE_SYMBOLS_FLAG = 4;
var COMPARE_PARTIAL_FLAG = 1,
	COMPARE_UNORDERED_FLAG = 2;
var WRAP_BIND_FLAG = 1,
	WRAP_BIND_KEY_FLAG = 2,
	WRAP_CURRY_BOUND_FLAG = 4,
	WRAP_CURRY_FLAG = 8,
	WRAP_CURRY_RIGHT_FLAG = 16,
	WRAP_PARTIAL_FLAG = 32,
	WRAP_PARTIAL_RIGHT_FLAG = 64,
	WRAP_ARY_FLAG = 128,
	WRAP_REARG_FLAG = 256,
	WRAP_FLIP_FLAG = 512;
var DEFAULT_TRUNC_LENGTH = 30,
	DEFAULT_TRUNC_OMISSION = '...';
var HOT_COUNT = 800,
	HOT_SPAN = 16;
var LAZY_FILTER_FLAG = 1,
	LAZY_MAP_FLAG = 2,
	LAZY_WHILE_FLAG = 3;
var INFINITY = 1 / 0,
	MAX_SAFE_INTEGER = 9007199254740991,
	MAX_INTEGER = 1.7976931348623157e+308,
	NAN = 0 / 0;
var MAX_ARRAY_LENGTH = 4294967295,
	MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
	HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
var wrapFlags = [
	['ary', WRAP_ARY_FLAG],
	['bind', WRAP_BIND_FLAG],
	['bindKey', WRAP_BIND_KEY_FLAG],
	['curry', WRAP_CURRY_FLAG],
	['curryRight', WRAP_CURRY_RIGHT_FLAG],
	['flip', WRAP_FLIP_FLAG],
	['partial', WRAP_PARTIAL_FLAG],
	['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
	['rearg', WRAP_REARG_FLAG]
];
var argsTag = '[object Arguments]',
	arrayTag = '[object Array]',
	asyncTag = '[object AsyncFunction]',
	boolTag = '[object Boolean]',
	dateTag = '[object Date]',
	domExcTag = '[object DOMException]',
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
	weakMapTag = '[object WeakMap]',
	weakSetTag = '[object WeakSet]';
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
// var reEmptyStringLeading = /\b__p \+= '';/g,
// 	reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
// 	reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
	reUnescapedHtml = /[&<>"']/g,
	reHasEscapedHtml = RegExp(reEscapedHtml.source),
	reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
var reEscape = /<%-([\s\S]+?)%>/g,
	reEvaluate = /<%([\s\S]+?)%>/g,
	reInterpolate = /<%=([\s\S]+?)%>/g;
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	reIsPlainProp = /^\w*$/,
	rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	reHasRegExpChar = RegExp(reRegExpChar.source);
var reTrim = /^\s+|\s+$/g,
	reTrimStart = /^\s+/,
	reTrimEnd = /\s+$/;
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
	reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
	reSplitDetails = /,? & /;
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
var reEscapeChar = /\\(\\)?/g;
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
var reFlags = /\w*$/;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var reIsOctal = /^0o[0-7]+$/i;
var reIsUint = /^(?:0|[1-9]\d*)$/;
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
var reNoMatch = /($^)/;
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
var rsAstralRange = '\\ud800-\\udfff',
	rsComboMarksRange = '\\u0300-\\u036f',
	reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	rsComboSymbolsRange = '\\u20d0-\\u20ff',
	rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
	rsDingbatRange = '\\u2700-\\u27bf',
	rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	rsPunctuationRange = '\\u2000-\\u206f',
	rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	rsVarRange = '\\ufe0e\\ufe0f',
	rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
var rsApos = "['\u2019]",
	rsAstral = '[' + rsAstralRange + ']',
	rsBreak = '[' + rsBreakRange + ']',
	rsCombo = '[' + rsComboRange + ']',
	rsDigits = '\\d+',
	rsDingbat = '[' + rsDingbatRange + ']',
	rsLower = '[' + rsLowerRange + ']',
	rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	rsFitz = '\\ud83c[\\udffb-\\udfff]',
	rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	rsNonAstral = '[^' + rsAstralRange + ']',
	rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	rsUpper = '[' + rsUpperRange + ']',
	rsZWJ = '\\u200d';
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
	rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
	rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
	rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
	reOptMod = rsModifier + '?',
	rsOptVar = '[' + rsVarRange + ']?',
	rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
	rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
	rsSeq = rsOptVar + reOptMod + rsOptJoin,
	rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
	rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
var reApos = RegExp(rsApos, 'g');
var reComboMark = RegExp(rsCombo, 'g');
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
var reUnicodeWord = RegExp([
	rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
	rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
	rsUpper + '+' + rsOptContrUpper,
	rsOrdUpper,
	rsOrdLower,
	rsDigits,
	rsEmoji
].join('|'), 'g');
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
var contextProps = [
	'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
	'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
	'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
	'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
	'_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
];
var templateCounter = -1;
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
var deburredLetters = {
	// Latin-1 Supplement block.
	'\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	'\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	'\xc7': 'C', '\xe7': 'c',
	'\xd0': 'D', '\xf0': 'd',
	'\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	'\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	'\xcc': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	'\xec': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
	'\xd1': 'N', '\xf1': 'n',
	'\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	'\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	'\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	'\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	'\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
	'\xc6': 'Ae', '\xe6': 'ae',
	'\xde': 'Th', '\xfe': 'th',
	'\xdf': 'ss',
	// Latin Extended-A block.
	'\u0100': 'A', '\u0102': 'A', '\u0104': 'A',
	'\u0101': 'a', '\u0103': 'a', '\u0105': 'a',
	'\u0106': 'C', '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
	'\u0107': 'c', '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
	'\u010e': 'D', '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
	'\u0112': 'E', '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
	'\u0113': 'e', '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
	'\u011c': 'G', '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
	'\u011d': 'g', '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
	'\u0124': 'H', '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
	'\u0128': 'I', '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
	'\u0129': 'i', '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
	'\u0134': 'J', '\u0135': 'j',
	'\u0136': 'K', '\u0137': 'k', '\u0138': 'k',
	'\u0139': 'L', '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
	'\u013a': 'l', '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
	'\u0143': 'N', '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
	'\u0144': 'n', '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
	'\u014c': 'O', '\u014e': 'O', '\u0150': 'O',
	'\u014d': 'o', '\u014f': 'o', '\u0151': 'o',
	'\u0154': 'R', '\u0156': 'R', '\u0158': 'R',
	'\u0155': 'r', '\u0157': 'r', '\u0159': 'r',
	'\u015a': 'S', '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
	'\u015b': 's', '\u015d': 's', '\u015f': 's', '\u0161': 's',
	'\u0162': 'T', '\u0164': 'T', '\u0166': 'T',
	'\u0163': 't', '\u0165': 't', '\u0167': 't',
	'\u0168': 'U', '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
	'\u0169': 'u', '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
	'\u0174': 'W', '\u0175': 'w',
	'\u0176': 'Y', '\u0177': 'y', '\u0178': 'Y',
	'\u0179': 'Z', '\u017b': 'Z', '\u017d': 'Z',
	'\u017a': 'z', '\u017c': 'z', '\u017e': 'z',
	'\u0132': 'IJ', '\u0133': 'ij',
	'\u0152': 'Oe', '\u0153': 'oe',
	'\u0149': "'n", '\u017f': 's'
};
var htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};
var htmlUnescapes = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'"
};
var stringEscapes = {
	'\\': '\\',
	"'": "'",
	'\n': 'n',
	'\r': 'r',
	'\u2028': 'u2028',
	'\u2029': 'u2029'
};
var freeParseFloat = parseFloat,
	freeParseInt = parseInt;
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
var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
	nodeIsDate = nodeUtil && nodeUtil.isDate,
	nodeIsMap = nodeUtil && nodeUtil.isMap,
	nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
	nodeIsSet = nodeUtil && nodeUtil.isSet,
	nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

// function apply(func: Function, thisArg: any, args: any[]): any {
// 	switch (args.length) {
// 		case 0: return func.call(thisArg);
// 		case 1: return func.call(thisArg, args[0]);
// 		case 2: return func.call(thisArg, args[0], args[1]);
// 		case 3: return func.call(thisArg, args[0], args[1], args[2]);
// 	}
// 	return func.apply(thisArg, args);
// }

// function arrayAggregator(array: any[], setter: Function, iteratee: Function, accumulator: any): Function {
// 	var index = -1,
// 		length = array == null ? 0 : array.length;

// 	while (++index < length) {
// 		var value = array[index];
// 		setter(accumulator, value, iteratee(value), array);
// 	}
// 	return accumulator;
// }

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

// function arrayEachRight(array: any[], iteratee: Function): any[] {
// 	var length = array == null ? 0 : array.length;

// 	while (length--) {
// 		if (iteratee(array[length], length, array) === false) {
// 			break;
// 		}
// 	}
// 	return array;
// }

// function arrayEvery(array: any[], predicate: Function): boolean {
// 	var index = -1,
// 		length = array == null ? 0 : array.length;

// 	while (++index < length) {
// 		if (!predicate(array[index], index, array)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }

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

// function arrayIncludes(array: any[], value: any): boolean {
// 	var length = array == null ? 0 : array.length;
// 	return !!length && baseIndexOf(array, value, 0) > -1;
// }

// function arrayIncludesWith(array: any[], value: any, comparator: Function): boolean {
// 	var index = -1,
// 		length = array == null ? 0 : array.length;

// 	while (++index < length) {
// 		if (comparator(value, array[index])) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

function arrayMap(array: any, iteratee: Function): any[] {
	var index = -1,
		length = array == null ? 0 : array.length,
		result = Array(length);

	while (++index < length) {
		result[index] = iteratee(array[index], index, array);
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

// function arrayReduce(array: any[], iteratee: Function, accumulator: any, initAccum?: boolean): any {
// 	var index = -1,
// 		length = array == null ? 0 : array.length;

// 	if (initAccum && length) {
// 		accumulator = array[++index];
// 	}
// 	while (++index < length) {
// 		accumulator = iteratee(accumulator, array[index], index, array);
// 	}
// 	return accumulator;
// }

// function arrayReduceRight(array: any[], iteratee: Function, accumulator: any, initAccum: boolean): any {
// 	var length = array == null ? 0 : array.length;
// 	if (initAccum && length) {
// 		accumulator = array[--length];
// 	}
// 	while (length--) {
// 		accumulator = iteratee(accumulator, array[length], length, array);
// 	}
// 	return accumulator;
// }

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

// var asciiSize = baseProperty('length');

// function asciiToArray(string: string): any[] {
// 	return string.split('');
// }

// function asciiWords(string: string): any[] {
// 	return string.match(reAsciiWord) || [];
// }

// function baseFindKey(collection: any[] | any, predicate: Function, eachFunc: Function): any {
// 	var result: any;
// 	eachFunc(collection, function (value: any, key: string, collection: any[]) {
// 		if (predicate(value, key, collection)) {
// 			result = key;
// 			return false;
// 		}
// 	});
// 	return result;
// }

// function baseFindIndex(array: any[], predicate: Function, fromIndex: number, fromRight?: boolean): number {
// 	var length = array.length,
// 		index = fromIndex + (fromRight ? 1 : -1);

// 	while ((fromRight ? index-- : ++index < length)) {
// 		if (predicate(array[index], index, array)) {
// 			return index;
// 		}
// 	}
// 	return -1;
// }

// function baseIndexOf(array: any[], value: any, fromIndex: number): number {
// 	return value === value
// 		? strictIndexOf(array, value, fromIndex)
// 		: baseFindIndex(array, baseIsNaN, fromIndex);
// }

// function baseIndexOfWith(array: any[], value: any, fromIndex: number, comparator: Function): number {
// 	var index = fromIndex - 1,
// 		length = array.length;

// 	while (++index < length) {
// 		if (comparator(array[index], value)) {
// 			return index;
// 		}
// 	}
// 	return -1;
// }

// function baseIsNaN(value: any): boolean {
// 	return value !== value;
// }

// function baseMean(array: any[], iteratee: Function): number {
// 	var length = array == null ? 0 : array.length;
// 	return length ? (baseSum(array, iteratee) / length) : NAN;
// }

// function baseProperty(key: string): Function {
// 	return function (object: any) {
// 		return object == null ? undefined : object[key];
// 	};
// }

// function basePropertyOf(object: any): Function {
// 	return function (key: string) {
// 		return object == null ? undefined : object[key];
// 	};
// }

// function baseReduce(collection: any[] | any, iteratee: Function, accumulator: any, initAccum: boolean, eachFunc: Function): any {
// 	eachFunc(collection, function (value: any, index: number, collection: any[]) {
// 		accumulator = initAccum
// 			? (initAccum = false, value)
// 			: iteratee(accumulator, value, index, collection);
// 	});
// 	return accumulator;
// }

// function baseSortBy(array: any[], comparer: (first: any, second: any) => number): any[] {
// 	var length = array.length;

// 	array.sort(comparer);
// 	while (length--) {
// 		array[length] = array[length].value;
// 	}
// 	return array;
// }

// function baseSum(array: any[], iteratee: Function): number {
// 	var result: number,
// 		index = -1,
// 		length = array.length;

// 	while (++index < length) {
// 		var current = iteratee(array[index]);
// 		if (current !== undefined) {
// 			result = result === undefined ? current : (result + current);
// 		}
// 	}
// 	return result;
// }

function baseTimes(n: number, iteratee: Function): any[] {
	var index = -1,
		result = Array(n);

	while (++index < n) {
		result[index] = iteratee(index);
	}
	return result;
}

// function baseToPairs(object: any, props: any[]): any {
// 	return arrayMap(props, function (key: string) {
// 		return [key, object[key]];
// 	});
// }

function baseUnary(func: Function): (value: any) => boolean {
	return function (value: any): any {
		return func(value);
	};
}

// function baseValues(object: any, props: any[]): any {
// 	return arrayMap(props, function (key: string) {
// 		return object[key];
// 	});
// }

function cacheHas(cache: any, key: string): boolean {
	return cache.has(key);
}

// function charsStartIndex(strSymbols: any[], chrSymbols: any[]): number {
// 	var index = -1,
// 		length = strSymbols.length;

// 	while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) { }
// 	return index;
// }

// function charsEndIndex(strSymbols: any[], chrSymbols: any[]): number {
// 	var index = strSymbols.length;

// 	while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) { }
// 	return index;
// }

// function countHolders(array: any[], placeholder: any): number {
// 	var length = array.length,
// 		result = 0;

// 	while (length--) {
// 		if (array[length] === placeholder) {
// 			++result;
// 		}
// 	}
// 	return result;
// }

// var deburrLetter: ReplacerType = basePropertyOf(deburredLetters) as ReplacerType;
// var escapeHtmlChar: ReplacerType = basePropertyOf(htmlEscapes) as ReplacerType;

// function escapeStringChar(chr: string): string {
// 	return '\\' + stringEscapes[chr];
// }

function getValue(object: any, key: string): any {
	return object == null ? undefined : object[key];
}

// function hasUnicode(string: string): boolean {
// 	return reHasUnicode.test(string);
// }

// function hasUnicodeWord(string: string): boolean {
// 	return reHasUnicodeWord.test(string);
// }

// function iteratorToArray(iterator: any): any[] {
// 	var data: any,
// 		result = [];

// 	while (!(data = iterator.next()).done) {
// 		result.push(data.value);
// 	}
// 	return result;
// }

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

// function replaceHolders(array: any[], placeholder: any): any[] {
// 	var index = -1,
// 		length = array.length,
// 		resIndex = 0,
// 		result = [];

// 	while (++index < length) {
// 		var value = array[index];
// 		if (value === placeholder || value === PLACEHOLDER) {
// 			array[index] = PLACEHOLDER;
// 			result[resIndex++] = index;
// 		}
// 	}
// 	return result;
// }

function setToArray(set: any): any[] {
	var index = -1,
		result = Array(set.size);

	set.forEach(function (value: any) {
		result[++index] = value;
	});
	return result;
}

// function setToPairs(set: any): any[] {
// 	var index = -1,
// 		result = Array(set.size);

// 	set.forEach(function (value: any) {
// 		result[++index] = [value, value];
// 	});
// 	return result;
// }

// function strictIndexOf(array: any[], value: any, fromIndex: number): number {
// 	var index = fromIndex - 1,
// 		length = array.length;

// 	while (++index < length) {
// 		if (array[index] === value) {
// 			return index;
// 		}
// 	}
// 	return -1;
// }

// function strictLastIndexOf(array: any[], value: any, fromIndex: number): number {
// 	var index = fromIndex + 1;
// 	while (index--) {
// 		if (array[index] === value) {
// 			return index;
// 		}
// 	}
// 	return index;
// }

// function stringSize(string: string): number {
// 	return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
// }

// function stringToArray(string: string): any[] {
// 	return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
// }

// var unescapeHtmlChar: Function = basePropertyOf(htmlUnescapes);

// function unicodeSize(string: string): number {
// 	var result = reUnicode.lastIndex = 0;
// 	while (reUnicode.test(string)) {
// 		++result;
// 	}
// 	return result;
// }

// function unicodeToArray(string: string): any[] {
// 	return string.match(reUnicode) || [];
// }

// function unicodeWords(string: string): any[] {
// 	return string.match(reUnicodeWord) || [];
// }

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

// var Array = context.Array,
// 	Date = context.Date,
// 	Error = context.Error,
// 	Function = context.Function,
// 	Math = context.Math,
// 	Object = context.Object,
// 	RegExp = context.RegExp,
// 	String = context.String,
// 	TypeError = context.TypeError;
var arrayProto = Array.prototype,
	funcProto = Function.prototype,
	objectProto = Object.prototype;
var coreJsData = context['__core-js_shared__'];
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var idCounter = 0;
var maskSrcKey = (function () {
	var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	return uid ? ('Symbol(src)_1.' + uid) : '';
}());

var nativeObjectToString = objectProto.toString;
var objectCtorString = funcToString.call(Object);
var oldDash = root._;
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
	spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
	symIterator = Symbol ? Symbol.iterator : undefined,
	symToStringTag = Symbol ? Symbol.toStringTag : undefined;
// var defineProperty = (function () {
// 	try {
// 		var func = getNative(Object, 'defineProperty');
// 		func({}, '', {});
// 		return func;
// 	} catch (e) { }
// }());
var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
	ctxNow = Date && Date.now !== root.Date.now && Date.now,
	ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
var nativeCeil = Math.ceil,
	nativeFloor = Math.floor,
	nativeGetSymbols = Object.getOwnPropertySymbols,
	nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	nativeIsFinite = context.isFinite,
	nativeJoin = arrayProto.join,
	nativeKeys = overArg(Object.keys, Object),
	nativeMax = Math.max,
	nativeMin = Math.min,
	nativeNow = Date.now,
	nativeParseInt = context.parseInt,
	nativeRandom = Math.random,
	nativeReverse = arrayProto.reverse;
var DataView = getNative(context, 'DataView'),
	Map = getNative(context, 'Map'),
	Promise = getNative(context, 'Promise'),
	Set = getNative(context, 'Set'),
	WeakMap = getNative(context, 'WeakMap'),
	nativeCreate = getNative(Object, 'create');
var metaMap = WeakMap && new WeakMap;
var realNames = {};
var dataViewCtorString = toSource(DataView),
	mapCtorString = toSource(Map),
	promiseCtorString = toSource(Promise),
	setCtorString = toSource(Set),
	weakMapCtorString = toSource(WeakMap);
var symbolProto = Symbol ? Symbol.prototype : undefined,
	symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
	symbolToString = symbolProto ? symbolProto.toString : undefined;

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

// function baseLodash() {
// 	// No operation performed.
// }

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

// function arraySample(array: any[]): any {
// 	var length = array.length;
// 	return length ? array[baseRandom(0, length - 1)] : undefined;
// }

// function arraySampleSize(array: any[], n: number): any[] {
// 	return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
// }

// function arrayShuffle(array: any[]): any[] {
// 	return shuffleSelf(copyArray(array));
// }

// function assignMergeValue(object: any, key: string, value: any): void {
// 	if ((value !== undefined && !eq(object[key], value)) ||
// 		(value === undefined && !(key in object))) {
// 		baseAssignValue(object, key, value);
// 	}
// }

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

// function baseAggregator(collection: any[] | any, setter: Function, iteratee: Function, accumulator: any): Function {
// 	baseEach(collection, function (value: any, key: string, collection: any) {
// 		setter(accumulator, value, iteratee(value), collection);
// 	});
// 	return accumulator;
// }

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

// function baseAt(object: any, paths: string[]): any[] {
// 	var index = -1,
// 		length = paths.length,
// 		result = Array(length),
// 		skip = object == null;

// 	while (++index < length) {
// 		result[index] = skip ? undefined : get(object, paths[index]);
// 	}
// 	return result;
// }

// function baseClamp(number: number, lower: number, upper: number): number {
// 	if (number === number) {
// 		if (upper !== undefined) {
// 			number = number <= upper ? number : upper;
// 		}
// 		if (lower !== undefined) {
// 			number = number >= lower ? number : lower;
// 		}
// 	}
// 	return number;
// }

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

// function baseConforms(source: any): Function {
// 	var props = keys(source);
// 	return function (object) {
// 		return baseConformsTo(object, source, props);
// 	};
// }

// function baseConformsTo(object: any, source: any, props: any): boolean {
// 	var length = props.length;
// 	if (object == null) {
// 		return !length;
// 	}
// 	object = Object(object);
// 	while (length--) {
// 		var key = props[length],
// 			predicate = source[key],
// 			value = object[key];

// 		if ((value === undefined && !(key in object)) || !predicate(value)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }

// function baseDelay(func: Function, wait: number, args: any[]): number | any {
// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	return setTimeout(function () { func.apply(undefined, args); }, wait);
// }

// function baseDifference(array: any[], values: any[], iteratee?: Function, comparator?: Function): any[] {
// 	var index = -1,
// 		includes = arrayIncludes,
// 		isCommon = true,
// 		length = array.length,
// 		result = [],
// 		valuesLength = values.length;

// 	if (!length) {
// 		return result;
// 	}
// 	if (iteratee) {
// 		values = arrayMap(values, baseUnary(iteratee));
// 	}
// 	if (comparator) {
// 		includes = arrayIncludesWith;
// 		isCommon = false;
// 	}
// 	else if (values.length >= LARGE_ARRAY_SIZE) {
// 		includes = cacheHas;
// 		isCommon = false;
// 		values = new SetCache(values);
// 	}
// 	outer:
// 	while (++index < length) {
// 		var value = array[index],
// 			computed = iteratee == null ? value : iteratee(value);

// 		value = (comparator || value !== 0) ? value : 0;
// 		if (isCommon && computed === computed) {
// 			var valuesIndex = valuesLength;
// 			while (valuesIndex--) {
// 				if (values[valuesIndex] === computed) {
// 					continue outer;
// 				}
// 			}
// 			result.push(value);
// 		}
// 		else if (!includes(values, computed, comparator)) {
// 			result.push(value);
// 		}
// 	}
// 	return result;
// }

// /**
//  * The base implementation of `_.forEach` without support for iteratee shorthands.
//  *
//  * @private
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} iteratee The function invoked per iteration.
//  * @returns {Array|Object} Returns `collection`.
//  */
// var baseEach = createBaseEach(baseForOwn);

// /**
//  * The base implementation of `_.forEachRight` without support for iteratee shorthands.
//  *
//  * @private
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} iteratee The function invoked per iteration.
//  * @returns {Array|Object} Returns `collection`.
//  */
// var baseEachRight = createBaseEach(baseForOwnRight, true);

// /**
//  * The base implementation of `_.every` without support for iteratee shorthands.
//  *
//  * @private
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} predicate The function invoked per iteration.
//  * @returns {boolean} Returns `true` if all elements pass the predicate check,
//  *  else `false`
//  */
// function baseEvery(collection, predicate) {
// 	var result = true;
// 	baseEach(collection, function (value, index, collection) {
// 		result = !!predicate(value, index, collection);
// 		return result;
// 	});
// 	return result;
// }

// /**
//  * The base implementation of methods like `_.max` and `_.min` which accepts a
//  * `comparator` to determine the extremum value.
//  *
//  * @private
//  * @param {Array} array The array to iterate over.
//  * @param {Function} iteratee The iteratee invoked per iteration.
//  * @param {Function} comparator The comparator used to compare values.
//  * @returns {*} Returns the extremum value.
//  */
// function baseExtremum(array, iteratee, comparator) {
// 	var index = -1,
// 		length = array.length;

// 	while (++index < length) {
// 		var value = array[index],
// 			current = iteratee(value);

// 		if (current != null && (computed === undefined
// 			? (current === current && !isSymbol(current))
// 			: comparator(current, computed)
// 		)) {
// 			var computed = current,
// 				result = value;
// 		}
// 	}
// 	return result;
// }

// /**
//  * The base implementation of `_.fill` without an iteratee call guard.
//  *
//  * @private
//  * @param {Array} array The array to fill.
//  * @param {*} value The value to fill `array` with.
//  * @param {number} [start=0] The start position.
//  * @param {number} [end=array.length] The end position.
//  * @returns {Array} Returns `array`.
//  */
// function baseFill(array, value, start, end) {
// 	var length = array.length;

// 	start = toInteger(start);
// 	if (start < 0) {
// 		start = -start > length ? 0 : (length + start);
// 	}
// 	end = (end === undefined || end > length) ? length : toInteger(end);
// 	if (end < 0) {
// 		end += length;
// 	}
// 	end = start > end ? 0 : toLength(end);
// 	while (start < end) {
// 		array[start++] = value;
// 	}
// 	return array;
// }

// /**
//  * The base implementation of `_.filter` without support for iteratee shorthands.
//  *
//  * @private
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} predicate The function invoked per iteration.
//  * @returns {Array} Returns the new filtered array.
//  */
// function baseFilter(collection, predicate) {
// 	var result = [];
// 	baseEach(collection, function (value, index, collection) {
// 		if (predicate(value, index, collection)) {
// 			result.push(value);
// 		}
// 	});
// 	return result;
// }

// function baseFlatten(array: any[], depth: number, predicate?: (value: any) => boolean, isStrict?: boolean, result?: any[]): any[] {
// 	var index = -1,
// 		length = array.length;

// 	predicate || (predicate = isFlattenable);
// 	result || (result = []);

// 	while (++index < length) {
// 		var value = array[index];
// 		if (depth > 0 && predicate(value)) {
// 			if (depth > 1) {
// 				// Recursively flatten arrays (susceptible to call stack limits).
// 				baseFlatten(value, depth - 1, predicate, isStrict, result);
// 			} else {
// 				arrayPush(result, value);
// 			}
// 		} else if (!isStrict) {
// 			result[result.length] = value;
// 		}
// 	}
// 	return result;
// }

// /**
//  * The base implementation of `baseForOwn` which iterates over `object`
//  * properties returned by `keysFunc` and invokes `iteratee` for each property.
//  * Iteratee functions may exit iteration early by explicitly returning `false`.
//  *
//  * @private
//  * @param {Object} object The object to iterate over.
//  * @param {Function} iteratee The function invoked per iteration.
//  * @param {Function} keysFunc The function to get the keys of `object`.
//  * @returns {Object} Returns `object`.
//  */
// var baseFor = createBaseFor();

// /**
//  * This function is like `baseFor` except that it iterates over properties
//  * in the opposite order.
//  *
//  * @private
//  * @param {Object} object The object to iterate over.
//  * @param {Function} iteratee The function invoked per iteration.
//  * @param {Function} keysFunc The function to get the keys of `object`.
//  * @returns {Object} Returns `object`.
//  */
// var baseForRight = createBaseFor(true);

// function baseForOwn(object: any, iteratee: Function): any {
// 	return object && baseFor(object, iteratee, keys);
// }

// function baseForOwnRight(object: any, iteratee: Function): any {
// 	return object && baseForRight(object, iteratee, keys);
// }

// function baseFunctions(object: any, props: string[]): string[] {
// 	return arrayFilter(props, function (key) {
// 		return isFunction(object[key]);
// 	});
// }

// function baseGet(object: any, path: string[] | string): any {
// 	path = castPath(path, object);

// 	var index = 0,
// 		length = path.length;

// 	while (object != null && index < length) {
// 		object = object[toKey(path[index++])];
// 	}
// 	return (index && index == length) ? object : undefined;
// }

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

// function baseGt(value: any, other: any): boolean {
// 	return value > other;
// }

// function baseHas(object: any, key: any[] | string): boolean {
// 	return object != null && hasOwnProperty.call(object, key);
// }

// function baseHasIn(object: any, key: any[] | string): boolean {
// 	return object != null && key in Object(object);
// }

// function baseInRange(number: number, start: number, end: number): boolean {
// 	return number >= nativeMin(start, end) && number < nativeMax(start, end);
// }

// function baseIntersection(arrays: any[], iteratee?: Function, comparator?: Function): any[] {
// 	var includes = comparator ? arrayIncludesWith : arrayIncludes,
// 		length = arrays[0].length,
// 		othLength = arrays.length,
// 		othIndex = othLength,
// 		caches = Array(othLength),
// 		maxLength = Infinity,
// 		result = [];

// 	while (othIndex--) {
// 		var array = arrays[othIndex];
// 		if (othIndex && iteratee) {
// 			array = arrayMap(array, baseUnary(iteratee));
// 		}
// 		maxLength = nativeMin(array.length, maxLength);
// 		caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
// 			? new SetCache(othIndex && array)
// 			: undefined;
// 	}
// 	array = arrays[0];

// 	var index = -1,
// 		seen = caches[0];

// 	outer:
// 	while (++index < length && result.length < maxLength) {
// 		var value = array[index],
// 			computed = iteratee ? iteratee(value) : value;

// 		value = (comparator || value !== 0) ? value : 0;
// 		if (!(seen
// 			? cacheHas(seen, computed)
// 			: includes(result, computed, comparator)
// 		)) {
// 			othIndex = othLength;
// 			while (--othIndex) {
// 				var cache = caches[othIndex];
// 				if (!(cache
// 					? cacheHas(cache, computed)
// 					: includes(arrays[othIndex], computed, comparator))
// 				) {
// 					continue outer;
// 				}
// 			}
// 			if (seen) {
// 				seen.push(computed);
// 			}
// 			result.push(value);
// 		}
// 	}
// 	return result;
// }

// /**
//  * The base implementation of `_.invert` and `_.invertBy` which inverts
//  * `object` with values transformed by `iteratee` and set by `setter`.
//  *
//  * @private
//  * @param {Object} object The object to iterate over.
//  * @param {Function} setter The function to set `accumulator` values.
//  * @param {Function} iteratee The iteratee to transform values.
//  * @param {Object} accumulator The initial inverted object.
//  * @returns {Function} Returns `accumulator`.
//  */
// function baseInverter(object, setter, iteratee, accumulator) {
// 	baseForOwn(object, function (value, key, object) {
// 		setter(accumulator, iteratee(value), key, object);
// 	});
// 	return accumulator;
// }

// /**
//  * The base implementation of `_.invoke` without support for individual
//  * method arguments.
//  *
//  * @private
//  * @param {Object} object The object to query.
//  * @param {Array|string} path The path of the method to invoke.
//  * @param {Array} args The arguments to invoke the method with.
//  * @returns {*} Returns the result of the invoked method.
//  */
// function baseInvoke(object, path, args) {
// 	path = castPath(path, object);
// 	object = parent(object, path);
// 	var func = object == null ? object : object[toKey(last(path))];
// 	return func == null ? undefined : apply(func, object, args);
// }

function baseIsArguments(value: any): boolean {
	return isObjectLike(value) && baseGetTag(value) == argsTag;
}

// function baseIsArrayBuffer(value: any): boolean {
// 	return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
// }

// function baseIsDate(value: any): boolean {
// 	return isObjectLike(value) && baseGetTag(value) == dateTag;
// }

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

// function baseIsMatch(object: any, source: any, matchData: any[], customizer?: Function): boolean {
// 	var index = matchData.length,
// 		length = index,
// 		noCustomizer = !customizer;

// 	if (object == null) {
// 		return !length;
// 	}
// 	object = Object(object);
// 	while (index--) {
// 		var data = matchData[index];
// 		if ((noCustomizer && data[2])
// 			? data[1] !== object[data[0]]
// 			: !(data[0] in object)
// 		) {
// 			return false;
// 		}
// 	}
// 	while (++index < length) {
// 		data = matchData[index];
// 		var key = data[0],
// 			objValue = object[key],
// 			srcValue = data[1];

// 		if (noCustomizer && data[2]) {
// 			if (objValue === undefined && !(key in object)) {
// 				return false;
// 			}
// 		} else {
// 			var stack = new Stack;
// 			if (customizer) {
// 				var result = customizer(objValue, srcValue, key, object, source, stack);
// 			}
// 			if (!(result === undefined
// 				? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
// 				: result
// 			)) {
// 				return false;
// 			}
// 		}
// 	}
// 	return true;
// }

function baseIsNative(value: any): boolean {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	return pattern.test(toSource(value));
}

// function baseIsRegExp(value: any): boolean {
// 	return isObjectLike(value) && baseGetTag(value) == regexpTag;
// }

function baseIsSet(value: any): boolean {
	return isObjectLike(value) && getTag(value) == setTag;
}

function baseIsTypedArray(value: any): boolean {
	return isObjectLike(value) &&
		isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

// function baseIteratee(value: any): Function {
// 	// Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
// 	// See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
// 	if (typeof value == 'function') {
// 		return value;
// 	}
// 	if (value == null) {
// 		return identity;
// 	}
// 	if (typeof value == 'object') {
// 		return isArray(value)
// 			? baseMatchesProperty(value[0], value[1])
// 			: baseMatches(value);
// 	}
// 	return property(value);
// }

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

// function baseLt(value: any, other: any): boolean {
// 	return value < other;
// }

// /**
//  * The base implementation of `_.map` without support for iteratee shorthands.
//  *
//  * @private
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} iteratee The function invoked per iteration.
//  * @returns {Array} Returns the new mapped array.
//  */
// function baseMap(collection, iteratee) {
// 	var index = -1,
// 		result = isArrayLike(collection) ? Array(collection.length) : [];

// 	baseEach(collection, function (value, key, collection) {
// 		result[++index] = iteratee(value, key, collection);
// 	});
// 	return result;
// }

// function baseMatches(source: any): Function {
// 	var matchData = getMatchData(source);
// 	if (matchData.length == 1 && matchData[0][2]) {
// 		return matchesStrictComparable(matchData[0][0], matchData[0][1]);
// 	}
// 	return function (object: any) {
// 		return object === source || baseIsMatch(object, source, matchData);
// 	};
// }

// /**
//  * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
//  *
//  * @private
//  * @param {string} path The path of the property to get.
//  * @param {*} srcValue The value to match.
//  * @returns {Function} Returns the new spec function.
//  */
// function baseMatchesProperty(path, srcValue) {
// 	if (isKey(path) && isStrictComparable(srcValue)) {
// 		return matchesStrictComparable(toKey(path), srcValue);
// 	}
// 	return function (object) {
// 		var objValue = get(object, path);
// 		return (objValue === undefined && objValue === srcValue)
// 			? hasIn(object, path)
// 			: baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
// 	};
// }

// function baseMerge(object: any, source: any, srcIndex: number , customizer: Function, stack?: any): void {
// 	if (object === source) {
// 		return;
// 	}
// 	baseFor(source, function (srcValue, key) {
// 		stack || (stack = new Stack());
// 		if (isObject(srcValue)) {
// 			baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
// 		}
// 		else {
// 			var newValue = customizer
// 				? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
// 				: undefined;

// 			if (newValue === undefined) {
// 				newValue = srcValue;
// 			}
// 			assignMergeValue(object, key, newValue);
// 		}
// 	}, keysIn);
// }

// /**
//  * A specialized version of `baseMerge` for arrays and objects which performs
//  * deep merges and tracks traversed objects enabling objects with circular
//  * references to be merged.
//  *
//  * @private
//  * @param {Object} object The destination object.
//  * @param {Object} source The source object.
//  * @param {string} key The key of the value to merge.
//  * @param {number} srcIndex The index of `source`.
//  * @param {Function} mergeFunc The function to merge values.
//  * @param {Function} [customizer] The function to customize assigned values.
//  * @param {Object} [stack] Tracks traversed source values and their merged
//  *  counterparts.
//  */
// function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
// 	var objValue = safeGet(object, key),
// 		srcValue = safeGet(source, key),
// 		stacked = stack.get(srcValue);

// 	if (stacked) {
// 		assignMergeValue(object, key, stacked);
// 		return;
// 	}
// 	var newValue = customizer
// 		? customizer(objValue, srcValue, (key + ''), object, source, stack)
// 		: undefined;

// 	var isCommon = newValue === undefined;

// 	if (isCommon) {
// 		var isArr = isArray(srcValue),
// 			isBuff = !isArr && isBuffer(srcValue),
// 			isTyped = !isArr && !isBuff && isTypedArray(srcValue);

// 		newValue = srcValue;
// 		if (isArr || isBuff || isTyped) {
// 			if (isArray(objValue)) {
// 				newValue = objValue;
// 			}
// 			else if (isArrayLikeObject(objValue)) {
// 				newValue = copyArray(objValue);
// 			}
// 			else if (isBuff) {
// 				isCommon = false;
// 				newValue = cloneBuffer(srcValue, true);
// 			}
// 			else if (isTyped) {
// 				isCommon = false;
// 				newValue = cloneTypedArray(srcValue, true);
// 			}
// 			else {
// 				newValue = [];
// 			}
// 		}
// 		else if (isPlainObject(srcValue) || isArguments(srcValue)) {
// 			newValue = objValue;
// 			if (isArguments(objValue)) {
// 				newValue = toPlainObject(objValue);
// 			}
// 			else if (!isObject(objValue) || isFunction(objValue)) {
// 				newValue = initCloneObject(srcValue);
// 			}
// 		}
// 		else {
// 			isCommon = false;
// 		}
// 	}
// 	if (isCommon) {
// 		// Recursively merge objects and arrays (susceptible to call stack limits).
// 		stack.set(srcValue, newValue);
// 		mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
// 		stack['delete'](srcValue);
// 	}
// 	assignMergeValue(object, key, newValue);
// }

// function baseNth(array: any[], n: number): any {
// 	var length = array.length;
// 	if (!length) {
// 		return;
// 	}
// 	n += n < 0 ? length : 0;
// 	return isIndex(n, length) ? array[n] : undefined;
// }

// function baseOrderBy(collection: any[] | any, iteratees: any[], orders: string[]): any[] {
// 	var index = -1;
// 	iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));

// 	var result = baseMap(collection, function (value: any, _key: string, _collection: any) {
// 		var criteria = arrayMap(iteratees, function (iteratee: Function) {
// 			return iteratee(value);
// 		});
// 		return { 'criteria': criteria, 'index': ++index, 'value': value };
// 	});

// 	return baseSortBy(result, function (object, other) {
// 		return compareMultiple(object, other, orders);
// 	});
// }

// function basePick(object: any, paths: string[]): any {
// 	return basePickBy(object, paths, function (value: any, path: string) {
// 		return hasIn(object, path);
// 	});
// }

// function basePickBy(object: any, paths: string[], predicate: Function): any {
// 	var index = -1,
// 		length = paths.length,
// 		result = {};

// 	while (++index < length) {
// 		var path = paths[index],
// 			value = baseGet(object, path);

// 		if (predicate(value, path)) {
// 			baseSet(result, castPath(path, object), value);
// 		}
// 	}
// 	return result;
// }

// function basePropertyDeep(path: any[] | string): Function {
// 	return function (object: any) {
// 		return baseGet(object, path);
// 	};
// }

// function basePullAll(array: any[], values: any[], iteratee?: Function, comparator?: Function): any[] {
// 	var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
// 		index = -1,
// 		length = values.length,
// 		seen = array;

// 	if (array === values) {
// 		values = copyArray(values);
// 	}
// 	if (iteratee) {
// 		seen = arrayMap(array, baseUnary(iteratee));
// 	}
// 	while (++index < length) {
// 		var fromIndex = 0,
// 			value = values[index],
// 			computed = iteratee ? iteratee(value) : value;

// 		while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
// 			if (seen !== array) {
// 				splice.call(seen, fromIndex, 1);
// 			}
// 			splice.call(array, fromIndex, 1);
// 		}
// 	}
// 	return array;
// }

// function basePullAt(array: any[], indexes: number[]): any[] {
// 	var length = array ? indexes.length : 0,
// 		lastIndex = length - 1;

// 	while (length--) {
// 		var index = indexes[length];
// 		if (length == lastIndex || index !== previous) {
// 			var previous = index;
// 			if (isIndex(index)) {
// 				splice.call(array, index, 1);
// 			} else {
// 				baseUnset(array, index);
// 			}
// 		}
// 	}
// 	return array;
// }

// function baseRandom(lower: number, upper: number): number {
// 	return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
// }

// function baseRange(start: number, end: number, step: number, fromRight: boolean): number[] {
// 	var index = -1,
// 		length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
// 		result = Array(length);

// 	while (length--) {
// 		result[fromRight ? length : ++index] = start;
// 		start += step;
// 	}
// 	return result;
// }

// function baseRepeat(string: string, n: number): string {
// 	var result = '';
// 	if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
// 		return result;
// 	}
// 	// Leverage the exponentiation by squaring algorithm for a faster repeat.
// 	// See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
// 	do {
// 		if (n % 2) {
// 			result += string;
// 		}
// 		n = nativeFloor(n / 2);
// 		if (n) {
// 			string += string;
// 		}
// 	} while (n);

// 	return result;
// }

// function baseRest(func: Function, start?: number): Function {
// 	return setToString(overRest(func, start, identity), func + '');
// }

// function baseSample(collection: any[] | any): any {
// 	return arraySample(values(collection));
// }

// function baseSampleSize(collection: any[] | any, n: number): any[] {
// 	var array = values(collection);
// 	return shuffleSelf(array, baseClamp(n, 0, array.length));
// }

// function baseSet(object: any, path: string[] | string, value: any, customizer?: Function): any {
// 	if (!isObject(object)) {
// 		return object;
// 	}
// 	path = castPath(path, object);

// 	var index = -1,
// 		length = path.length,
// 		lastIndex = length - 1,
// 		nested = object;

// 	while (nested != null && ++index < length) {
// 		var key = toKey(path[index]),
// 			newValue = value;

// 		if (index != lastIndex) {
// 			var objValue = nested[key];
// 			newValue = customizer ? customizer(objValue, key, nested) : undefined;
// 			if (newValue === undefined) {
// 				newValue = isObject(objValue)
// 					? objValue
// 					: (isIndex(path[index + 1]) ? [] : {});
// 			}
// 		}
// 		assignValue(nested, key, newValue);
// 		nested = nested[key];
// 	}
// 	return object;
// }

// var baseSetData: (func: Function, data: any) => Function = !metaMap ? identity : function (func, data) {
// 	metaMap.set(func, data);
// 	return func;
// };

// var baseSetToString: (func: Function, string: Function) => Function = !defineProperty ? identity : function (func, string) {
// 	return defineProperty(func, 'toString', {
// 		'configurable': true,
// 		'enumerable': false,
// 		'value': constant(string),
// 		'writable': true
// 	});
// };

// function baseShuffle(collection: any): any[] {
// 	return shuffleSelf(values(collection));
// }

// function baseSlice(array: any[], start: number, end: number): any[] {
// 	var index = -1,
// 		length = array.length;

// 	if (start < 0) {
// 		start = -start > length ? 0 : (length + start);
// 	}
// 	end = end > length ? length : end;
// 	if (end < 0) {
// 		end += length;
// 	}
// 	length = start > end ? 0 : ((end - start) >>> 0);
// 	start >>>= 0;

// 	var result = Array(length);
// 	while (++index < length) {
// 		result[index] = array[index + start];
// 	}
// 	return result;
// }

// function baseSome(collection: any[] | any, predicate: Function): boolean {
// 	var result: boolean;

// 	baseEach(collection, function (value: any, index: number, collection: any) {
// 		result = predicate(value, index, collection);
// 		return !result;
// 	});
// 	return !!result;
// }

// function baseSortedIndex(array: any[], value: any, retHighest?: boolean): number {
// 	var low = 0,
// 		high = array == null ? low : array.length;

// 	if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
// 		while (low < high) {
// 			var mid = (low + high) >>> 1,
// 				computed = array[mid];

// 			if (computed !== null && !isSymbol(computed) &&
// 				(retHighest ? (computed <= value) : (computed < value))) {
// 				low = mid + 1;
// 			} else {
// 				high = mid;
// 			}
// 		}
// 		return high;
// 	}
// 	return baseSortedIndexBy(array, value, identity, retHighest);
// }

// function baseSortedIndexBy(array: any[], value: any, iteratee: Function, retHighest?: boolean): number {
// 	value = iteratee(value);

// 	var low = 0,
// 		high = array == null ? 0 : array.length,
// 		valIsNaN = value !== value,
// 		valIsNull = value === null,
// 		valIsSymbol = isSymbol(value),
// 		valIsUndefined = value === undefined;

// 	while (low < high) {
// 		var mid = nativeFloor((low + high) / 2),
// 			computed = iteratee(array[mid]),
// 			othIsDefined = computed !== undefined,
// 			othIsNull = computed === null,
// 			othIsReflexive = computed === computed,
// 			othIsSymbol = isSymbol(computed);

// 		if (valIsNaN) {
// 			var setLow = retHighest || othIsReflexive;
// 		} else if (valIsUndefined) {
// 			setLow = othIsReflexive && (retHighest || othIsDefined);
// 		} else if (valIsNull) {
// 			setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
// 		} else if (valIsSymbol) {
// 			setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
// 		} else if (othIsNull || othIsSymbol) {
// 			setLow = false;
// 		} else {
// 			setLow = retHighest ? (computed <= value) : (computed < value);
// 		}
// 		if (setLow) {
// 			low = mid + 1;
// 		} else {
// 			high = mid;
// 		}
// 	}
// 	return nativeMin(high, MAX_ARRAY_INDEX);
// }

// function baseSortedUniq(array: any[], iteratee?: Function): any[] {
// 	var index = -1,
// 		length = array.length,
// 		resIndex = 0,
// 		result = [];

// 	while (++index < length) {
// 		var value = array[index],
// 			computed = iteratee ? iteratee(value) : value;

// 		if (!index || !eq(computed, seen)) {
// 			var seen = computed;
// 			result[resIndex++] = value === 0 ? 0 : value;
// 		}
// 	}
// 	return result;
// }

// function baseToNumber(value: any): number {
// 	if (typeof value == 'number') {
// 		return value;
// 	}
// 	if (isSymbol(value)) {
// 		return NAN;
// 	}
// 	return +value;
// }

function baseToString(value: any): string {
	// Exit early for strings to avoid a performance hit in some environments.
	if (typeof value == 'string') {
		return value;
	}
	if (isArray(value)) {
		// Recursively convert values (susceptible to call stack limits).
		return arrayMap(value, baseToString) + '';
	}
	if (isSymbol(value)) {
		return symbolToString ? symbolToString.call(value) : '';
	}
	var result = (value + '');
	return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

// function baseUniq(array: any[], iteratee?: Function, comparator?: Function): any[] {
// 	var index = -1,
// 		includes = arrayIncludes,
// 		length = array.length,
// 		isCommon = true,
// 		result = [],
// 		seen = result;

// 	if (comparator) {
// 		isCommon = false;
// 		includes = arrayIncludesWith;
// 	}
// 	else if (length >= LARGE_ARRAY_SIZE) {
// 		var set = iteratee ? null : createSet(array);
// 		if (set) {
// 			return setToArray(set);
// 		}
// 		isCommon = false;
// 		includes = cacheHas;
// 		seen = new SetCache();
// 	}
// 	else {
// 		seen = iteratee ? [] : result;
// 	}
// 	outer:
// 	while (++index < length) {
// 		var value = array[index],
// 			computed = iteratee ? iteratee(value) : value;

// 		value = (comparator || value !== 0) ? value : 0;
// 		if (isCommon && computed === computed) {
// 			var seenIndex = seen.length;
// 			while (seenIndex--) {
// 				if (seen[seenIndex] === computed) {
// 					continue outer;
// 				}
// 			}
// 			if (iteratee) {
// 				seen.push(computed);
// 			}
// 			result.push(value);
// 		}
// 		else if (!includes(seen, computed, comparator)) {
// 			if (seen !== result) {
// 				seen.push(computed);
// 			}
// 			result.push(value);
// 		}
// 	}
// 	return result;
// }

// function baseUnset(object: any, path: any[] | any): boolean {
// 	path = castPath(path, object);
// 	object = parent(object, path);
// 	return object == null || delete object[toKey(last(path))];
// }

// function baseUpdate(object: any, path: string[] | string, updater: Function, customizer: Function): any {
// 	return baseSet(object, path, updater(baseGet(object, path)), customizer);
// }

// function baseWhile(array: any[], predicate: Function, isDrop: boolean, fromRight?: boolean): any[] {
// 	var length = array.length,
// 		index = fromRight ? length : -1;

// 	while ((fromRight ? index-- : ++index < length) &&
// 		predicate(array[index], index, array)) { }

// 	return isDrop
// 		? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
// 		: baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
// }

// function baseWrapperValue(value: any, actions: any[]): any {
// 	var result = value;
// 	if (result instanceof LazyWrapper) {
// 		result = result.value();
// 	}
// 	return arrayReduce(actions, function (result, action) {
// 		return action.func.apply(action.thisArg, arrayPush([result], action.args));
// 	}, result);
// }

// function baseXor(arrays: any[], iteratee?: Function, comparator?: Function): any[] {
// 	var length = arrays.length;
// 	if (length < 2) {
// 		return length ? baseUniq(arrays[0]) : [];
// 	}
// 	var index = -1,
// 		result = Array(length);

// 	while (++index < length) {
// 		var array = arrays[index],
// 			othIndex = -1;

// 		while (++othIndex < length) {
// 			if (othIndex != index) {
// 				result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
// 			}
// 		}
// 	}
// 	return baseUniq(baseFlatten(result, 1), iteratee, comparator);
// }

// function baseZipObject(props: string[], values: any[], assignFunc: Function): any {
// 	var index = -1,
// 		length = props.length,
// 		valsLength = values.length,
// 		result = {};

// 	while (++index < length) {
// 		var value = index < valsLength ? values[index] : undefined;
// 		assignFunc(result, props[index], value);
// 	}
// 	return result;
// }

// function castArrayLikeObject(value: any): any[] | any {
// 	return isArrayLikeObject(value) ? value : [];
// }

// function castFunction(value: any): Function {
// 	return typeof value == 'function' ? value : identity;
// }

// function castPath(value: any, object: any): any[] {
// 	if (isArray(value)) {
// 		return value;
// 	}

// 	return isKey(value, object) ? [value] : stringToPath(toString(value));
// }

// var castRest: (func: Function) => Function = baseRest;

// function castSlice(array: any[], start: number, end?: number): any[] {
// 	var length = array.length;
// 	end = end === undefined ? length : end;
// 	return (!start && end >= length) ? array : baseSlice(array, start, end);
// }

// var clearTimeout: (obj: number | any) => void = ctxClearTimeout || function (id) {
// 	return root.clearTimeout(id);
// };

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

// function compareAscending(value: any, other: any): number {
// 	if (value !== other) {
// 		var valIsDefined = value !== undefined,
// 			valIsNull = value === null,
// 			valIsReflexive = value === value,
// 			valIsSymbol = isSymbol(value);

// 		var othIsDefined = other !== undefined,
// 			othIsNull = other === null,
// 			othIsReflexive = other === other,
// 			othIsSymbol = isSymbol(other);

// 		if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
// 			(valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
// 			(valIsNull && othIsDefined && othIsReflexive) ||
// 			(!valIsDefined && othIsReflexive) ||
// 			!valIsReflexive) {
// 			return 1;
// 		}
// 		if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
// 			(othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
// 			(othIsNull && valIsDefined && valIsReflexive) ||
// 			(!othIsDefined && valIsReflexive) ||
// 			!othIsReflexive) {
// 			return -1;
// 		}
// 	}
// 	return 0;
// }

// function compareMultiple(object: any, other: any, orders: boolean[] | string[]): number {
// 	var index = -1,
// 		objCriteria = object.criteria,
// 		othCriteria = other.criteria,
// 		length = objCriteria.length,
// 		ordersLength = orders.length;

// 	while (++index < length) {
// 		var result = compareAscending(objCriteria[index], othCriteria[index]);
// 		if (result) {
// 			if (index >= ordersLength) {
// 				return result;
// 			}
// 			var order = orders[index];
// 			return result * (order == 'desc' ? -1 : 1);
// 		}
// 	}
// 	// Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
// 	// that causes it, under certain circumstances, to provide the same value for
// 	// `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
// 	// for more details.
// 	//
// 	// This also ensures a stable sort in V8 and other engines.
// 	// See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
// 	return object.index - other.index;
// }

// function composeArgs(args: any[], partials: any[], holders: number[], isCurried?: boolean): any[] {
// 	var argsIndex = -1,
// 		argsLength = args.length,
// 		holdersLength = holders.length,
// 		leftIndex = -1,
// 		leftLength = partials.length,
// 		rangeLength = nativeMax(argsLength - holdersLength, 0),
// 		result = Array(leftLength + rangeLength),
// 		isUncurried = !isCurried;

// 	while (++leftIndex < leftLength) {
// 		result[leftIndex] = partials[leftIndex];
// 	}
// 	while (++argsIndex < holdersLength) {
// 		if (isUncurried || argsIndex < argsLength) {
// 			result[holders[argsIndex]] = args[argsIndex];
// 		}
// 	}
// 	while (rangeLength--) {
// 		result[leftIndex++] = args[argsIndex++];
// 	}
// 	return result;
// }

// function composeArgsRight(args: any[], partials: any[], holders: any[], isCurried?: boolean): any[] {
// 	var argsIndex = -1,
// 		argsLength = args.length,
// 		holdersIndex = -1,
// 		holdersLength = holders.length,
// 		rightIndex = -1,
// 		rightLength = partials.length,
// 		rangeLength = nativeMax(argsLength - holdersLength, 0),
// 		result = Array(rangeLength + rightLength),
// 		isUncurried = !isCurried;

// 	while (++argsIndex < rangeLength) {
// 		result[argsIndex] = args[argsIndex];
// 	}
// 	var offset = argsIndex;
// 	while (++rightIndex < rightLength) {
// 		result[offset + rightIndex] = partials[rightIndex];
// 	}
// 	while (++holdersIndex < holdersLength) {
// 		if (isUncurried || argsIndex < argsLength) {
// 			result[offset + holders[holdersIndex]] = args[argsIndex++];
// 		}
// 	}
// 	return result;
// }

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

// function createAggregator(setter: Function, initializer?: Function): Function {
// 	return function (collection: any[] | any, iteratee: Function) {
// 		var func = isArray(collection) ? arrayAggregator : baseAggregator,
// 			accumulator = initializer ? initializer() : {};

// 		return func(collection, setter, getIteratee(iteratee, 2), accumulator);
// 	};
// }

// function createAssigner(assigner: Function): Function {
// 	return baseRest(function (object: any, sources: any[]) {
// 		var index = -1,
// 			length = sources.length,
// 			customizer = length > 1 ? sources[length - 1] : undefined,
// 			guard = length > 2 ? sources[2] : undefined;

// 		customizer = (assigner.length > 3 && typeof customizer == 'function')
// 			? (length-- , customizer)
// 			: undefined;

// 		if (guard && isIterateeCall(sources[0], sources[1], guard)) {
// 			customizer = length < 3 ? undefined : customizer;
// 			length = 1;
// 		}
// 		object = Object(object);
// 		while (++index < length) {
// 			var source = sources[index];
// 			if (source) {
// 				assigner(object, source, index, customizer);
// 			}
// 		}
// 		return object;
// 	});
// }

// function createBaseEach(eachFunc: Function, fromRight?: boolean): Function {
// 	return function (collection: any, iteratee: Function) {
// 		if (collection == null) {
// 			return collection;
// 		}
// 		if (!isArrayLike(collection)) {
// 			return eachFunc(collection, iteratee);
// 		}
// 		var length = collection.length,
// 			index = fromRight ? length : -1,
// 			iterable = Object(collection);

// 		while ((fromRight ? index-- : ++index < length)) {
// 			if (iteratee(iterable[index], index, iterable) === false) {
// 				break;
// 			}
// 		}
// 		return collection;
// 	};
// }

// function createBaseFor(fromRight?: boolean): Function {
// 	return function (object: any, iteratee: Function, keysFunc: Function): any {
// 		var index = -1,
// 			iterable = Object(object),
// 			props = keysFunc(object),
// 			length = props.length;

// 		while (length--) {
// 			var key = props[fromRight ? length : ++index];
// 			if (iteratee(iterable[key], key, iterable) === false) {
// 				break;
// 			}
// 		}
// 		return object;
// 	};
// }

// function createBind(func: Function, bitmask: number, thisArg: any): Function {
// 	var isBind = bitmask & WRAP_BIND_FLAG,
// 		Ctor = createCtor(func);

// 	function wrapper() {
// 		var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
// 		return fn.apply(isBind ? thisArg : this, arguments);
// 	}
// 	return wrapper;
// }

// function createCaseFirst(methodName: string): Function {
// 	return function (string: string) {
// 		string = toString(string);

// 		var strSymbols = hasUnicode(string)
// 			? stringToArray(string)
// 			: undefined;

// 		var chr = strSymbols
// 			? strSymbols[0]
// 			: string.charAt(0);

// 		var trailing = strSymbols
// 			? castSlice(strSymbols, 1).join('')
// 			: string.slice(1);

// 		return chr[methodName]() + trailing;
// 	};
// }

// /**
//  * Creates a function like `_.camelCase`.
//  *
//  * @private
//  * @param {Function} callback The function to combine each word.
//  * @returns {Function} Returns the new compounder function.
//  */
// function createCompounder(callback: Function): Function {
// 	return function (string: string) {
// 		return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
// 	};
// }

// function createCtor(Ctor: Function): Function {
// 	return function (): boolean {
// 		// Use a `switch` statement to work with class constructors. See
// 		// http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
// 		// for more details.
// 		var args = arguments;
// 		switch (args.length) {
// 			case 0: return new Ctor;
// 			case 1: return new Ctor(args[0]);
// 			case 2: return new Ctor(args[0], args[1]);
// 			case 3: return new Ctor(args[0], args[1], args[2]);
// 			case 4: return new Ctor(args[0], args[1], args[2], args[3]);
// 			case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
// 			case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
// 			case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
// 		}
// 		var thisBinding = baseCreate(Ctor.prototype),
// 			result = Ctor.apply(thisBinding, args);

// 		// Mimic the constructor's `return` behavior.
// 		// See https://es5.github.io/#x13.2.2 for more details.
// 		return isObject(result) ? result : thisBinding;
// 	};
// }

// /**
//  * Creates a function that wraps `func` to enable currying.
//  *
//  * @private
//  * @param {Function} func The function to wrap.
//  * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
//  * @param {number} arity The arity of `func`.
//  * @returns {Function} Returns the new wrapped function.
//  */
// function createCurry(func, bitmask, arity) {
// 	var Ctor = createCtor(func);

// 	function wrapper() {
// 		var length = arguments.length,
// 			args = Array(length),
// 			index = length,
// 			placeholder = getHolder(wrapper);

// 		while (index--) {
// 			args[index] = arguments[index];
// 		}
// 		var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
// 			? []
// 			: replaceHolders(args, placeholder);

// 		length -= holders.length;
// 		if (length < arity) {
// 			return createRecurry(
// 				func, bitmask, createHybrid, wrapper.placeholder, undefined,
// 				args, holders, undefined, undefined, arity - length);
// 		}
// 		var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
// 		return apply(fn, this, args);
// 	}
// 	return wrapper;
// }

// /**
//  * Creates a `_.find` or `_.findLast` function.
//  *
//  * @private
//  * @param {Function} findIndexFunc The function to find the collection index.
//  * @returns {Function} Returns the new find function.
//  */
// function createFind(findIndexFunc) {
// 	return function (collection, predicate, fromIndex) {
// 		var iterable = Object(collection);
// 		if (!isArrayLike(collection)) {
// 			var iteratee = getIteratee(predicate, 3);
// 			collection = keys(collection);
// 			predicate = function (key) { return iteratee(iterable[key], key, iterable); };
// 		}
// 		var index = findIndexFunc(collection, predicate, fromIndex);
// 		return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
// 	};
// }

// function createFlow(fromRight?: boolean): Function {
// 	return flatRest(function (funcs) {
// 		var length = funcs.length,
// 			index = length,
// 			prereq = LodashWrapper.prototype.thru;

// 		if (fromRight) {
// 			funcs.reverse();
// 		}
// 		while (index--) {
// 			var func = funcs[index];
// 			if (typeof func != 'function') {
// 				throw new TypeError(FUNC_ERROR_TEXT);
// 			}
// 			if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
// 				var wrapper = new LodashWrapper([], true);
// 			}
// 		}
// 		index = wrapper ? index : length;
// 		while (++index < length) {
// 			func = funcs[index];

// 			var funcName = getFuncName(func),
// 				data = funcName == 'wrapper' ? getData(func) : undefined;

// 			if (data && isLaziable(data[0]) &&
// 				data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
// 				!data[4].length && data[9] == 1
// 			) {
// 				wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
// 			} else {
// 				wrapper = (func.length == 1 && isLaziable(func))
// 					? wrapper[funcName]()
// 					: wrapper.thru(func);
// 			}
// 		}
// 		return function () {
// 			var args = arguments,
// 				value = args[0];

// 			if (wrapper && args.length == 1 && isArray(value)) {
// 				return wrapper.plant(value).value();
// 			}
// 			var index = 0,
// 				result = length ? funcs[index].apply(this, args) : value;

// 			while (++index < length) {
// 				result = funcs[index].call(this, result);
// 			}
// 			return result;
// 		};
// 	});
// }

// function createHybrid(func: Function | string, bitmask: number, thisArg?: any, partials?: any[], holders?: any[], partialsRight?: any[], holdersRight?: any[], argPos?: any[], ary?: number, arity?: number): Function {
// 	var isAry = bitmask & WRAP_ARY_FLAG,
// 		isBind = bitmask & WRAP_BIND_FLAG,
// 		isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
// 		isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
// 		isFlip = bitmask & WRAP_FLIP_FLAG,
// 		Ctor = isBindKey ? undefined : createCtor(func);

// 	function wrapper() {
// 		var length = arguments.length,
// 			args = Array(length),
// 			index = length;

// 		while (index--) {
// 			args[index] = arguments[index];
// 		}
// 		if (isCurried) {
// 			var placeholder = getHolder(wrapper),
// 				holdersCount = countHolders(args, placeholder);
// 		}
// 		if (partials) {
// 			args = composeArgs(args, partials, holders, isCurried);
// 		}
// 		if (partialsRight) {
// 			args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
// 		}
// 		length -= holdersCount;
// 		if (isCurried && length < arity) {
// 			var newHolders = replaceHolders(args, placeholder);
// 			return createRecurry(
// 				func, bitmask, createHybrid, wrapper.placeholder, thisArg,
// 				args, newHolders, argPos, ary, arity - length
// 			);
// 		}
// 		var thisBinding = isBind ? thisArg : this,
// 			fn = isBindKey ? thisBinding[func] : func;

// 		length = args.length;
// 		if (argPos) {
// 			args = reorder(args, argPos);
// 		} else if (isFlip && length > 1) {
// 			args.reverse();
// 		}
// 		if (isAry && ary < length) {
// 			args.length = ary;
// 		}
// 		if (this && this !== root && this instanceof wrapper) {
// 			fn = Ctor || createCtor(fn);
// 		}
// 		return fn.apply(thisBinding, args);
// 	}
// 	return wrapper;
// }

// function createInverter(setter: Function, toIteratee: Function): Function {
// 	return function (object, iteratee) {
// 		return baseInverter(object, setter, toIteratee(iteratee), {});
// 	};
// }

// function createMathOperation(operator: Function, defaultValue: number): Function {
// 	return function (value: any, other: any) {
// 		var result: any;
// 		if (value === undefined && other === undefined) {
// 			return defaultValue;
// 		}
// 		if (value !== undefined) {
// 			result = value;
// 		}
// 		if (other !== undefined) {
// 			if (result === undefined) {
// 				return other;
// 			}
// 			if (typeof value == 'string' || typeof other == 'string') {
// 				value = baseToString(value);
// 				other = baseToString(other);
// 			} else {
// 				value = baseToNumber(value);
// 				other = baseToNumber(other);
// 			}
// 			result = operator(value, other);
// 		}
// 		return result;
// 	};
// }

// function createOver(arrayFunc: Function): Function {
// 	return flatRest(function (iteratees) {
// 		iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
// 		return baseRest(function (args) {
// 			var thisArg = this;
// 			return arrayFunc(iteratees, function (iteratee) {
// 				return apply(iteratee, thisArg, args);
// 			});
// 		});
// 	});
// }

// function createPadding(length: number, chars: string): string {
// 	chars = chars === undefined ? ' ' : baseToString(chars);

// 	var charsLength = chars.length;
// 	if (charsLength < 2) {
// 		return charsLength ? baseRepeat(chars, length) : chars;
// 	}
// 	var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
// 	return hasUnicode(chars)
// 		? castSlice(stringToArray(result), 0, length).join('')
// 		: result.slice(0, length);
// }

// function createPartial(func: Function, bitmask: number, thisArg: any, partials: any[]): Function {
// 	var isBind = bitmask & WRAP_BIND_FLAG,
// 		Ctor = createCtor(func);

// 	function wrapper() {
// 		var argsIndex = -1,
// 			argsLength = arguments.length,
// 			leftIndex = -1,
// 			leftLength = partials.length,
// 			args = Array(leftLength + argsLength),
// 			fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

// 		while (++leftIndex < leftLength) {
// 			args[leftIndex] = partials[leftIndex];
// 		}
// 		while (argsLength--) {
// 			args[leftIndex++] = arguments[++argsIndex];
// 		}
// 		return apply(fn, isBind ? thisArg : this, args);
// 	}
// 	return wrapper;
// }

// function createRange(fromRight?: boolean): Function {
// 	return function (start: number, end: number, step: number) {
// 		if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
// 			end = step = undefined;
// 		}
// 		// Ensure the sign of `-0` is preserved.
// 		start = toFinite(start);
// 		if (end === undefined) {
// 			end = start;
// 			start = 0;
// 		} else {
// 			end = toFinite(end);
// 		}
// 		step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
// 		return baseRange(start, end, step, fromRight);
// 	};
// }

// function createRelationalOperation(operator: Function): (value: any, other: any) => boolean {
// 	return function (value: any, other: any) {
// 		if (!(typeof value == 'string' && typeof other == 'string')) {
// 			value = toNumber(value);
// 			other = toNumber(other);
// 		}
// 		return operator(value, other);
// 	};
// }

// function createRecurry(func: Function, bitmask: number, wrapFunc: Function, placeholder: any, thisArg: any, partials: any[], holders: any[], argPos: number[], ary: number, arity: number): Function {
// 	var isCurry = bitmask & WRAP_CURRY_FLAG,
// 		newHolders = isCurry ? holders : undefined,
// 		newHoldersRight = isCurry ? undefined : holders,
// 		newPartials = isCurry ? partials : undefined,
// 		newPartialsRight = isCurry ? undefined : partials;

// 	bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
// 	bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

// 	if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
// 		bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
// 	}
// 	var newData = [
// 		func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
// 		newHoldersRight, argPos, ary, arity
// 	];

// 	var result = wrapFunc.apply(undefined, newData);
// 	if (isLaziable(func)) {
// 		setData(result, newData);
// 	}
// 	result.placeholder = placeholder;
// 	return setWrapToString(result, func, bitmask);
// }

// function createRound(methodName: string): Function {
// 	var func = Math[methodName];
// 	return function (number: number, precision: number) {
// 		number = toNumber(number);
// 		precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
// 		if (precision && nativeIsFinite(number)) {
// 			// Shift with exponential notation to avoid floating-point issues.
// 			// See [MDN](https://mdn.io/round#Examples) for more details.
// 			var pair = (toString(number) + 'e').split('e'),
// 				value = func(pair[0] + 'e' + (+pair[1] + precision));

// 			pair = (toString(value) + 'e').split('e');
// 			return +(pair[0] + 'e' + (+pair[1] - precision));
// 		}
// 		return func(number);
// 	};
// }

// var createSet: (values: any[]) => any = !(Set && (1 / setToArray(new Set([, -0]))[1]) == INFINITY) ? noop : function (values) {
// 	return new Set(values);
// };

// function createToPairs(keysFunc: Function): Function {
// 	return function (object: any) {
// 		var tag = getTag(object);
// 		if (tag == mapTag) {
// 			return mapToArray(object);
// 		}
// 		if (tag == setTag) {
// 			return setToPairs(object);
// 		}
// 		return baseToPairs(object, keysFunc(object));
// 	};
// }

// function createWrap(func: Function, bitmask?: number, thisArg?: any, partials?: any[], holders?: number[], argPos?: number[], ary?: number, arity?: number): Function {
// 	var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
// 	if (!isBindKey && typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	var length = partials ? partials.length : 0;
// 	if (!length) {
// 		bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
// 		partials = holders = undefined;
// 	}
// 	ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
// 	arity = arity === undefined ? arity : toInteger(arity);
// 	length -= holders ? holders.length : 0;

// 	if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
// 		var partialsRight = partials,
// 			holdersRight = holders;

// 		partials = holders = undefined;
// 	}
// 	var data = isBindKey ? undefined : getData(func);

// 	var newData = [
// 		func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
// 		argPos, ary, arity
// 	];

// 	if (data) {
// 		mergeData(newData, data);
// 	}
// 	func = newData[0];
// 	bitmask = newData[1];
// 	thisArg = newData[2];
// 	partials = newData[3];
// 	holders = newData[4];
// 	arity = newData[9] = newData[9] === undefined
// 		? (isBindKey ? 0 : func.length)
// 		: nativeMax(newData[9] - length, 0);

// 	if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
// 		bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
// 	}
// 	if (!bitmask || bitmask == WRAP_BIND_FLAG) {
// 		var result = createBind(func, bitmask, thisArg);
// 	} else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
// 		result = createCurry(func, bitmask, arity);
// 	} else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
// 		result = createPartial(func, bitmask, thisArg, partials);
// 	} else {
// 		result = createHybrid.apply(undefined, newData);
// 	}
// 	var setter = data ? baseSetData : setData;
// 	return setWrapToString(setter(result, newData), func, bitmask);
// }

// function customDefaultsAssignIn(objValue: any, srcValue: any, key: string, object: any): any {
// 	if (objValue === undefined ||
// 		(eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
// 		return srcValue;
// 	}
// 	return objValue;
// }

// function customDefaultsMerge(objValue: any, srcValue: any, key: string, object: any, source: any, stack: any): any {
// 	if (isObject(objValue) && isObject(srcValue)) {
// 		// Recursively merge objects and arrays (susceptible to call stack limits).
// 		stack.set(srcValue, objValue);
// 		baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
// 		stack['delete'](srcValue);
// 	}
// 	return objValue;
// }

// function customOmitClone(value: any): string {
// 	return isPlainObject(value) ? undefined : value;
// }

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

// function flatRest(func: Function): Function {
// 	return setToString(overRest(func, undefined, flatten), func + '');
// }

function getAllKeys(object: any): string[] {
	return baseGetAllKeys(object, keys, getSymbols);
}

function getAllKeysIn(object: any): string[] {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

// var getData: (f: Function) => any = !metaMap ? noop : function (func) {
// 	return metaMap.get(func);
// };

// function getFuncName(func: Function): string {
// 	var result = (func.name + ''),
// 		array = realNames[result],
// 		length = hasOwnProperty.call(realNames, result) ? array.length : 0;

// 	while (length--) {
// 		var data = array[length],
// 			otherFunc = data.func;
// 		if (otherFunc == null || otherFunc == func) {
// 			return data.name;
// 		}
// 	}
// 	return result;
// }

// function getHolder(func: Function): any {
// 	var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
// 	return object["placeholder"];
// }

// function getIteratee(value?: any, arity?: number): Function {
// 	var result: (v: any, a: number) => Function  = lodash.iteratee || iteratee;
// 	result = result === iteratee ? baseIteratee : result;
// 	return arguments.length ? result(value, arity) : result;
// }

function getMapData(map: any, key: string): any {
	var data = map.__data__;
	return isKeyable(key)
		? data[typeof key == 'string' ? 'string' : 'hash']
		: data.map;
}

// function getMatchData(object: any): any[] {
// 	var result = keys(object),
// 		length = result.length;

// 	while (length--) {
// 		var key = result[length],
// 			value = object[key];

// 		result[length] = [key, value, isStrictComparable(value)];
// 	}
// 	return result;
// }

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

// function getView(start: number, end: number, transforms: Function[]): any {
// 	var index = -1,
// 		length = transforms.length;

// 	while (++index < length) {
// 		var data = transforms[index],
// 			size = data.size;

// 		switch (data.type) {
// 			case 'drop': start += size; break;
// 			case 'dropRight': end -= size; break;
// 			case 'take': end = nativeMin(end, start + size); break;
// 			case 'takeRight': start = nativeMax(start, end - size); break;
// 		}
// 	}
// 	return { 'start': start, 'end': end };
// }

// function getWrapDetails(source: string): any[] {
// 	var match = source.match(reWrapDetails);
// 	return match ? match[1].split(reSplitDetails) : [];
// }

// /**
//  * Checks if `path` exists on `object`.
//  *
//  * @private
//  * @param {Object} object The object to query.
//  * @param {Array|string} path The path to check.
//  * @param {Function} hasFunc The function to check properties.
//  * @returns {boolean} Returns `true` if `path` exists, else `false`.
//  */
// function hasPath(object, path, hasFunc) {
// 	path = castPath(path, object);

// 	var index = -1,
// 		length = path.length,
// 		result = false;

// 	while (++index < length) {
// 		var key = toKey(path[index]);
// 		if (!(result = object != null && hasFunc(object, key))) {
// 			break;
// 		}
// 		object = object[key];
// 	}
// 	if (result || ++index != length) {
// 		return result;
// 	}
// 	length = object == null ? 0 : object.length;
// 	return !!length && isLength(length) && isIndex(key, length) &&
// 		(isArray(object) || isArguments(object));
// }

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

// function insertWrapDetails(source: string, details: any[]): string {
// 	var length = details.length;
// 	if (!length) {
// 		return source;
// 	}
// 	var lastIndex = length - 1;
// 	details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
// 	return source.replace(reWrapComment, '{\n/* [wrapped with ' + details.join(length > 2 ? ', ' : ' ') + '] */\n');
// }

// function isFlattenable(value: any): boolean {
// 	return isArray(value) || isArguments(value) ||
// 		!!(spreadableSymbol && value && value[spreadableSymbol]);
// }

function isIndex(value: any, length?: number): boolean {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER : length;

	return !!length &&
		(type == 'number' ||
			(type != 'symbol' && reIsUint.test(value))) &&
		(value > -1 && value % 1 == 0 && value < length);
}

// function isIterateeCall(value: any, index: any, object: any): boolean {
// 	if (!isObject(object)) {
// 		return false;
// 	}
// 	var type = typeof index;
// 	if (type == 'number'
// 		? (isArrayLike(object) && isIndex(index, object.length))
// 		: (type == 'string' && index in object)
// 	) {
// 		return eq(object[index], value);
// 	}
// 	return false;
// }

// function isKey(value: any, object?: any): boolean {
// 	if (isArray(value)) {
// 		return false;
// 	}
// 	var type = typeof value;
// 	if (type == 'number' || type == 'symbol' || type == 'boolean' ||
// 		value == null || isSymbol(value)) {
// 		return true;
// 	}
// 	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
// 		(object != null && value in Object(object));
// }

function isKeyable(value: any): boolean {
	var type = typeof value;
	return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		? (value !== '__proto__')
		: (value === null);
}

// function isLaziable(func: Function): boolean {
// 	var funcName = getFuncName(func),
// 		other = lodash[funcName];

// 	if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
// 		return false;
// 	}
// 	if (func === other) {
// 		return true;
// 	}
// 	var data = getData(other);
// 	return !!data && func === data[0];
// }

function isMasked(func: Function): boolean {
	return !!maskSrcKey && (maskSrcKey in func);
}

// var isMaskable: (value: any) => boolean = coreJsData ? isFunction : stubFalse;

function isPrototype(value: any): boolean {
	var Ctor = value && value.constructor,
		proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	return value === proto;
}

// function isStrictComparable(value: any): boolean {
// 	return value === value && !isObject(value);
// }

// function matchesStrictComparable(key: string, srcValue: any): Function {
// 	return function (object: any) {
// 		if (object == null) {
// 			return false;
// 		}
// 		return object[key] === srcValue &&
// 			(srcValue !== undefined || (key in Object(object)));
// 	};
// }

// function memoizeCapped(func: Function): Function {
// 	var result = memoize(func, function (key: string) {
// 		if (cache.size === MAX_MEMOIZE_SIZE) {
// 			cache.clear();
// 		}
// 		return key;
// 	});

// 	var cache = result.cache;
// 	return result;
// }

// function mergeData(data: any[], source: any[]): any[] {
// 	var bitmask = data[1],
// 		srcBitmask = source[1],
// 		newBitmask = bitmask | srcBitmask,
// 		isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

// 	var isCombo =
// 		((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
// 		((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
// 		((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

// 	// Exit early if metadata can't be merged.
// 	if (!(isCommon || isCombo)) {
// 		return data;
// 	}
// 	// Use source `thisArg` if available.
// 	if (srcBitmask & WRAP_BIND_FLAG) {
// 		data[2] = source[2];
// 		// Set when currying a bound function.
// 		newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
// 	}
// 	// Compose partial arguments.
// 	var value = source[3];
// 	if (value) {
// 		var partials = data[3];
// 		data[3] = partials ? composeArgs(partials, value, source[4]) : value;
// 		data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
// 	}
// 	// Compose partial right arguments.
// 	value = source[5];
// 	if (value) {
// 		partials = data[5];
// 		data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
// 		data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
// 	}
// 	// Use source `argPos` if available.
// 	value = source[7];
// 	if (value) {
// 		data[7] = value;
// 	}
// 	// Use source `ary` if it's smaller.
// 	if (srcBitmask & WRAP_ARY_FLAG) {
// 		data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
// 	}
// 	// Use source `arity` if one is not provided.
// 	if (data[9] == null) {
// 		data[9] = source[9];
// 	}
// 	// Use source `func` and merge bitmasks.
// 	data[0] = source[0];
// 	data[1] = newBitmask;

// 	return data;
// }

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

// function overRest(func: Function, start: number, transform: Function): Function {
// 	start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
// 	return function () {
// 		var args = arguments,
// 			index = -1,
// 			length = nativeMax(args.length - start, 0),
// 			array = Array(length);

// 		while (++index < length) {
// 			array[index] = args[start + index];
// 		}
// 		index = -1;
// 		var otherArgs = Array(start + 1);
// 		while (++index < start) {
// 			otherArgs[index] = args[index];
// 		}
// 		otherArgs[start] = transform(array);
// 		return apply(func, this, otherArgs);
// 	};
// }

// function parent(object: any, path: any[]): any {
// 	return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
// }

// function reorder(array: any[], indexes: number[]): any[] {
// 	var arrLength = array.length,
// 		length = nativeMin(indexes.length, arrLength),
// 		oldArray = copyArray(array);

// 	while (length--) {
// 		var index = indexes[length];
// 		array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
// 	}
// 	return array;
// }

// var setData: (func: Function, data: any) => Function = shortOut(baseSetData);

// var setTimeout: (func: Function, wait: number) => any = ctxSetTimeout || function (func, wait) {
// 	return root.setTimeout(func, wait);
// };

// var setToString: (func: Function, string: Function | string) => Function = shortOut(baseSetToString);

// function setWrapToString(wrapper: Function, reference: Function, bitmask: number): Function {
// 	var source = (reference + '');
// 	return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
// }

// function shortOut(func: Function): Function {
// 	var count = 0,
// 		lastCalled = 0;

// 	return function () {
// 		var stamp = nativeNow(),
// 			remaining = HOT_SPAN - (stamp - lastCalled);

// 		lastCalled = stamp;
// 		if (remaining > 0) {
// 			if (++count >= HOT_COUNT) {
// 				return arguments[0];
// 			}
// 		} else {
// 			count = 0;
// 		}
// 		return func.apply(undefined, arguments);
// 	};
// }

// var stringToPath: (string: string) => any[] = memoizeCapped(function (string: string) {
// 	var result = [];
// 	if (string.charCodeAt(0) === 46 /* . */) {
// 		result.push('');
// 	}
// 	string.replace(rePropName, function (match, number, quote, subString) {
// 		result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
// 	});
// 	return result;
// });

// function toKey(value: any): string {
// 	if (typeof value == 'string' || isSymbol(value)) {
// 		return value;
// 	}
// 	var result = (value + '');
// 	return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
// }

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

// function updateWrapDetails(details: any[], bitmask: number): any[] {
// 	arrayEach(wrapFlags, function (pair: any[]) {
// 		var value = '_.' + pair[0];
// 		if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
// 			details.push(value);
// 		}
// 	});
// 	return details.sort();
// }

// function wrapperClone(wrapper: any): any {
// 	if (wrapper instanceof LazyWrapper) {
// 		return wrapper.clone();
// 	}
// 	var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
// 	result.__actions__ = copyArray(wrapper.__actions__);
// 	result.__index__ = wrapper.__index__;
// 	result.__values__ = wrapper.__values__;
// 	return result;
// }

// function chunk(array: any[], size: number, guard: any): any[] {
// 	if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
// 		size = 1;
// 	} else {
// 		size = nativeMax(toInteger(size), 0);
// 	}
// 	var length = array == null ? 0 : array.length;
// 	if (!length || size < 1) {
// 		return [];
// 	}
// 	var index = 0,
// 		resIndex = 0,
// 		result = Array(nativeCeil(length / size));

// 	while (index < length) {
// 		result[resIndex++] = baseSlice(array, index, (index += size));
// 	}
// 	return result;
// }

// function compact(array: any[]): any[] {
// 	var index = -1,
// 		length = array == null ? 0 : array.length,
// 		resIndex = 0,
// 		result = [];

// 	while (++index < length) {
// 		var value = array[index];
// 		if (value) {
// 			result[resIndex++] = value;
// 		}
// 	}
// 	return result;
// }

// function concat(array: any[], ...values: any[]): any[] {
// 	if (!arguments.length) {
// 		return [];
// 	}

// 	return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(values, 1));
// }

// var difference: (array: any[], ...values: any[]) => any[] = baseRest(function (array, values) {
// 	return isArrayLikeObject(array)
// 		? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
// 		: [];
// });

// var differenceBy: (array: any[], ...values: any[], iteratee: Function) => any[] = baseRest(function (array: any[], values: any[]) {
// 	var iteratee = last(values);
// 	if (isArrayLikeObject(iteratee)) {
// 		iteratee = undefined;
// 	}
// 	return isArrayLikeObject(array)
// 		? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
// 		: [];
// });

// var differenceWith: (array: any, ...values: any[], comparator: Function) => any[] = baseRest(function (array, values) {
// 	var comparator = last(values);
// 	if (isArrayLikeObject(comparator)) {
// 		comparator = undefined;
// 	}
// 	return isArrayLikeObject(array)
// 		? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
// 		: [];
// });

// function drop(array: any[], n: number, guard: any): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	n = (guard || n === undefined) ? 1 : toInteger(n);
// 	return baseSlice(array, n < 0 ? 0 : n, length);
// }

// function dropRight(array: any[], n: number, guard: any): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	n = (guard || n === undefined) ? 1 : toInteger(n);
// 	n = length - n;
// 	return baseSlice(array, 0, n < 0 ? 0 : n);
// }

// function dropRightWhile(array: any[], predicate: Function): any[] {
// 	return (array && array.length)
// 		? baseWhile(array, getIteratee(predicate, 3), true, true)
// 		: [];
// }

// function dropWhile(array: any[], predicate: Function): any[] {
// 	return (array && array.length)
// 		? baseWhile(array, getIteratee(predicate, 3), true)
// 		: [];
// }

// function fill(array: any[], value: any, start: number, end: number): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
// 		start = 0;
// 		end = length;
// 	}
// 	return baseFill(array, value, start, end);
// }

// function findIndex(array: any[], predicate: Function, fromIndex: number): number {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return -1;
// 	}
// 	var index = fromIndex == null ? 0 : toInteger(fromIndex);
// 	if (index < 0) {
// 		index = nativeMax(length + index, 0);
// 	}
// 	return baseFindIndex(array, getIteratee(predicate, 3), index);
// }

// function findLastIndex(array: any[], predicate: Function, fromIndex: number): number {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return -1;
// 	}
// 	var index = length - 1;
// 	if (fromIndex !== undefined) {
// 		index = toInteger(fromIndex);
// 		index = fromIndex < 0
// 			? nativeMax(length + index, 0)
// 			: nativeMin(index, length - 1);
// 	}
// 	return baseFindIndex(array, getIteratee(predicate, 3), index, true);
// }

// function flatten(array: any[]): any[] {
// 	var length = array == null ? 0 : array.length;
// 	return length ? baseFlatten(array, 1) : [];
// }

// function flattenDeep(array: any[]): any[] {
// 	var length = array == null ? 0 : array.length;
// 	return length ? baseFlatten(array, INFINITY) : [];
// }

// function flattenDepth(array: any[], depth: number): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	depth = depth === undefined ? 1 : toInteger(depth);
// 	return baseFlatten(array, depth);
// }

// function fromPairs(pairs: any[]): any {
// 	var index = -1,
// 		length = pairs == null ? 0 : pairs.length,
// 		result = {};

// 	while (++index < length) {
// 		var pair = pairs[index];
// 		result[pair[0]] = pair[1];
// 	}
// 	return result;
// }

// function head(array: any[]): any {
// 	return (array && array.length) ? array[0] : undefined;
// }

// function indexOf(array: any[], value: any, fromIndex: number): number {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return -1;
// 	}
// 	var index = fromIndex == null ? 0 : toInteger(fromIndex);
// 	if (index < 0) {
// 		index = nativeMax(length + index, 0);
// 	}
// 	return baseIndexOf(array, value, index);
// }

// function initial(array: any[]): any[] {
// 	var length = array == null ? 0 : array.length;
// 	return length ? baseSlice(array, 0, -1) : [];
// }

// var intersection: (...arrays: any[]) => any[] = baseRest(function (arrays: any[]) {
// 	var mapped = arrayMap(arrays, castArrayLikeObject);
// 	return (mapped.length && mapped[0] === arrays[0])
// 		? baseIntersection(mapped)
// 		: [];
// });

// /**
//  * This method is like `_.intersection` except that it accepts `iteratee`
//  * which is invoked for each element of each `arrays` to generate the criterion
//  * by which they're compared. The order and references of result values are
//  * determined by the first array. The iteratee is invoked with one argument:
//  * (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 4.0.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to inspect.
//  * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
//  * @returns {Array} Returns the new array of intersecting values.
//  * @example
//  *
//  * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
//  * // => [2.1]
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
//  * // => [{ 'x': 1 }]
//  */
// var intersectionBy = baseRest(function (arrays) {
// 	var iteratee = last(arrays),
// 		mapped = arrayMap(arrays, castArrayLikeObject);

// 	if (iteratee === last(mapped)) {
// 		iteratee = undefined;
// 	} else {
// 		mapped.pop();
// 	}
// 	return (mapped.length && mapped[0] === arrays[0])
// 		? baseIntersection(mapped, getIteratee(iteratee, 2))
// 		: [];
// });

// /**
//  * This method is like `_.intersection` except that it accepts `comparator`
//  * which is invoked to compare elements of `arrays`. The order and references
//  * of result values are determined by the first array. The comparator is
//  * invoked with two arguments: (arrVal, othVal).
//  *
//  * @static
//  * @memberOf _
//  * @since 4.0.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to inspect.
//  * @param {Function} [comparator] The comparator invoked per element.
//  * @returns {Array} Returns the new array of intersecting values.
//  * @example
//  *
//  * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
//  * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
//  *
//  * _.intersectionWith(objects, others, _.isEqual);
//  * // => [{ 'x': 1, 'y': 2 }]
//  */
// var intersectionWith = baseRest(function (arrays) {
// 	var comparator = last(arrays),
// 		mapped = arrayMap(arrays, castArrayLikeObject);

// 	comparator = typeof comparator == 'function' ? comparator : undefined;
// 	if (comparator) {
// 		mapped.pop();
// 	}
// 	return (mapped.length && mapped[0] === arrays[0])
// 		? baseIntersection(mapped, undefined, comparator)
// 		: [];
// });

// function join(array: any[], separator: string): string {
// 	return array == null ? '' : nativeJoin.call(array, separator);
// }

// function last(array: any[]): any {
// 	var length = array == null ? 0 : array.length;
// 	return length ? array[length - 1] : undefined;
// }

// function lastIndexOf(array: any[], value: any, fromIndex: number): number {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return -1;
// 	}
// 	var index = length;
// 	if (fromIndex !== undefined) {
// 		index = toInteger(fromIndex);
// 		index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
// 	}
// 	return value === value
// 		? strictLastIndexOf(array, value, index)
// 		: baseFindIndex(array, baseIsNaN, index, true);
// }

// function nth(array: any[], n: number): any {
// 	return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
// }

// var pull: (array: any[], ...values: any[]) => void = baseRest(pullAll);

// function pullAll(array: any[], values: any[]): any[] {
// 	return (array && array.length && values && values.length)
// 		? basePullAll(array, values)
// 		: array;
// }

// function pullAllBy(array: any[], values: any[], iteratee: Function): any[] {
// 	return (array && array.length && values && values.length)
// 		? basePullAll(array, values, getIteratee(iteratee, 2))
// 		: array;
// }

// function pullAllWith(array: any[], values: any[], comparator: Function): any[] {
// 	return (array && array.length && values && values.length)
// 		? basePullAll(array, values, undefined, comparator)
// 		: array;
// }

// var pullAt: (array: any[], ...indexes: any[]) => any[] = flatRest(function (array, indexes) {
// 	var length = array == null ? 0 : array.length,
// 		result = baseAt(array, indexes);

// 	basePullAt(array, arrayMap(indexes, function (index: number) {
// 		return isIndex(index, length) ? +index : index;
// 	}).sort(compareAscending));

// 	return result;
// });

// function remove(array: any[], predicate: Function): any[] {
// 	var result = [];
// 	if (!(array && array.length)) {
// 		return result;
// 	}
// 	var index = -1,
// 		indexes = [],
// 		length = array.length;

// 	predicate = getIteratee(predicate, 3);
// 	while (++index < length) {
// 		var value = array[index];
// 		if (predicate(value, index, array)) {
// 			result.push(value);
// 			indexes.push(index);
// 		}
// 	}
// 	basePullAt(array, indexes);
// 	return result;
// }

// function reverse(array: any[]): any[] {
// 	return array == null ? array : nativeReverse.call(array);
// }

// function slice(array: any[], start: number, end: number): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
// 		start = 0;
// 		end = length;
// 	}
// 	else {
// 		start = start == null ? 0 : toInteger(start);
// 		end = end === undefined ? length : toInteger(end);
// 	}
// 	return baseSlice(array, start, end);
// }

// function sortedIndex(array: any[], value: any): number {
// 	return baseSortedIndex(array, value);
// }

// function sortedIndexBy(array: any[], value: any, iteratee: Function): number {
// 	return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
// }

// function sortedIndexOf(array: any[], value: any): number {
// 	var length = array == null ? 0 : array.length;
// 	if (length) {
// 		var index = baseSortedIndex(array, value);
// 		if (index < length && eq(array[index], value)) {
// 			return index;
// 		}
// 	}
// 	return -1;
// }

// function sortedLastIndex(array: any[], value: any): number {
// 	return baseSortedIndex(array, value, true);
// }

// function sortedLastIndexBy(array: any[], value: any, iteratee: Function): number {
// 	return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
// }

// function sortedLastIndexOf(array: any[], value: any): number {
// 	var length = array == null ? 0 : array.length;
// 	if (length) {
// 		var index = baseSortedIndex(array, value, true) - 1;
// 		if (eq(array[index], value)) {
// 			return index;
// 		}
// 	}
// 	return -1;
// }

// function sortedUniq(array: any[]): any[] {
// 	return (array && array.length) ? baseSortedUniq(array) : [];
// }

// function sortedUniqBy(array: any[], iteratee: Function): any[] {
// 	return (array && array.length)
// 		? baseSortedUniq(array, getIteratee(iteratee, 2))
// 		: [];
// }

// function tail(array: any[]): any[] {
// 	var length = array == null ? 0 : array.length;
// 	return length ? baseSlice(array, 1, length) : [];
// }

// function take(array: any[], n: number, guard: any): any[] {
// 	if (!(array && array.length)) {
// 		return [];
// 	}
// 	n = (guard || n === undefined) ? 1 : toInteger(n);
// 	return baseSlice(array, 0, n < 0 ? 0 : n);
// }

// function takeRight(array: any[], n: number, guard: any): any[] {
// 	var length = array == null ? 0 : array.length;
// 	if (!length) {
// 		return [];
// 	}
// 	n = (guard || n === undefined) ? 1 : toInteger(n);
// 	n = length - n;
// 	return baseSlice(array, n < 0 ? 0 : n, length);
// }

// function takeRightWhile(array: any[], predicate: Function): any[] {
// 	return (array && array.length) ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
// }

// /**
//  * Creates a slice of `array` with elements taken from the beginning. Elements
//  * are taken until `predicate` returns falsey. The predicate is invoked with
//  * three arguments: (value, index, array).
//  *
//  * @static
//  * @memberOf _
//  * @since 3.0.0
//  * @category Array
//  * @param {Array} array The array to query.
//  * @param {Function} [predicate=_.identity] The function invoked per iteration.
//  * @returns {Array} Returns the slice of `array`.
//  * @example
//  *
//  * var users = [
//  *   { 'user': 'barney',  'active': false },
//  *   { 'user': 'fred',    'active': false },
//  *   { 'user': 'pebbles', 'active': true }
//  * ];
//  *
//  * _.takeWhile(users, function(o) { return !o.active; });
//  * // => objects for ['barney', 'fred']
//  *
//  * // The `_.matches` iteratee shorthand.
//  * _.takeWhile(users, { 'user': 'barney', 'active': false });
//  * // => objects for ['barney']
//  *
//  * // The `_.matchesProperty` iteratee shorthand.
//  * _.takeWhile(users, ['active', false]);
//  * // => objects for ['barney', 'fred']
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.takeWhile(users, 'active');
//  * // => []
//  */
// function takeWhile(array, predicate) {
// 	return (array && array.length) ? baseWhile(array, getIteratee(predicate, 3)) : [];
// }

// /**
//  * Creates an array of unique values, in order, from all given arrays using
//  * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
//  * for equality comparisons.
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to inspect.
//  * @returns {Array} Returns the new array of combined values.
//  * @example
//  *
//  * _.union([2], [1, 2]);
//  * // => [2, 1]
//  */
// var union = baseRest(function (...arrays: any[][]) {
// 	return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
// });

// /**
//  * This method is like `_.union` except that it accepts `iteratee` which is
//  * invoked for each element of each `arrays` to generate the criterion by
//  * which uniqueness is computed. Result values are chosen from the first
//  * array in which the value occurs. The iteratee is invoked with one argument:
//  * (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 4.0.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to inspect.
//  * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
//  * @returns {Array} Returns the new array of combined values.
//  * @example
//  *
//  * _.unionBy([2.1], [1.2, 2.3], Math.floor);
//  * // => [2.1, 1.2]
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
//  * // => [{ 'x': 1 }, { 'x': 2 }]
//  */
// var unionBy = baseRest(function (arrays) {
// 	var iteratee = last(arrays);
// 	if (isArrayLikeObject(iteratee)) {
// 		iteratee = undefined;
// 	}
// 	return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
// });

// var unionWith: (...arrays: any[], comparator: Function) => any[] = baseRest(function (arrays: any[]) {
// 	var comparator = last(arrays);
// 	comparator = typeof comparator == 'function' ? comparator : undefined;
// 	return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
// });

// function uniq(array: any[]): any[] {
// 	return (array && array.length) ? baseUniq(array) : [];
// }

// function uniqBy(array: any[], iteratee: Function): any[] {
// 	return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
// }

// function uniqWith(array: any[], comparator: Function): any[] {
// 	comparator = typeof comparator == 'function' ? comparator : undefined;
// 	return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
// }

// function unzip(array: any[]): any[] {
// 	if (!(array && array.length)) {
// 		return [];
// 	}
// 	var length = 0;
// 	array = arrayFilter(array, function (group: any) {
// 		if (isArrayLikeObject(group)) {
// 			length = nativeMax(group.length, length);
// 			return true;
// 		}
// 	});
// 	return baseTimes(length, function (index: any) {
// 		return arrayMap(array, baseProperty(index));
// 	});
// }

// function unzipWith(array: any[], iteratee: Function): any {
// 	if (!(array && array.length)) {
// 		return [];
// 	}
// 	var result = unzip(array);
// 	if (iteratee == null) {
// 		return result;
// 	}
// 	return arrayMap(result, function (group: any) {
// 		return apply(iteratee, undefined, group);
// 	});
// }

// /**
//  * Creates an array excluding all given values using
//  * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
//  * for equality comparisons.
//  *
//  * **Note:** Unlike `_.pull`, this method returns a new array.
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Array
//  * @param {Array} array The array to inspect.
//  * @param {...*} [values] The values to exclude.
//  * @returns {Array} Returns the new array of filtered values.
//  * @see _.difference, _.xor
//  * @example
//  *
//  * _.without([2, 1, 2, 3], 1, 2);
//  * // => [3]
//  */
// var without: (array: any[], ...values: any[]) => any[] = baseRest(function (array, values) {
// 	return isArrayLikeObject(array)
// 		? baseDifference(array, values)
// 		: [];
// });

// var xor: (...arrays: any[]) => any[] = baseRest(function (arrays) {
// 	return baseXor(arrayFilter(arrays, isArrayLikeObject));
// });

// var xorBy: (...arrays: any[], iteratee: Function) => any[] = baseRest(function (arrays) {
// 	var iteratee = last(arrays);
// 	if (isArrayLikeObject(iteratee)) {
// 		iteratee = undefined;
// 	}
// 	return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
// });

// /**
//  * This method is like `_.xor` except that it accepts `comparator` which is
//  * invoked to compare elements of `arrays`. The order of result values is
//  * determined by the order they occur in the arrays. The comparator is invoked
//  * with two arguments: (arrVal, othVal).
//  *
//  * @static
//  * @memberOf _
//  * @since 4.0.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to inspect.
//  * @param {Function} [comparator] The comparator invoked per element.
//  * @returns {Array} Returns the new array of filtered values.
//  * @example
//  *
//  * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
//  * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
//  *
//  * _.xorWith(objects, others, _.isEqual);
//  * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
//  */
// var xorWith = baseRest(function (arrays) {
// 	var comparator = last(arrays);
// 	comparator = typeof comparator == 'function' ? comparator : undefined;
// 	return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
// });

// var zip: (...arrays: any[]) => any[] = baseRest(unzip);

// function zipObject(props: string[], values: any[]): any {
// 	return baseZipObject(props || [], values || [], assignValue);
// }

// function zipObjectDeep(props: string[], values: any[]): any {
// 	return baseZipObject(props || [], values || [], baseSet);
// }

// /**
//  * This method is like `_.zip` except that it accepts `iteratee` to specify
//  * how grouped values should be combined. The iteratee is invoked with the
//  * elements of each group: (...group).
//  *
//  * @static
//  * @memberOf _
//  * @since 3.8.0
//  * @category Array
//  * @param {...Array} [arrays] The arrays to process.
//  * @param {Function} [iteratee=_.identity] The function to combine
//  *  grouped values.
//  * @returns {Array} Returns the new array of grouped elements.
//  * @example
//  *
//  * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
//  *   return a + b + c;
//  * });
//  * // => [111, 222]
//  */
// var zipWith = baseRest(function (arrays) {
// 	var length = arrays.length,
// 		iteratee = length > 1 ? arrays[length - 1] : undefined;

// 	iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
// 	return unzipWith(arrays, iteratee);
// });

/*------------------------------------------------------------------------*/

// function tap(value: any, interceptor: Function): any {
// 	interceptor(value);
// 	return value;
// }

// function thru(value: any, interceptor: Function): any {
// 	return interceptor(value);
// }

/*------------------------------------------------------------------------*/

// /**
//  * Creates an object composed of keys generated from the results of running
//  * each element of `collection` thru `iteratee`. The corresponding value of
//  * each key is the number of times the key was returned by `iteratee`. The
//  * iteratee is invoked with one argument: (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 0.5.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
//  * @returns {Object} Returns the composed aggregate object.
//  * @example
//  *
//  * _.countBy([6.1, 4.2, 6.3], Math.floor);
//  * // => { '4': 1, '6': 2 }
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.countBy(['one', 'two', 'three'], 'length');
//  * // => { '3': 2, '5': 1 }
//  */
// var countBy = createAggregator(function (result, value, key) {
// 	if (hasOwnProperty.call(result, key)) {
// 		++result[key];
// 	} else {
// 		baseAssignValue(result, key, 1);
// 	}
// });

// function every(collection: any, predicate: Function, guard: any): boolean {
// 	var func = isArray(collection) ? arrayEvery : baseEvery;
// 	if (guard && isIterateeCall(collection, predicate, guard)) {
// 		predicate = undefined;
// 	}
// 	return func(collection, getIteratee(predicate, 3));
// }

// function filter(collection: any, predicate: Function): any[] {
// 	var func = isArray(collection) ? arrayFilter : baseFilter;
// 	return func(collection, getIteratee(predicate, 3));
// }

// /**
//  * Iterates over elements of `collection`, returning the first element
//  * `predicate` returns truthy for. The predicate is invoked with three
//  * arguments: (value, index|key, collection).
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to inspect.
//  * @param {Function} [predicate=_.identity] The function invoked per iteration.
//  * @param {number} [fromIndex=0] The index to search from.
//  * @returns {*} Returns the matched element, else `undefined`.
//  * @example
//  *
//  * var users = [
//  *   { 'user': 'barney',  'age': 36, 'active': true },
//  *   { 'user': 'fred',    'age': 40, 'active': false },
//  *   { 'user': 'pebbles', 'age': 1,  'active': true }
//  * ];
//  *
//  * _.find(users, function(o) { return o.age < 40; });
//  * // => object for 'barney'
//  *
//  * // The `_.matches` iteratee shorthand.
//  * _.find(users, { 'age': 1, 'active': true });
//  * // => object for 'pebbles'
//  *
//  * // The `_.matchesProperty` iteratee shorthand.
//  * _.find(users, ['active', false]);
//  * // => object for 'fred'
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.find(users, 'active');
//  * // => object for 'barney'
//  */
// var find = createFind(findIndex);

// /**
//  * This method is like `_.find` except that it iterates over elements of
//  * `collection` from right to left.
//  *
//  * @static
//  * @memberOf _
//  * @since 2.0.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to inspect.
//  * @param {Function} [predicate=_.identity] The function invoked per iteration.
//  * @param {number} [fromIndex=collection.length-1] The index to search from.
//  * @returns {*} Returns the matched element, else `undefined`.
//  * @example
//  *
//  * _.findLast([1, 2, 3, 4], function(n) {
//  *   return n % 2 == 1;
//  * });
//  * // => 3
//  */
// var findLast = createFind(findLastIndex);

// function flatMap(collection: any[] | any, iteratee: Function): any[] {
// 	return baseFlatten(map(collection, iteratee), 1);
// }

// function flatMapDeep(collection: any[] | any, iteratee: Function): any[] {
// 	return baseFlatten(map(collection, iteratee), INFINITY);
// }

// function flatMapDepth(collection: any[] | any, iteratee: Function, depth: number): any[] {
// 	depth = depth === undefined ? 1 : toInteger(depth);
// 	return baseFlatten(map(collection, iteratee), depth);
// }

// function forEach(collection: any[] | any, iteratee:Function): any[] | any {
// 	var func = isArray(collection) ? arrayEach : baseEach;
// 	return func(collection, getIteratee(iteratee, 3));
// }

// function forEachRight(collection: any[] | any, iteratee: Function): any[] | any {
// 	var func = isArray(collection) ? arrayEachRight : baseEachRight;
// 	return func(collection, getIteratee(iteratee, 3));
// }

// /**
//  * Creates an object composed of keys generated from the results of running
//  * each element of `collection` thru `iteratee`. The order of grouped values
//  * is determined by the order they occur in `collection`. The corresponding
//  * value of each key is an array of elements responsible for generating the
//  * key. The iteratee is invoked with one argument: (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
//  * @returns {Object} Returns the composed aggregate object.
//  * @example
//  *
//  * _.groupBy([6.1, 4.2, 6.3], Math.floor);
//  * // => { '4': [4.2], '6': [6.1, 6.3] }
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.groupBy(['one', 'two', 'three'], 'length');
//  * // => { '3': ['one', 'two'], '5': ['three'] }
//  */
// var groupBy = createAggregator(function (result, value, key) {
// 	if (hasOwnProperty.call(result, key)) {
// 		result[key].push(value);
// 	} else {
// 		baseAssignValue(result, key, [value]);
// 	}
// });

// function includes(collection: any[] | any | string, value: any, fromIndex: number, guard: any): boolean {
// 	collection = isArrayLike(collection) ? collection : values(collection);
// 	fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

// 	var length = collection.length;
// 	if (fromIndex < 0) {
// 		fromIndex = nativeMax(length + fromIndex, 0);
// 	}
// 	return isString(collection)
// 		? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
// 		: (!!length && baseIndexOf(collection, value, fromIndex) > -1);
// }

// var invokeMap: (collection: any[] | any, path: string[] | Function | string) => any[] = baseRest(function (collection: any[] | any, path: string[] | Function | string, args: any[]) {
// 	var index = -1,
// 		isFunc = typeof path == 'function',
// 		result = isArrayLike(collection) ? Array(collection.length) : [];

// 	baseEach(collection, function (value) {
// 		result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
// 	});
// 	return result;
// });

// var keyBy: (collection: any[] | any, iteratee: Function) => any = createAggregator(function (result, value, key) {
// 	baseAssignValue(result, key, value);
// });

// function map(collection: any[] | any, iteratee: Function): any[] {
// 	var func = isArray(collection) ? arrayMap : baseMap;
// 	return func(collection, getIteratee(iteratee, 3));
// }

// function orderBy(collection: any[] | any, iteratees: any[] | Function[] | string[], orders: string[], guard: any): any[] {
// 	if (collection == null) {
// 		return [];
// 	}
// 	if (!isArray(iteratees)) {
// 		iteratees = iteratees == null ? [] : [iteratees];
// 	}
// 	orders = guard ? undefined : orders;
// 	if (!isArray(orders)) {
// 		orders = orders == null ? [] : [orders];
// 	}
// 	return baseOrderBy(collection, iteratees, orders);
// }

// /**
//  * Creates an array of elements split into two groups, the first of which
//  * contains elements `predicate` returns truthy for, the second of which
//  * contains elements `predicate` returns falsey for. The predicate is
//  * invoked with one argument: (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 3.0.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {Function} [predicate=_.identity] The function invoked per iteration.
//  * @returns {Array} Returns the array of grouped elements.
//  * @example
//  *
//  * var users = [
//  *   { 'user': 'barney',  'age': 36, 'active': false },
//  *   { 'user': 'fred',    'age': 40, 'active': true },
//  *   { 'user': 'pebbles', 'age': 1,  'active': false }
//  * ];
//  *
//  * _.partition(users, function(o) { return o.active; });
//  * // => objects for [['fred'], ['barney', 'pebbles']]
//  *
//  * // The `_.matches` iteratee shorthand.
//  * _.partition(users, { 'age': 1, 'active': false });
//  * // => objects for [['pebbles'], ['barney', 'fred']]
//  *
//  * // The `_.matchesProperty` iteratee shorthand.
//  * _.partition(users, ['active', false]);
//  * // => objects for [['barney', 'pebbles'], ['fred']]
//  *
//  * // The `_.property` iteratee shorthand.
//  * _.partition(users, 'active');
//  * // => objects for [['fred'], ['barney', 'pebbles']]
//  */
// var partition = createAggregator(function (result, value, key) {
// 	result[key ? 0 : 1].push(value);
// }, function () { return [[], []]; });

// function reduce(collection: any[] | any, iteratee: Function, accumulator: any): any {
// 	var func = isArray(collection) ? arrayReduce : baseReduce,
// 		initAccum = arguments.length < 3;

// 	return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
// }

// function reduceRight(collection: any, iteratee: Function, accumulator: any): any {
// 	var func = isArray(collection) ? arrayReduceRight : baseReduce,
// 		initAccum = arguments.length < 3;

// 	return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
// }

// function reject(collection: any[] | any, predicate: Function): any[] {
// 	var func = isArray(collection) ? arrayFilter : baseFilter;
// 	return func(collection, negate(getIteratee(predicate, 3)));
// }

// function sample(collection: any[] | any): any {
// 	var func = isArray(collection) ? arraySample : baseSample;
// 	return func(collection);
// }

// function sampleSize(collection: any, n: number, guard: any): any[] {
// 	if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
// 		n = 1;
// 	} else {
// 		n = toInteger(n);
// 	}
// 	var func = isArray(collection) ? arraySampleSize : baseSampleSize;
// 	return func(collection, n);
// }

// function shuffle(collection: any): any[] {
// 	var func = isArray(collection) ? arrayShuffle : baseShuffle;
// 	return func(collection);
// }

// function size(collection: any): number {
// 	if (collection == null) {
// 		return 0;
// 	}
// 	if (isArrayLike(collection)) {
// 		return isString(collection) ? stringSize(collection) : collection.length;
// 	}
// 	var tag = getTag(collection);
// 	if (tag == mapTag || tag == setTag) {
// 		return collection.size;
// 	}
// 	return baseKeys(collection).length;
// }

// function some(collection: any[] | any, predicate: Function, guard: any): boolean {
// 	var func = isArray(collection) ? arraySome : baseSome;
// 	if (guard && isIterateeCall(collection, predicate, guard)) {
// 		predicate = undefined;
// 	}
// 	return func(collection, getIteratee(predicate, 3));
// }

// /**
//  * Creates an array of elements, sorted in ascending order by the results of
//  * running each element in a collection thru each iteratee. This method
//  * performs a stable sort, that is, it preserves the original sort order of
//  * equal elements. The iteratees are invoked with one argument: (value).
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Collection
//  * @param {Array|Object} collection The collection to iterate over.
//  * @param {...(Function|Function[])} [iteratees=[_.identity]]
//  *  The iteratees to sort by.
//  * @returns {Array} Returns the new sorted array.
//  * @example
//  *
//  * var users = [
//  *   { 'user': 'fred',   'age': 48 },
//  *   { 'user': 'barney', 'age': 36 },
//  *   { 'user': 'fred',   'age': 40 },
//  *   { 'user': 'barney', 'age': 34 }
//  * ];
//  *
//  * _.sortBy(users, [function(o) { return o.user; }]);
//  * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
//  *
//  * _.sortBy(users, ['user', 'age']);
//  * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
//  */
// var sortBy = baseRest(function (collection, iteratees) {
// 	if (collection == null) {
// 		return [];
// 	}
// 	var length = iteratees.length;
// 	if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
// 		iteratees = [];
// 	} else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
// 		iteratees = [iteratees[0]];
// 	}
// 	return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
// });

// var now: () => number = ctxNow || function () {
// 	return root.Date.now();
// };

// function after(n: number, func: Function): Function {
// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	n = toInteger(n);
// 	return function () {
// 		if (--n < 1) {
// 			return func.apply(this, arguments);
// 		}
// 	};
// }

// function ary(func: Function, n: number, guard?: any): Function {
// 	n = guard ? undefined : n;
// 	n = (func && n == null) ? func.length : n;
// 	return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
// }

// function before(n: number, func: Function): Function {
// 	var result: Function;
// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	n = toInteger(n);
// 	return function () {
// 		if (--n > 0) {
// 			result = func.apply(this, arguments);
// 		}
// 		if (n <= 1) {
// 			func = undefined;
// 		}
// 		return result;
// 	};
// }

// var bind: (func: Function, thisArg: any, ...partials: any[]) => Function = baseRest(function (func: Function, thisArg: any, partials: any[]) {
// 	var bitmask = WRAP_BIND_FLAG;
// 	if (partials.length) {
// 		var holders = replaceHolders(partials, getHolder(bind));
// 		bitmask |= WRAP_PARTIAL_FLAG;
// 	}
// 	return createWrap(func, bitmask, thisArg, partials, holders);
// });

// var bindKey: (object: any, key: string, ...partials: any[]) => Function = baseRest(function (object, key, partials) {
// 	var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
// 	if (partials.length) {
// 		var holders = replaceHolders(partials, getHolder(bindKey));
// 		bitmask |= WRAP_PARTIAL_FLAG;
// 	}
// 	return createWrap(key, bitmask, object, partials, holders);
// });

// function curry(func: Function, arity: number, guard: any): Function {
// 	arity = guard ? undefined : arity;
// 	var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
// 	result.placeholder = curry.placeholder;
// 	return result;
// }

// function curryRight(func: Function, arity: number, guard: any): Function {
// 	arity = guard ? undefined : arity;
// 	var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
// 	result.placeholder = curryRight.placeholder;
// 	return result;
// }

// function debounce(func: Function, wait: number, options: any): Function {
// 	var lastArgs,
// 		lastThis,
// 		maxWait,
// 		result,
// 		timerId,
// 		lastCallTime,
// 		lastInvokeTime = 0,
// 		leading = false,
// 		maxing = false,
// 		trailing = true;

// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	wait = toNumber(wait) || 0;
// 	if (isObject(options)) {
// 		leading = !!options.leading;
// 		maxing = 'maxWait' in options;
// 		maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
// 		trailing = 'trailing' in options ? !!options.trailing : trailing;
// 	}

// 	function invokeFunc(time) {
// 		var args = lastArgs,
// 			thisArg = lastThis;

// 		lastArgs = lastThis = undefined;
// 		lastInvokeTime = time;
// 		result = func.apply(thisArg, args);
// 		return result;
// 	}

// 	function leadingEdge(time) {
// 		// Reset any `maxWait` timer.
// 		lastInvokeTime = time;
// 		// Start the timer for the trailing edge.
// 		timerId = setTimeout(timerExpired, wait);
// 		// Invoke the leading edge.
// 		return leading ? invokeFunc(time) : result;
// 	}

// 	function remainingWait(time) {
// 		var timeSinceLastCall = time - lastCallTime,
// 			timeSinceLastInvoke = time - lastInvokeTime,
// 			timeWaiting = wait - timeSinceLastCall;

// 		return maxing
// 			? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
// 			: timeWaiting;
// 	}

// 	function shouldInvoke(time) {
// 		var timeSinceLastCall = time - lastCallTime,
// 			timeSinceLastInvoke = time - lastInvokeTime;

// 		// Either this is the first call, activity has stopped and we're at the
// 		// trailing edge, the system time has gone backwards and we're treating
// 		// it as the trailing edge, or we've hit the `maxWait` limit.
// 		return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
// 			(timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
// 	}

// 	function timerExpired() {
// 		var time = now();
// 		if (shouldInvoke(time)) {
// 			return trailingEdge(time);
// 		}
// 		// Restart the timer.
// 		timerId = setTimeout(timerExpired, remainingWait(time));
// 	}

// 	function trailingEdge(time) {
// 		timerId = undefined;

// 		// Only invoke if we have `lastArgs` which means `func` has been
// 		// debounced at least once.
// 		if (trailing && lastArgs) {
// 			return invokeFunc(time);
// 		}
// 		lastArgs = lastThis = undefined;
// 		return result;
// 	}

// 	function cancel() {
// 		if (timerId !== undefined) {
// 			clearTimeout(timerId);
// 		}
// 		lastInvokeTime = 0;
// 		lastArgs = lastCallTime = lastThis = timerId = undefined;
// 	}

// 	function flush() {
// 		return timerId === undefined ? result : trailingEdge(now());
// 	}

// 	function debounced() {
// 		var time = now(),
// 			isInvoking = shouldInvoke(time);

// 		lastArgs = arguments;
// 		lastThis = this;
// 		lastCallTime = time;

// 		if (isInvoking) {
// 			if (timerId === undefined) {
// 				return leadingEdge(lastCallTime);
// 			}
// 			if (maxing) {
// 				// Handle invocations in a tight loop.
// 				clearTimeout(timerId);
// 				timerId = setTimeout(timerExpired, wait);
// 				return invokeFunc(lastCallTime);
// 			}
// 		}
// 		if (timerId === undefined) {
// 			timerId = setTimeout(timerExpired, wait);
// 		}
// 		return result;
// 	}
// 	debounced.cancel = cancel;
// 	debounced.flush = flush;
// 	return debounced;
// }

// var defer: (func: Function, ...args: any[]) => number = baseRest(function (func: Function, args: any[]) {
// 	return baseDelay(func, 1, args);
// });

// var delay: (func: Function, wait: number, ...args: any[]) => number = baseRest(function (func: Function, wait: number, args: any[]) {
// 	return baseDelay(func, toNumber(wait) || 0, args);
// });

// /**
//  * Creates a function that invokes `func` with arguments reversed.
//  *
//  * @static
//  * @memberOf _
//  * @since 4.0.0
//  * @category Function
//  * @param {Function} func The function to flip arguments for.
//  * @returns {Function} Returns the new flipped function.
//  * @example
//  *
//  * var flipped = _.flip(function() {
//  *   return _.toArray(arguments);
//  * });
//  *
//  * flipped('a', 'b', 'c', 'd');
//  * // => ['d', 'c', 'b', 'a']
//  */
// function flip(func: Function): Function {
// 	return createWrap(func, WRAP_FLIP_FLAG);
// }

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

// /**
//  * Creates a function that negates the result of the predicate `func`. The
//  * `func` predicate is invoked with the `this` binding and arguments of the
//  * created function.
//  *
//  * @static
//  * @memberOf _
//  * @since 3.0.0
//  * @category Function
//  * @param {Function} predicate The predicate to negate.
//  * @returns {Function} Returns the new negated function.
//  * @example
//  *
//  * function isEven(n) {
//  *   return n % 2 == 0;
//  * }
//  *
//  * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
//  * // => [1, 3, 5]
//  */
// function negate(predicate) {
// 	if (typeof predicate != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	return function () {
// 		var args = arguments;
// 		switch (args.length) {
// 			case 0: return !predicate.call(this);
// 			case 1: return !predicate.call(this, args[0]);
// 			case 2: return !predicate.call(this, args[0], args[1]);
// 			case 3: return !predicate.call(this, args[0], args[1], args[2]);
// 		}
// 		return !predicate.apply(this, args);
// 	};
// }

// function once(func: Function): Function {
// 	return before(2, func);
// }

// var overArgs: (func: Function, transforms: Function) => Function = castRest(function (func: Function, transforms: Function[]) {
// 	transforms = (transforms.length == 1 && isArray(transforms[0]))
// 		? arrayMap(transforms[0], baseUnary(getIteratee()))
// 		: arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

// 	var funcsLength = transforms.length;
// 	return baseRest(function (args: any[]) {
// 		var index = -1,
// 			length = nativeMin(args.length, funcsLength);

// 		while (++index < length) {
// 			args[index] = transforms[index].call(this, args[index]);
// 		}
// 		return apply(func, this, args);
// 	});
// });

// var partial: (func: Function, ...partials: any[]) => Function = baseRest(function (func, partials) {
// 	var holders = replaceHolders(partials, getHolder(partial));
// 	return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
// });

// var partialRight: (func: Function, ...partials: any[]) => Function = baseRest(function (func, partials) {
// 	var holders = replaceHolders(partials, getHolder(partialRight));
// 	return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
// });

// var rearg: (func: Function, ...indexes: number[] | number[][]) => Function = flatRest(function (func, indexes) {
// 	return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
// });

// function rest(func: Function, start: number): Function {
// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	start = start === undefined ? start : toInteger(start);
// 	return baseRest(func, start);
// }

// function spread(func: Function, start: number): Function {
// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	start = start == null ? 0 : nativeMax(toInteger(start), 0);
// 	return baseRest(function (args: any[]) {
// 		var array = args[start],
// 			otherArgs = castSlice(args, 0, start);

// 		if (array) {
// 			arrayPush(otherArgs, array);
// 		}
// 		return apply(func, this, otherArgs);
// 	});
// }

// function throttle(func: Function, wait: number, options: any): Function {
// 	var leading = true,
// 		trailing = true;

// 	if (typeof func != 'function') {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	if (isObject(options)) {
// 		leading = 'leading' in options ? !!options.leading : leading;
// 		trailing = 'trailing' in options ? !!options.trailing : trailing;
// 	}
// 	return debounce(func, wait, {
// 		'leading': leading,
// 		'maxWait': wait,
// 		'trailing': trailing
// 	});
// }

// function unary(func: Function): Function {
// 	return ary(func, 1);
// }

// /**
//  * Creates a function that provides `value` to `wrapper` as its first
//  * argument. Any additional arguments provided to the function are appended
//  * to those provided to the `wrapper`. The wrapper is invoked with the `this`
//  * binding of the created function.
//  *
//  * @static
//  * @memberOf _
//  * @since 0.1.0
//  * @category Function
//  * @param {*} value The value to wrap.
//  * @param {Function} [wrapper=identity] The wrapper function.
//  * @returns {Function} Returns the new function.
//  * @example
//  *
//  * var p = _.wrap(_.escape, function(func, text) {
//  *   return '<p>' + func(text) + '</p>';
//  * });
//  *
//  * p('fred, barney, & pebbles');
//  * // => '<p>fred, barney, &amp; pebbles</p>'
//  */
// function wrap(value, wrapper) {
// 	return partial(castFunction(wrapper), value);
// }

/*------------------------------------------------------------------------*/

// /**
//  * Casts `value` as an array if it's not one.
//  *
//  * @static
//  * @memberOf _
//  * @since 4.4.0
//  * @category Lang
//  * @param {*} value The value to inspect.
//  * @returns {Array} Returns the cast array.
//  * @example
//  *
//  * _.castArray(1);
//  * // => [1]
//  *
//  * _.castArray({ 'a': 1 });
//  * // => [{ 'a': 1 }]
//  *
//  * _.castArray('abc');
//  * // => ['abc']
//  *
//  * _.castArray(null);
//  * // => [null]
//  *
//  * _.castArray(undefined);
//  * // => [undefined]
//  *
//  * _.castArray();
//  * // => []
//  *
//  * var array = [1, 2, 3];
//  * console.log(_.castArray(array) === array);
//  * // => true
//  */
// function castArray() {
// 	if (!arguments.length) {
// 		return [];
// 	}
// 	var value = arguments[0];
// 	return isArray(value) ? value : [value];
// }

// function clone(value: any): any {
// 	return baseClone(value, CLONE_SYMBOLS_FLAG);
// }

// function cloneWith(value: any, customizer: Function): any {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
// }

function cloneDeep(value: any): any {
	return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

// function cloneDeepWith(value: any, customizer: Function): any {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
// }

// function conformsTo(object: any, source: any): boolean {
// 	return source == null || baseConformsTo(object, source, keys(source));
// }

function eq(value: any, other: any): boolean {
	return value === other || (value !== value && other !== other);
}

// var gt: (value: any, other: any) => boolean = createRelationalOperation(baseGt);

// var gte: (value: any, other: any) => boolean = createRelationalOperation(function (value, other) {
// 	return value >= other;
// });

var isArguments: (value: any) => boolean = baseIsArguments(function () { return arguments; }()) ? baseIsArguments : function (value) {
	return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

var isArray: (value: any) => boolean = Array.isArray;

// var isArrayBuffer: (value: any) => boolean = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

function isArrayLike(value: any): boolean {
	return value != null && isLength(value.length) && !isFunction(value);
}

// function isArrayLikeObject(value: any): boolean {
// 	return isObjectLike(value) && isArrayLike(value);
// }

// function isBoolean(value: any): boolean {
// 	return value === true || value === false ||
// 		(isObjectLike(value) && baseGetTag(value) == boolTag);
// }

var isBuffer: (value: any) => boolean = nativeIsBuffer || stubFalse;

// var isDate: (value: any) => boolean = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

// function isElement(value: any): boolean {
// 	return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
// }

// function isEmpty(value: any): boolean {
// 	if (value == null) {
// 		return true;
// 	}
// 	if (isArrayLike(value) &&
// 		(isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
// 			isBuffer(value) || isTypedArray(value) || isArguments(value))) {
// 		return !value.length;
// 	}
// 	var tag = getTag(value);
// 	if (tag == mapTag || tag == setTag) {
// 		return !value.size;
// 	}
// 	if (isPrototype(value)) {
// 		return !baseKeys(value).length;
// 	}
// 	for (var key in value) {
// 		if (hasOwnProperty.call(value, key)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }

function isEqual(value: any, other: any): boolean {
	return baseIsEqual(value, other);
}

// function isEqualWith(value: any, other: any, customizer: Function): boolean {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	var result = customizer ? customizer(value, other) : undefined;
// 	return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
// }

// function isError(value: any): boolean {
// 	if (!isObjectLike(value)) {
// 		return false;
// 	}
// 	var tag = baseGetTag(value);
// 	return tag == errorTag || tag == domExcTag ||
// 		(typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
// }

// function isFinite(value: any): boolean {
// 	return typeof value == 'number' && nativeIsFinite(value);
// }

function isFunction(value: any): boolean {
	if (!isObject(value)) {
		return false;
	}
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 9 which returns 'object' for typed arrays and other constructors.
	var tag = baseGetTag(value);
	return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

// function isInteger(value: any): boolean {
// 	return typeof value == 'number' && value == toInteger(value);
// }

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

// function isMatch(object: any, source: any): boolean {
// 	return object === source || baseIsMatch(object, source, getMatchData(source));
// }

// function isMatchWith(object: any, source: any, customizer: Function): boolean {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	return baseIsMatch(object, source, getMatchData(source), customizer);
// }

// function isNaN(value: any): boolean {
// 	// An `NaN` primitive is the only value that is not equal to itself.
// 	// Perform the `toStringTag` check first to avoid errors with some
// 	// ActiveX objects in IE.
// 	return isNumber(value) && value != +value;
// }

// function isNative(value: any): boolean {
// 	if (isMaskable(value)) {
// 		throw new Error(CORE_ERROR_TEXT);
// 	}
// 	return baseIsNative(value);
// }

// function isNull(value: any): boolean {
// 	return value === null;
// }

// function isNil(value: any): boolean {
// 	return value == null;
// }

// function isNumber(value: any): boolean {
// 	return typeof value == 'number' ||
// 		(isObjectLike(value) && baseGetTag(value) == numberTag);
// }

// function isPlainObject(value: any): boolean {
// 	if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
// 		return false;
// 	}
// 	var proto = getPrototype(value);
// 	if (proto === null) {
// 		return true;
// 	}
// 	var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
// 	return typeof Ctor == 'function' && Ctor instanceof Ctor &&
// 		funcToString.call(Ctor) == objectCtorString;
// }

// var isRegExp: (value: any) => boolean = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

// function isSafeInteger(value: any): boolean {
// 	return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
// }

var isSet: (value: any) => boolean = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

// function isString(value: any): boolean {
// 	return typeof value == 'string' ||
// 		(!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
// }

function isSymbol(value: any): boolean {
	return typeof value == 'symbol' ||
		(isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var isTypedArray: (value: any) => boolean = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

// function isUndefined(value: any): boolean {
// 	return value === undefined;
// }

// function isWeakMap(value: any): boolean {
// 	return isObjectLike(value) && getTag(value) == weakMapTag;
// }

// function isWeakSet(value: any): boolean {
// 	return isObjectLike(value) && baseGetTag(value) == weakSetTag;
// }

// var lt: (value: any, other: any) => boolean = createRelationalOperation(baseLt);

// var lte: (value: any, other: any) => boolean = createRelationalOperation(function (value: any, other: any) {
// 	return value <= other;
// });

// function toArray(value: any): any[] {
// 	if (!value) {
// 		return [];
// 	}
// 	if (isArrayLike(value)) {
// 		return isString(value) ? stringToArray(value) : copyArray(value);
// 	}
// 	if (symIterator && value[symIterator]) {
// 		return iteratorToArray(value[symIterator]());
// 	}
// 	var tag = getTag(value),
// 		func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

// 	return func(value);
// }

// function toFinite(value: any): number {
// 	if (!value) {
// 		return value === 0 ? value : 0;
// 	}
// 	value = toNumber(value);
// 	if (value === INFINITY || value === -INFINITY) {
// 		var sign = (value < 0 ? -1 : 1);
// 		return sign * MAX_INTEGER;
// 	}
// 	return value === value ? value : 0;
// }

// function toInteger(value: any): number {
// 	var result = toFinite(value),
// 		remainder = result % 1;

// 	return result === result ? (remainder ? result - remainder : result) : 0;
// }

// function toLength(value: any): number {
// 	return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
// }

// function toNumber(value: any): number {
// 	if (typeof value == 'number') {
// 		return value;
// 	}
// 	if (isSymbol(value)) {
// 		return NAN;
// 	}
// 	if (isObject(value)) {
// 		var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
// 		value = isObject(other) ? (other + '') : other;
// 	}
// 	if (typeof value != 'string') {
// 		return value === 0 ? value : +value;
// 	}
// 	value = value.replace(reTrim, '');
// 	var isBinary = reIsBinary.test(value);
// 	return (isBinary || reIsOctal.test(value))
// 		? freeParseInt(value.slice(2), isBinary ? 2 : 8)
// 		: (reIsBadHex.test(value) ? NAN : +value);
// }

// function toPlainObject(value: any): any {
// 	return copyObject(value, keysIn(value));
// }

// function toSafeInteger(value: any): number {
// 	return value
// 		? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
// 		: (value === 0 ? value : 0);
// }

function toString(value: any): string {
	return value == null ? '' : baseToString(value);
}

// var assign = createAssigner(function (object, source) {
// 	if (isPrototype(source) || isArrayLike(source)) {
// 		copyObject(source, keys(source), object);
// 		return;
// 	}
// 	for (var key in source) {
// 		if (hasOwnProperty.call(source, key)) {
// 			assignValue(object, key, source[key]);
// 		}
// 	}
// });

// var assignIn = createAssigner(function (object: any, source: any) {
// 	copyObject(source, keysIn(source), object);
// });

// var assignInWith = createAssigner(function (object: any, source: any, srcIndex: number, customizer: Function) {
// 	copyObject(source, keysIn(source), object, customizer);
// });

// var assignWith = createAssigner(function (object: any, source: any, srcIndex: number, customizer: Function) {
// 	copyObject(source, keys(source), object, customizer);
// });

// var at = flatRest(baseAt);

// function create(prototype: any, properties: any): any {
// 	var result = baseCreate(prototype);
// 	return properties == null ? result : baseAssign(result, properties);
// }

// var defaults = baseRest(function (object: any, sources: any[]) {
// 	object = Object(object);

// 	var index = -1;
// 	var length = sources.length;
// 	var guard = length > 2 ? sources[2] : undefined;

// 	if (guard && isIterateeCall(sources[0], sources[1], guard)) {
// 		length = 1;
// 	}

// 	while (++index < length) {
// 		var source = sources[index];
// 		var props = keysIn(source);
// 		var propsIndex = -1;
// 		var propsLength = props.length;

// 		while (++propsIndex < propsLength) {
// 			var key = props[propsIndex];
// 			var value = object[key];

// 			if (value === undefined ||
// 				(eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
// 				object[key] = source[key];
// 			}
// 		}
// 	}

// 	return object;
// });

// var defaultsDeep = baseRest(function (args: any[]) {
// 	args.push(undefined, customDefaultsMerge);
// 	return apply(mergeWith, undefined, args);
// });

// function findKey(object: any, predicate: Function): string {
// 	return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
// }

// function findLastKey(object: any, predicate: Function): string {
// 	return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
// }

// function forIn(object: any, iteratee: Function): any {
// 	return object == null
// 		? object
// 		: baseFor(object, getIteratee(iteratee, 3), keysIn);
// }

// function forInRight(object: any, iteratee: Function): any {
// 	return object == null
// 		? object
// 		: baseForRight(object, getIteratee(iteratee, 3), keysIn);
// }

// function forOwn(object: any, iteratee: Function): any {
// 	return object && baseForOwn(object, getIteratee(iteratee, 3));
// }

// function forOwnRight(object: any, iteratee: Function): any {
// 	return object && baseForOwnRight(object, getIteratee(iteratee, 3));
// }

// function functions(object: any): string[] {
// 	return object == null ? [] : baseFunctions(object, keys(object));
// }

// function functionsIn(object: any): string[] {
// 	return object == null ? [] : baseFunctions(object, keysIn(object));
// }

// function get(object: any, path: string[] | string, defaultValue?: any): any {
// 	var result = object == null ? undefined : baseGet(object, path);
// 	return result === undefined ? defaultValue : result;
// }

// function has(object: any, path: string[] | string): boolean {
// 	return object != null && hasPath(object, path, baseHas);
// }

// function hasIn(object: any, path: string[] | string): boolean {
// 	return object != null && hasPath(object, path, baseHasIn);
// }

// var invert = createInverter(function (result, value, key) {
// 	if (value != null &&
// 		typeof value.toString != 'function') {
// 		value = nativeObjectToString.call(value);
// 	}

// 	result[value] = key;
// }, constant(identity));

// var invertBy = createInverter(function (result, value, key) {
// 	if (value != null &&
// 		typeof value.toString != 'function') {
// 		value = nativeObjectToString.call(value);
// 	}

// 	if (hasOwnProperty.call(result, value)) {
// 		result[value].push(key);
// 	} else {
// 		result[value] = [key];
// 	}
// }, getIteratee);

// var invoke = baseRest(baseInvoke);

function keys(object: any): string[] {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function keysIn(object: any): string[] {
	return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

// function mapKeys(object: any, iteratee: Function): any {
// 	var result = {};
// 	iteratee = getIteratee(iteratee, 3);

// 	baseForOwn(object, function (value, key, object) {
// 		baseAssignValue(result, iteratee(value, key, object), value);
// 	});
// 	return result;
// }

// function mapValues(object: any, iteratee: Function): any {
// 	var result = {};
// 	iteratee = getIteratee(iteratee, 3);

// 	baseForOwn(object, function (value, key, object) {
// 		baseAssignValue(result, key, iteratee(value, key, object));
// 	});
// 	return result;
// }

// var merge = createAssigner(function (object, source, srcIndex) {
// 	baseMerge(object, source, srcIndex);
// });

// var mergeWith = createAssigner(function (object: any, source: any, srcIndex: number, customizer: Function) {
// 	baseMerge(object, source, srcIndex, customizer);
// });

// var omit = flatRest(function (object, paths) {
// 	var result = {};
// 	if (object == null) {
// 		return result;
// 	}
// 	var isDeep = false;
// 	paths = arrayMap(paths, function (path) {
// 		path = castPath(path, object);
// 		isDeep || (isDeep = path.length > 1);
// 		return path;
// 	});
// 	copyObject(object, getAllKeysIn(object), result);
// 	if (isDeep) {
// 		result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
// 	}
// 	var length = paths.length;
// 	while (length--) {
// 		baseUnset(result, paths[length]);
// 	}
// 	return result;
// });

// function omitBy(object: any, predicate: Function): any {
// 	return pickBy(object, negate(getIteratee(predicate)));
// }

// var pick = flatRest(function (object, paths) {
// 	return object == null ? {} : basePick(object, paths);
// });

// function pickBy(object: any, predicate: Function): any {
// 	if (object == null) {
// 		return {};
// 	}
// 	var props = arrayMap(getAllKeysIn(object), function (prop) {
// 		return [prop];
// 	});
// 	predicate = getIteratee(predicate);
// 	return basePickBy(object, props, function (value, path) {
// 		return predicate(value, path[0]);
// 	});
// }

// function result(object: any, path: string[] | string, defaultValue: any): any {
// 	path = castPath(path, object);

// 	var index = -1,
// 		length = path.length;

// 	// Ensure the loop is entered when path is empty.
// 	if (!length) {
// 		length = 1;
// 		object = undefined;
// 	}
// 	while (++index < length) {
// 		var value = object == null ? undefined : object[toKey(path[index])];
// 		if (value === undefined) {
// 			index = length;
// 			value = defaultValue;
// 		}
// 		object = isFunction(value) ? value.call(object) : value;
// 	}
// 	return object;
// }

// function set(object: any, path: string[] | string, value: any): any {
// 	return object == null ? object : baseSet(object, path, value);
// }

// function setWith(object: any, path: string[] | string, value: any, customizer: Function): any {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	return object == null ? object : baseSet(object, path, value, customizer);
// }

// var toPairs = createToPairs(keys);
// var toPairsIn = createToPairs(keysIn);

// function transform(object: any, iteratee: Function, accumulator: any): any {
// 	var isArr = isArray(object),
// 		isArrLike = isArr || isBuffer(object) || isTypedArray(object);

// 	iteratee = getIteratee(iteratee, 4);
// 	if (accumulator == null) {
// 		var Ctor = object && object.constructor;
// 		if (isArrLike) {
// 			accumulator = isArr ? new Ctor : [];
// 		}
// 		else if (isObject(object)) {
// 			accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
// 		}
// 		else {
// 			accumulator = {};
// 		}
// 	}
// 	(isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
// 		return iteratee(accumulator, value, index, object);
// 	});
// 	return accumulator;
// }

// function unset(object: any, path: string[] | string): boolean {
// 	return object == null ? true : baseUnset(object, path);
// }

// function update(object: any, path: string[] | string, updater: Function): any {
// 	return object == null ? object : baseUpdate(object, path, castFunction(updater));
// }

// function updateWith(object: any, path: string | string[], updater: Function, customizer: Function): any {
// 	customizer = typeof customizer == 'function' ? customizer : undefined;
// 	return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
// }

// function values(object: any): any[] {
// 	return object == null ? [] : baseValues(object, keys(object));
// }

// function valuesIn(object: any): any[] {
// 	return object == null ? [] : baseValues(object, keysIn(object));
// }

// function clamp(number: number, lower: number, upper: number): number {
// 	if (upper === undefined) {
// 		upper = lower;
// 		lower = undefined;
// 	}
// 	if (upper !== undefined) {
// 		upper = toNumber(upper);
// 		upper = upper === upper ? upper : 0;
// 	}
// 	if (lower !== undefined) {
// 		lower = toNumber(lower);
// 		lower = lower === lower ? lower : 0;
// 	}
// 	return baseClamp(toNumber(number), lower, upper);
// }

// function inRange(number: number, start: number, end: number): boolean {
// 	start = toFinite(start);
// 	if (end === undefined) {
// 		end = start;
// 		start = 0;
// 	} else {
// 		end = toFinite(end);
// 	}
// 	number = toNumber(number);
// 	return baseInRange(number, start, end);
// }

// function random(lower: number, upper: number, floating: boolean): number {
// 	if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
// 		upper = floating = undefined;
// 	}
// 	if (floating === undefined) {
// 		if (typeof upper == 'boolean') {
// 			floating = upper;
// 			upper = undefined;
// 		}
// 		else if (typeof lower == 'boolean') {
// 			floating = lower;
// 			lower = undefined;
// 		}
// 	}
// 	if (lower === undefined && upper === undefined) {
// 		lower = 0;
// 		upper = 1;
// 	}
// 	else {
// 		lower = toFinite(lower);
// 		if (upper === undefined) {
// 			upper = lower;
// 			lower = 0;
// 		} else {
// 			upper = toFinite(upper);
// 		}
// 	}
// 	if (lower > upper) {
// 		var temp = lower;
// 		lower = upper;
// 		upper = temp;
// 	}
// 	if (floating || lower % 1 || upper % 1) {
// 		var rand = nativeRandom();
// 		return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
// 	}
// 	return baseRandom(lower, upper);
// }

// var camelCase = createCompounder(function (result, word, index) {
// 	word = word.toLowerCase();
// 	return result + (index ? capitalize(word) : word);
// });

// function capitalize(string: string): string {
// 	return upperFirst(toString(string).toLowerCase());
// }

// function deburr(string: string): string {
// 	string = toString(string);
// 	return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
// }

// function endsWith(string: string, target: string, position: number): boolean {
// 	string = toString(string);
// 	target = baseToString(target);

// 	var length = string.length;
// 	position = position === undefined
// 		? length
// 		: baseClamp(toInteger(position), 0, length);

// 	var end = position;
// 	position -= target.length;
// 	return position >= 0 && string.slice(position, end) == target;
// }

// function escape(string: string): string {
// 	string = toString(string);
// 	return (string && reHasUnescapedHtml.test(string))
// 		? string.replace(reUnescapedHtml, escapeHtmlChar)
// 		: string;
// }

// function escapeRegExp(string: string): string {
// 	string = toString(string);
// 	return (string && reHasRegExpChar.test(string))
// 		? string.replace(reRegExpChar, '\\$&')
// 		: string;
// }

// var kebabCase = createCompounder(function (result, word, index) {
// 	return result + (index ? '-' : '') + word.toLowerCase();
// });

// var lowerCase = createCompounder(function (result, word, index) {
// 	return result + (index ? ' ' : '') + word.toLowerCase();
// });

// var lowerFirst = createCaseFirst('toLowerCase');

// function pad(string: string, length: number, chars: string): string {
// 	string = toString(string);
// 	length = toInteger(length);

// 	var strLength = length ? stringSize(string) : 0;
// 	if (!length || strLength >= length) {
// 		return string;
// 	}
// 	var mid = (length - strLength) / 2;
// 	return (
// 		createPadding(nativeFloor(mid), chars) +
// 		string +
// 		createPadding(nativeCeil(mid), chars)
// 	);
// }

// function padEnd(string: string, length: number, chars: string): string {
// 	string = toString(string);
// 	length = toInteger(length);

// 	var strLength = length ? stringSize(string) : 0;
// 	return (length && strLength < length)
// 		? (string + createPadding(length - strLength, chars))
// 		: string;
// }

// function padStart(string: string, length: number, chars: string): string {
// 	string = toString(string);
// 	length = toInteger(length);

// 	var strLength = length ? stringSize(string) : 0;
// 	return (length && strLength < length)
// 		? (createPadding(length - strLength, chars) + string)
// 		: string;
// }

function parseInt(string: string, radix: number, guard?: any): number {
	if (guard || radix == null) {
		radix = 0;
	} else if (radix) {
		radix = +radix;
	}
	return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
}

// function repeat(string: string, n: number, guard: any): string {
// 	if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
// 		n = 1;
// 	} else {
// 		n = toInteger(n);
// 	}
// 	return baseRepeat(toString(string), n);
// }

// function replace(source?: string, pattern?: string | RegExp, replacement?: string | Function): string {
// 	var args = arguments,
// 		string = toString(source);

// 	return args.length < 3 ? string : string.replace(pattern, replacement);
// }

// var snakeCase = createCompounder(function (result, word, index) {
// 	return result + (index ? '_' : '') + word.toLowerCase();
// });

// function split(string: string, separator: string | RegExp, limit: number): string[] {
// 	if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
// 		separator = limit = undefined;
// 	}
// 	limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
// 	if (!limit) {
// 		return [];
// 	}
// 	string = toString(string);
// 	if (string && (
// 		typeof separator == 'string' ||
// 		(separator != null && !isRegExp(separator))
// 	)) {
// 		separator = baseToString(separator);
// 		if (!separator && hasUnicode(string)) {
// 			return castSlice(stringToArray(string), 0, limit);
// 		}
// 	}
// 	return string.split(separator, limit);
// }

// var startCase = createCompounder(function (result, word, index) {
// 	return result + (index ? ' ' : '') + upperFirst(word);
// });

// function startsWith(string: string, target: string, position: number): boolean {
// 	string = toString(string);
// 	position = position == null
// 		? 0
// 		: baseClamp(toInteger(position), 0, string.length);

// 	target = baseToString(target);
// 	return string.slice(position, position + target.length) == target;
// }

// function template(string: string, options: any, guard: any): Function {
// 	// Based on John Resig's `tmpl` implementation
// 	// (http://ejohn.org/blog/javascript-micro-templating/)
// 	// and Laura Doktorova's doT.js (https://github.com/olado/doT).
// 	var settings = lodash.templateSettings;

// 	if (guard && isIterateeCall(string, options, guard)) {
// 		options = undefined;
// 	}
// 	string = toString(string);
// 	options = assignInWith({}, options, settings, customDefaultsAssignIn);

// 	var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
// 		importsKeys = keys(imports),
// 		importsValues = baseValues(imports, importsKeys);

// 	var isEscaping,
// 		isEvaluating,
// 		index = 0,
// 		interpolate = options.interpolate || reNoMatch,
// 		source = "__p += '";

// 	// Compile the regexp to match each delimiter.
// 	var reDelimiters = RegExp(
// 		(options.escape || reNoMatch).source + '|' +
// 		interpolate.source + '|' +
// 		(interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
// 		(options.evaluate || reNoMatch).source + '|$'
// 		, 'g');

// 	// Use a sourceURL for easier debugging.
// 	// The sourceURL gets injected into the source that's eval-ed, so be careful
// 	// with lookup (in case of e.g. prototype pollution), and strip newlines if any.
// 	// A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.
// 	var sourceURL = '//# sourceURL=' +
// 		(hasOwnProperty.call(options, 'sourceURL')
// 			? (options.sourceURL + '').replace(/[\r\n]/g, ' ')
// 			: ('lodash.templateSources[' + (++templateCounter) + ']')
// 		) + '\n';

// 	string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
// 		interpolateValue || (interpolateValue = esTemplateValue);

// 		// Escape characters that can't be included in string literals.
// 		source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

// 		// Replace delimiters with snippets.
// 		if (escapeValue) {
// 			isEscaping = true;
// 			source += "' +\n__e(" + escapeValue + ") +\n'";
// 		}
// 		if (evaluateValue) {
// 			isEvaluating = true;
// 			source += "';\n" + evaluateValue + ";\n__p += '";
// 		}
// 		if (interpolateValue) {
// 			source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
// 		}
// 		index = offset + match.length;

// 		// The JS engine embedded in Adobe products needs `match` returned in
// 		// order to produce the correct `offset` value.
// 		return match;
// 	});

// 	source += "';\n";

// 	// If `variable` is not specified wrap a with-statement around the generated
// 	// code to add the data object to the top of the scope chain.
// 	// Like with sourceURL, we take care to not check the option's prototype,
// 	// as this configuration is a code injection vector.
// 	var variable = hasOwnProperty.call(options, 'variable') && options.variable;
// 	if (!variable) {
// 		source = 'with (obj) {\n' + source + '\n}\n';
// 	}
// 	// Cleanup code by stripping empty strings.
// 	source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
// 		.replace(reEmptyStringMiddle, '$1')
// 		.replace(reEmptyStringTrailing, '$1;');

// 	// Frame code as the function body.
// 	source = 'function(' + (variable || 'obj') + ') {\n' +
// 		(variable
// 			? ''
// 			: 'obj || (obj = {});\n'
// 		) +
// 		"var __t, __p = ''" +
// 		(isEscaping
// 			? ', __e = _.escape'
// 			: ''
// 		) +
// 		(isEvaluating
// 			? ', __j = Array.prototype.join;\n' +
// 			"function print() { __p += __j.call(arguments, '') }\n"
// 			: ';\n'
// 		) +
// 		source +
// 		'return __p\n}';

// 	var result = attempt(function () {
// 		return Function(importsKeys, sourceURL + 'return ' + source)
// 			.apply(undefined, importsValues);
// 	});

// 	// Provide the compiled function's source by its `toString` method or
// 	// the `source` property as a convenience for inlining compiled templates.
// 	result.source = source;
// 	if (isError(result)) {
// 		throw result;
// 	}
// 	return result;
// }

// function toLower(value: string): string {
// 	return toString(value).toLowerCase();
// }

// function toUpper(value: string): string {
// 	return toString(value).toUpperCase();
// }

// function trim(string: string, chars: string, guard: any): string {
// 	string = toString(string);
// 	if (string && (guard || chars === undefined)) {
// 		return string.replace(reTrim, '');
// 	}
// 	if (!string || !(chars = baseToString(chars))) {
// 		return string;
// 	}
// 	var strSymbols = stringToArray(string),
// 		chrSymbols = stringToArray(chars),
// 		start = charsStartIndex(strSymbols, chrSymbols),
// 		end = charsEndIndex(strSymbols, chrSymbols) + 1;

// 	return castSlice(strSymbols, start, end).join('');
// }

// function trimEnd(string: string, chars: string, guard: any): string {
// 	string = toString(string);
// 	if (string && (guard || chars === undefined)) {
// 		return string.replace(reTrimEnd, '');
// 	}
// 	if (!string || !(chars = baseToString(chars))) {
// 		return string;
// 	}
// 	var strSymbols = stringToArray(string),
// 		end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

// 	return castSlice(strSymbols, 0, end).join('');
// }

// function trimStart(string: string, chars: string, guard: any): string {
// 	string = toString(string);
// 	if (string && (guard || chars === undefined)) {
// 		return string.replace(reTrimStart, '');
// 	}
// 	if (!string || !(chars = baseToString(chars))) {
// 		return string;
// 	}
// 	var strSymbols = stringToArray(string),
// 		start = charsStartIndex(strSymbols, stringToArray(chars));

// 	return castSlice(strSymbols, start).join('');
// }

// function truncate(string: string, options: any): string {
// 	var length = DEFAULT_TRUNC_LENGTH,
// 		omission = DEFAULT_TRUNC_OMISSION;

// 	if (isObject(options)) {
// 		var separator = 'separator' in options ? options.separator : separator;
// 		length = 'length' in options ? toInteger(options.length) : length;
// 		omission = 'omission' in options ? baseToString(options.omission) : omission;
// 	}
// 	string = toString(string);

// 	var strLength = string.length;
// 	if (hasUnicode(string)) {
// 		var strSymbols = stringToArray(string);
// 		strLength = strSymbols.length;
// 	}
// 	if (length >= strLength) {
// 		return string;
// 	}
// 	var end = length - stringSize(omission);
// 	if (end < 1) {
// 		return omission;
// 	}
// 	var result = strSymbols
// 		? castSlice(strSymbols, 0, end).join('')
// 		: string.slice(0, end);

// 	if (separator === undefined) {
// 		return result + omission;
// 	}
// 	if (strSymbols) {
// 		end += (result.length - end);
// 	}
// 	if (isRegExp(separator)) {
// 		if (string.slice(end).search(separator)) {
// 			var match,
// 				substring = result;

// 			if (!separator.global) {
// 				separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
// 			}
// 			separator.lastIndex = 0;
// 			while ((match = separator.exec(substring))) {
// 				var newEnd = match.index;
// 			}
// 			result = result.slice(0, newEnd === undefined ? end : newEnd);
// 		}
// 	} else if (string.indexOf(baseToString(separator), end) != end) {
// 		var index = result.lastIndexOf(separator);
// 		if (index > -1) {
// 			result = result.slice(0, index);
// 		}
// 	}
// 	return result + omission;
// }

// function unescape(string: string): string {
// 	string = toString(string);
// 	return (string && reHasEscapedHtml.test(string)) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
// }

// var upperCase = createCompounder(function (result, word, index) {
// 	return result + (index ? ' ' : '') + word.toUpperCase();
// });

// var upperFirst = createCaseFirst('toUpperCase');

// function words(string: string, pattern?: string | RegExp, guard?: any): string[] {
// 	string = toString(string);
// 	pattern = guard ? undefined : pattern;

// 	if (pattern === undefined) {
// 		return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
// 	}
// 	return string.match(pattern) || [];
// }

// var attempt = baseRest(function (func: Function, args: any[]) {
// 	try {
// 		return apply(func, undefined, args);
// 	} catch (e) {
// 		return isError(e) ? e : new Error(e);
// 	}
// });

// var bindAll = flatRest(function (object: any, methodNames: string[]) {
// 	arrayEach(methodNames, function (key: string) {
// 		key = toKey(key);
// 		baseAssignValue(object, key, bind(object[key], object));
// 	});
// 	return object;
// });

// function cond(pairs: any[]): Function {
// 	var length = pairs == null ? 0 : pairs.length,
// 		toIteratee = getIteratee();

// 	pairs = !length ? [] : arrayMap(pairs, function (pair: any[]) {
// 		if (typeof pair[1] != 'function') {
// 			throw new TypeError(FUNC_ERROR_TEXT);
// 		}
// 		return [toIteratee(pair[0]), pair[1]];
// 	});

// 	return baseRest(function (args: any[]) {
// 		var index = -1;
// 		while (++index < length) {
// 			var pair = pairs[index];
// 			if (apply(pair[0], this, args)) {
// 				return apply(pair[1], this, args);
// 			}
// 		}
// 	});
// }

// function conforms(source: any): Function {
// 	return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
// }

// function constant(value: any): Function {
// 	return function () {
// 		return value;
// 	};
// }

// function defaultTo(value: any, defaultValue: any): any {
// 	return (value == null || value !== value) ? defaultValue : value;
// }

// var flow = createFlow();

// var flowRight = createFlow(true);

// function identity(value: any): any {
// 	return value;
// }

// function iteratee(func: any): Function {
// 	return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
// }

// function matches(source: any): Function {
// 	return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
// }

// function matchesProperty(path: string | string[], srcValue: any): Function {
// 	return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
// }

// var method = baseRest(function (path: string, args: any[]) {
// 	return function (object: any) {
// 		return baseInvoke(object, path, args);
// 	};
// });

// var methodOf = baseRest(function (object: any, args: any[]) {
// 	return function (path: string) {
// 		return baseInvoke(object, path, args);
// 	};
// });

// function mixin(object: any, source: any, options: any): Function | any {
// 	var props = keys(source),
// 		methodNames = baseFunctions(source, props);

// 	if (options == null &&
// 		!(isObject(source) && (methodNames.length || !props.length))) {
// 		options = source;
// 		source = object;
// 		object = this;
// 		methodNames = baseFunctions(source, keys(source));
// 	}
// 	var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
// 		isFunc = isFunction(object);

// 	arrayEach(methodNames, function (methodName: string) {
// 		var func = source[methodName];
// 		object[methodName] = func;
// 		if (isFunc) {
// 			object.prototype[methodName] = function () {
// 				var chainAll = this.__chain__;
// 				if (chain || chainAll) {
// 					var result = object(this.__wrapped__),
// 						actions = result.__actions__ = copyArray(this.__actions__);

// 					actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
// 					result.__chain__ = chainAll;
// 					return result;
// 				}
// 				return func.apply(object, arrayPush([this.value()], arguments));
// 			};
// 		}
// 	});

// 	return object;
// }

// function noConflict(): Function {
// 	if (root._ === this) {
// 		root._ = oldDash;
// 	}
// 	return this;
// }

// function noop(): void {
// 	// No operation performed.
// }

// function nthArg(n: number): Function {
// 	n = toInteger(n);
// 	return baseRest(function (args: any[]) {
// 		return baseNth(args, n);
// 	});
// }

// var over = createOver(arrayMap);
// var overEvery = createOver(arrayEvery);
// var overSome = createOver(arraySome);

// function property(path: any[] | string): Function {
// 	return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
// }

// function propertyOf(object: any): Function {
// 	return function (path) {
// 		return object == null ? undefined : baseGet(object, path);
// 	};
// }

// var range = createRange();
// var rangeRight = createRange(true);

function stubArray(): any[] {
	return [];
}

function stubFalse(): boolean {
	return false;
}

// function stubObject(): any {
// 	return {};
// }

// function stubString(): string {
// 	return '';
// }

// function stubTrue(): boolean {
// 	return true;
// }

// function times(n: number, iteratee: Function): any[] {
// 	n = toInteger(n);
// 	if (n < 1 || n > MAX_SAFE_INTEGER) {
// 		return [];
// 	}
// 	var index = MAX_ARRAY_LENGTH,
// 		length = nativeMin(n, MAX_ARRAY_LENGTH);

// 	iteratee = getIteratee(iteratee);
// 	n -= MAX_ARRAY_LENGTH;

// 	var result = baseTimes(length, iteratee);
// 	while (++index < n) {
// 		iteratee(index);
// 	}
// 	return result;
// }

// function toPath(value: any): any[] {
// 	if (isArray(value)) {
// 		return arrayMap(value, toKey);
// 	}
// 	return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
// }

// function uniqueId(prefix: string): string {
// 	var id = ++idCounter;
// 	return toString(prefix) + id;
// }

// var add = createMathOperation(function (augend: number, addend: number) {
// 	return augend + addend;
// }, 0);

// var ceil = createRound('ceil');

// var divide = createMathOperation(function (dividend: number, divisor: number) {
// 	return dividend / divisor;
// }, 1);

// var floor = createRound('floor');

// function max(array: any[]): any {
// 	return (array && array.length)
// 		? baseExtremum(array, identity, baseGt)
// 		: undefined;
// }

// function maxBy(array: any[], iteratee: Function): any {
// 	return (array && array.length)
// 		? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
// 		: undefined;
// }

// function mean(array: any[]): number {
// 	return baseMean(array, identity);
// }

// function meanBy(array: any[], iteratee: Function): number {
// 	return baseMean(array, getIteratee(iteratee, 2));
// }

// function min(array: any[]): any {
// 	return (array && array.length)
// 		? baseExtremum(array, identity, baseLt)
// 		: undefined;
// }

// function minBy(array: any[], iteratee: Function): any {
// 	return (array && array.length)
// 		? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
// 		: undefined;
// }

// var multiply = createMathOperation(function (multiplier: number, multiplicand: number) {
// 	return multiplier * multiplicand;
// }, 1);

// var round = createRound('round');

// var subtract = createMathOperation(function (minuend: number, subtrahend: number) {
// 	return minuend - subtrahend;
// }, 0);

// function sum(array: any[]): number {
// 	return (array && array.length)
// 		? baseSum(array, identity)
// 		: 0;
// }

// function sumBy(array: any[], iteratee: Function): number {
// 	return (array && array.length)
// 		? baseSum(array, getIteratee(iteratee, 2))
// 		: 0;
// }

export default {
	clone: function (source: any) {
		return cloneDeep(source);
	},
	equals: function (first: any, second: any): boolean {
		return isEqual(first, second);
	},
};
