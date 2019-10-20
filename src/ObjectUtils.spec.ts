/* tslint:disable */

import { assert } from "chai";
import { describe, it } from "mocha";
import ObjectUtils from "./ObjectUtils";
import _ from "lodash";
import { JSDOM } from "jsdom";

interface DefineType {

}

interface UiType {

	isModularize: boolean;

	isStrict: boolean;

	buildPath: string[];

	loaderPath: string;

	urlParams: any;

	isForeign: boolean;

	isSauceLabs: boolean;

}

interface RootType extends Window {

	ui?: UiType;

	phantom?: any;

	process?: any;

	define?: DefineType;

	ArrayBuffer?: any;

	Buffer?: any;

	Map?: any;

	Promise?: any;

	Proxy?: any;

	Set?: any;

	Symbol?: any;

	Uint8Array?: any;

	WeakMap?: any;

	WeakSet?: any;

	Worker?: any;

	msWDfn?: any;

	__coverage__?: any;

}

// declare var define: any;

/** Used as a safe reference for `undefined` in pre-ES5 environments. */
// var undefined;

/** Used to detect when a function becomes hot. */
// var HOT_COUNT = 150;

/** Used as the size to cover large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
// var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as the maximum memoize cache size. */
// var MAX_MEMOIZE_SIZE = 500;

/** Used as references for various `Number` constants. */
// var MAX_SAFE_INTEGER = 9007199254740991,
// 	MAX_INTEGER = 1.7976931348623157e+308;

/** Used as references for the maximum length and index of an array. */
// var MAX_ARRAY_LENGTH = 4294967295,
// MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/** `Object#toString` result references. */
// var funcTag = '[object Function]',
// 	numberTag = '[object Number]',
// 	objectTag = '[object Object]';

/** Used as a reference to the global object. */
var intermediateRoot: unknown = (typeof global == 'object' && global) || this;
var root: RootType = intermediateRoot as RootType;

/** Used for native method references. */
var arrayProto = Array.prototype,
	// funcProto = Function.prototype,
	objectProto = Object.prototype;
	// numberProto = Number.prototype,
	// stringProto = String.prototype;

const mockWindow = new JSDOM("<html></html>").window;

/** Method and object shortcuts. */
var phantom = root.phantom,
	// process = root.process,
	// amd = root.define ? define.amd : undefined,
	args = toArgs([1, 2, 3]),
	// argv = process ? process.argv : undefined,
	defineProperty = Object.defineProperty,
	document = mockWindow.document,
	body = root.document ? root.document.body : undefined,
	create = Object.create,
	// fnToString = funcProto.toString,
	// freeze = Object.freeze,
	getSymbols = Object.getOwnPropertySymbols,
	// identity = function (value) { return value; },
	noop = function () { },
	// objToString = objectProto.toString,
	// params = argv,
	// push = arrayProto.push,
	slice = arrayProto.slice;
	// strictArgs = (function (first: any, second: any, third: any) { 'use strict'; return arguments; } (1, 2, 3));

var ArrayBuffer = root.ArrayBuffer,
	Buffer = root.Buffer,
	Map = root.Map,
	Promise = root.Promise,
	Proxy = root.Proxy,
	Set = root.Set,
	Symbol = root.Symbol,
	Uint8Array = root.Uint8Array;
	// WeakMap = root.WeakMap,
	// WeakSet = root.WeakSet;

var arrayBuffer = ArrayBuffer ? new ArrayBuffer(2) : undefined,
	map = Map ? new Map : undefined,
	promise = Promise ? Promise.resolve(1) : undefined,
	set = Set ? new Set : undefined,
	symbol = Symbol ? Symbol('a') : undefined;
	// weakMap = WeakMap ? new WeakMap : undefined,
	// weakSet = WeakSet ? new WeakSet : undefined;

/** Math helpers. */
// var add = function (x, y) { return x + y; },
// 	doubled = function (n) { return n * 2; },
// 	isEven = function (n) { return n % 2 == 0; },
// 	square = function (n) { return n * n; };

/** Stub functions. */
// var stubA = function () { return 'a'; },
// 	stubB = function () { return 'b'; },
// 	stubC = function () { return 'c'; };

var stubTrue = function () { return true; },
	stubFalse = function () { return false; };

// var stubNaN = function () { return NaN; },
// 	stubNull = function () { return null; };

// var stubZero = function () { return 0; },
// 	stubOne = function () { return 1; },
// 	stubTwo = function () { return 2; },
// 	stubThree = function () { return 3; },
// 	stubFour = function () { return 4; };

// var stubArray = function () { return []; },
// 	stubObject = function () { return {}; },
// 	stubString = function () { return ''; };

/** List of Latin Unicode letters. */
// var burredLetters = [
// 	// Latin-1 Supplement letters.
// 	'\xc0', '\xc1', '\xc2', '\xc3', '\xc4', '\xc5', '\xc6', '\xc7', '\xc8', '\xc9', '\xca', '\xcb', '\xcc', '\xcd', '\xce', '\xcf',
// 	'\xd0', '\xd1', '\xd2', '\xd3', '\xd4', '\xd5', '\xd6', '\xd8', '\xd9', '\xda', '\xdb', '\xdc', '\xdd', '\xde', '\xdf',
// 	'\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7', '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
// 	'\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff',
// 	// Latin Extended-A letters.
// 	'\u0100', '\u0101', '\u0102', '\u0103', '\u0104', '\u0105', '\u0106', '\u0107', '\u0108', '\u0109', '\u010a', '\u010b', '\u010c', '\u010d', '\u010e', '\u010f',
// 	'\u0110', '\u0111', '\u0112', '\u0113', '\u0114', '\u0115', '\u0116', '\u0117', '\u0118', '\u0119', '\u011a', '\u011b', '\u011c', '\u011d', '\u011e', '\u011f',
// 	'\u0120', '\u0121', '\u0122', '\u0123', '\u0124', '\u0125', '\u0126', '\u0127', '\u0128', '\u0129', '\u012a', '\u012b', '\u012c', '\u012d', '\u012e', '\u012f',
// 	'\u0130', '\u0131', '\u0132', '\u0133', '\u0134', '\u0135', '\u0136', '\u0137', '\u0138', '\u0139', '\u013a', '\u013b', '\u013c', '\u013d', '\u013e', '\u013f',
// 	'\u0140', '\u0141', '\u0142', '\u0143', '\u0144', '\u0145', '\u0146', '\u0147', '\u0148', '\u0149', '\u014a', '\u014b', '\u014c', '\u014d', '\u014e', '\u014f',
// 	'\u0150', '\u0151', '\u0152', '\u0153', '\u0154', '\u0155', '\u0156', '\u0157', '\u0158', '\u0159', '\u015a', '\u015b', '\u015c', '\u015d', '\u015e', '\u015f',
// 	'\u0160', '\u0161', '\u0162', '\u0163', '\u0164', '\u0165', '\u0166', '\u0167', '\u0168', '\u0169', '\u016a', '\u016b', '\u016c', '\u016d', '\u016e', '\u016f',
// 	'\u0170', '\u0171', '\u0172', '\u0173', '\u0174', '\u0175', '\u0176', '\u0177', '\u0178', '\u0179', '\u017a', '\u017b', '\u017c', '\u017d', '\u017e', '\u017f'
// ];

/** List of combining diacritical marks. */
// var comboMarks = [
// 	'\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030a', '\u030b', '\u030c', '\u030d', '\u030e', '\u030f',
// 	'\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317', '\u0318', '\u0319', '\u031a', '\u031b', '\u031c', '\u031d', '\u031e', '\u031f',
// 	'\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f',
// 	'\u0330', '\u0331', '\u0332', '\u0333', '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0339', '\u033a', '\u033b', '\u033c', '\u033d', '\u033e', '\u033f',
// 	'\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0345', '\u0346', '\u0347', '\u0348', '\u0349', '\u034a', '\u034b', '\u034c', '\u034d', '\u034e', '\u034f',
// 	'\u0350', '\u0351', '\u0352', '\u0353', '\u0354', '\u0355', '\u0356', '\u0357', '\u0358', '\u0359', '\u035a', '\u035b', '\u035c', '\u035d', '\u035e', '\u035f',
// 	'\u0360', '\u0361', '\u0362', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f',
// 	'\ufe20', '\ufe21', '\ufe22', '\ufe23'
// ];

/** List of converted Latin Unicode letters. */
// var deburredLetters = [
// 	// Converted Latin-1 Supplement letters.
// 	'A', 'A', 'A', 'A', 'A', 'A', 'Ae', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I',
// 	'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'Th',
// 	'ss', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i',
// 	'i', 'd', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'th', 'y',
// 	// Converted Latin Extended-A letters.
// 	'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c',
// 	'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e',
// 	'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h',
// 	'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j',
// 	'K', 'k', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l',
// 	'N', 'n', 'N', 'n', 'N', 'n', "'n", 'N', 'n',
// 	'O', 'o', 'O', 'o', 'O', 'o', 'Oe', 'oe',
// 	'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's',
// 	'T', 't', 'T', 't', 'T', 't',
// 	'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u',
// 	'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's'
// ];

/** Used to provide falsey values to methods. */
// var falsey = [, null, undefined, false, 0, NaN, ''];

/** Used to specify the emoji style glyph variant of characters. */
// var emojiVar = '\ufe0f';

/** Used to provide empty values to methods. */
// var empties = [[], {}].concat(falsey.slice(1));

/** Used to test error objects. */
var errors = [
	new Error,
	new EvalError,
	new RangeError,
	new ReferenceError,
	new SyntaxError,
	new TypeError,
	new URIError
];

/** List of fitzpatrick modifiers. */
// var fitzModifiers = [
// 	'\ud83c\udffb',
// 	'\ud83c\udffc',
// 	'\ud83c\udffd',
// 	'\ud83c\udffe',
// 	'\ud83c\udfff'
// ];

/** Used to provide primitive values to methods. */
// var primitives = [null, undefined, false, true, 1, NaN, 'a'];

/** Used to check whether methods support typed arrays. */
var typedArrays = [
	'Float32Array',
	'Float64Array',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Uint8Array',
	'Uint8ClampedArray',
	'Uint16Array',
	'Uint32Array'
];

/** Used to check whether methods support array views. */
var arrayViews = typedArrays.concat('DataView');

/** The file path of the lodash file to test. */
// var filePath = (function () {
// 	var min = 2,
// 		result = params || [];

// 	if (phantom) {
// 		min = 0;
// 		result = params = phantom.args || require('system').args;
// 	}
// 	var last = result[result.length - 1];
// 	result = (result.length > min && !/test(?:\.js)?$/.test(last)) ? last : '../lodash.js';

// 	if (!amd) {
// 		try {
// 			result = require('fs').realpathSync(result);
// 		} catch (e) { }

// 		try {
// 			result = require.resolve(result);
// 		} catch (e) { }
// 	}
// 	return result;
// }());

/** The `ui` object. */
// var ui: UiType = root.ui || (root.ui = {
// 	'buildPath': filePath,
// 	'loaderPath': '',
// 	'isModularize': /\b(?:amd|commonjs|es|node|npm|(index|main)\.js)\b/.test(filePath),
// 	'isStrict': /\bes\b/.test(filePath) || 'default' in require(filePath),
// 	'urlParams': {}
// });

/** The basename of the lodash file to test. */
// var basename = /[\w.-]+$/.exec(filePath)[0];

/** Used to indicate testing a modularized build. */
// var isModularize = ui.isModularize;

/** Detect if testing `npm` modules. */
var isNpm = false;

/** Detect if running in PhantomJS. */
// var isPhantom: boolean = false;

/** Detect if lodash is in strict mode. */
// var isStrict = ui.isStrict;

/*--------------------------------------------------------------------------*/

// Leak to avoid sporadic `noglobals` fails on Edge in Sauce Labs.
root.msWDfn = undefined;

// Assign `setTimeout` to itself to avoid being flagged as a leak.
setProperty(root, 'setTimeout', setTimeout);

/*--------------------------------------------------------------------------*/

/** Used to test Web Workers. */
// var Worker = !(ui.isForeign || ui.isSauceLabs || isModularize) &&
// 	(document && document.origin != 'null') && root.Worker;

/** Poison the free variable `root` in Node.js */
try {
	defineProperty(global.root, 'root', {
		'configurable': false,
		'enumerable': false,
		'get': function () { throw new ReferenceError; }
	});
} catch (e) { }

/** The `lodash` function to test. */
// var _ = root._ || (root._ = interopRequire(filePath));

interface MapCachesType {

	Stack?: any;

	ListCache?: any;

	Hash?: any;

	MapCache?: any;

}

/** Used to test pseudo private map caches. */
var mapCaches = (function () {
	var MapCache = (_.memoize || _.memoize).Cache;
	var result: MapCachesType = {
		'Hash': new MapCache()["__data__"].hash.constructor,
		'MapCache': MapCache
	};
	(_.isMatchWith || _.isMatchWith)({ 'a': 1 }, { 'a': 1 }, function (): boolean {
		var stack = _.last(arguments);
		result.ListCache = stack.__data__.constructor;
		result.Stack = stack.constructor;
		return false; // Determine if this is right?
	});
	return result;
}());

/** Used to detect instrumented istanbul code coverage runs. */
// var coverage = root.__coverage__ || root[_.find(_.keys(root), function (key) {
// 	return /^(?:\$\$cov_\d+\$\$)$/.test(key);
// })];

/** Used to test async functions. */
var asyncFunc = _.attempt(function () {
	return Function('return async () => {}');
});

/** Used to test generator functions. */
var genFunc = _.attempt(function () {
	return Function('return function*(){}');
});

/** Used to restore the `_` reference. */
// var oldDash = root._;

/**
 * Used to check for problems removing whitespace. For a whitespace reference,
 * see [V8's unit test](https://code.google.com/p/v8/source/browse/branches/bleeding_edge/test/mjsunit/whitespaces.js).
 */
// var whitespace = _.filter([
// 	// Basic whitespace characters.
// 	' ', '\t', '\x0b', '\f', '\xa0', '\ufeff',

// 	// Line terminators.
// 	'\n', '\r', '\u2028', '\u2029',

// 	// Unicode category "Zs" space separators.
// 	'\u1680', '\u180e', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005',
// 	'\u2006', '\u2007', '\u2008', '\u2009', '\u200a', '\u202f', '\u205f', '\u3000'
// ],
// 	function (chr) { return /\s/.exec(chr); })
// 	.join('');

function CustomError(message: string) {
	this.name = 'CustomError';
	this.message = message;
}

CustomError.prototype = _.create(Error.prototype, {
	'constructor': CustomError
});

// function emptyObject(object) {
// 	_.forOwn(object, function (value, key, object) {
// 		delete object[key];
// 	});
// }

// function getUnwrappedValue(wrapper) {
// 	var index = -1,
// 		actions = wrapper.__actions__,
// 		length = actions.length,
// 		result = wrapper.__wrapped__;

// 	while (++index < length) {
// 		var args = [result],
// 			action = actions[index];

// 		push.apply(args, action.args);
// 		result = action.func.apply(action.thisArg, args);
// 	}
// 	return result;
// }

// function interopRequire(id) {
// 	var result = require(id);
// 	return 'default' in result ? result['default'] : result;
// }

function setProperty(object: any, key: string, value: any) {
	try {
		defineProperty(object, key, {
			'configurable': true,
			'enumerable': false,
			'writable': true,
			'value': value
		});
	} catch (e) {
		object[key] = value;
	}
	return object;
}

function toArgs(array: any) {
	return (function () { return arguments; }.apply(undefined, array));
}


// Add a web worker.
// _.attempt(function () {
// 	var worker = new Worker('./asset/worker.js?t=' + (+new Date));
// 	worker.addEventListener('message', function (e) {
// 		_["_VERSION"] = e.data || '';
// 	}, false);

// 	worker.postMessage(ui.buildPath);
// });

// Expose internal modules for better code coverage.
// _.attempt(function () {
// 	var path = require('path'),
// 		basePath = path.dirname(filePath);

// 	if (isModularize && !(amd || isNpm)) {
// 		_.each([
// 			'baseEach',
// 			'isIndex',
// 			'isIterateeCall',
// 			'memoizeCapped'
// 		], function (funcName) {
// 			_['_' + funcName] = interopRequire(path.join(basePath, '_' + funcName));
// 		});
// 	}
// });

describe("clone methods", () => {

	function Foo() {
		this.a = 1;
	}
	Foo.prototype.b = 1;
	Foo.c = function () { };

	if (Map) {
		var map = new Map;
		map.set('a', 1);
		map.set('b', 2);
	}
	if (Set) {
		var set = new Set;
		set.add(1);
		set.add(2);
	}
	var objects = {
		'arrays': ['a', ''],
		'array-like objects': { '0': 'a', 'length': 1 },
		'booleans': false,
		'boolean objects': Object(false),
		'date objects': new Date,
		'Foo instances': new Foo,
		'objects': { 'a': 0, 'b': 1, 'c': 2 },
		'objects with object values': { 'a': /a/, 'b': ['B'], 'c': { 'C': 1 } },
		'objects from another document': {},
		'maps': map,
		'null values': null,
		'numbers': 0,
		'number objects': Object(0),
		'regexes': /a/gim,
		'sets': set,
		'strings': 'a',
		'string objects': Object('a'),
		'undefined values': undefined
	};

	objects.arrays.length = 3;

	var uncloneable = {
		'DOM elements': body,
		'functions': Foo,
		'async functions': asyncFunc,
		'generator functions': genFunc,
		'the `Proxy` constructor': Proxy
	};

	_.each(errors, function (error) {
		uncloneable[error.name + 's'] = error;
	});

	it('`_.clone` should perform a shallow clone', () => {
		var array = [{ 'a': 0 }, { 'b': 1 }],
			actual = _.clone(array);

		assert.deepEqual(actual, array);
		assert.ok(actual !== array && actual[0] === array[0]);
	});

	it('`_.cloneDeep` should deep clone objects with circular references', () => {
		var object: any = {
			'foo': { 'b': { 'c': { 'd': {} } } },
			'bar': {}
		};

		object.foo.b.c.d = object;
		object.bar.b = object.foo.b;

		var actual = _.cloneDeep(object);
		assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object);
	});

	it('`_.cloneDeep` should deep clone objects with lots of circular references', () => {
		var cyclical = {};
		_.times(LARGE_ARRAY_SIZE + 1, function (index) {
			cyclical['v' + index] = [index ? cyclical['v' + (index - 1)] : cyclical];
		});

		var clone = _.cloneDeep(cyclical),
			actual = clone['v' + LARGE_ARRAY_SIZE][0];

		assert.strictEqual(actual, clone['v' + (LARGE_ARRAY_SIZE - 1)]);
		assert.notStrictEqual(actual, cyclical['v' + (LARGE_ARRAY_SIZE - 1)]);
	});

	it('`_.cloneDeepWith` should provide `stack` to `customizer`', () => {
		var actual: any;

		_.cloneDeepWith({ 'a': 1 }, function () {
			actual = _.last(arguments);
		});

		assert.ok(isNpm
			? actual.constructor.name == 'Stack'
			: actual instanceof mapCaches.Stack
		);
	});

	_.forOwn(objects, function (object, kind) {
		it('`_.cloneDeep` should clone ' + kind, () => {
			var actual = _.cloneDeep(object);
			assert.ok(_.isEqual(actual, object));

			if (_.isObject(object)) {
				assert.notStrictEqual(actual, object);
			} else {
				assert.strictEqual(actual, object);
			}
		});
	});

	it('`_.cloneDeep` should clone array buffers', () => {
		if (ArrayBuffer) {
			var actual = _.cloneDeep(arrayBuffer);
			assert.strictEqual(actual.byteLength, arrayBuffer.byteLength);
			assert.notStrictEqual(actual, arrayBuffer);
		}
	});

	it('`_.cloneDeep` should clone buffers', () => {
		if (Buffer) {
			var buffer = new Buffer([1, 2]),
				actual = _.cloneDeep(buffer);

			assert.strictEqual(actual.byteLength, buffer.byteLength);
			assert.strictEqual(actual.inspect(), buffer.inspect());
			assert.notStrictEqual(actual, buffer);

			buffer[0] = 2;
			assert.strictEqual(actual[0], 2);
		}
	});

	it('`_.cloneDeep` should clone `index` and `input` array properties', () => {
		var array = /c/.exec('abcde'),
			actual = _.cloneDeep(array);

		assert.strictEqual(actual.index, 2);
		assert.strictEqual(actual.input, 'abcde');
	});

	it('`_.cloneDeep` should clone `lastIndex` regexp property', () => {
		var regexp = /c/g;
		regexp.exec('abcde');

		assert.strictEqual(_.cloneDeep(regexp).lastIndex, 3);
	});

	it('`_.cloneDeep` should clone expando properties', () => {
		var values = _.map([false, true, 1, 'a'], function (value) {
			var object = Object(value);
			object.a = 1;
			return object;
		});

		var expected = _.map(values, stubTrue);

		var actual = _.map(values, function (value) {
			return _.cloneDeep(value).a === 1;
		});

		assert.deepEqual(actual, expected);
	});

	it('`_.cloneDeep` should clone prototype objects', () => {
		var actual = _.cloneDeep(Foo.prototype);

		assert.notOk(actual instanceof Foo);
		assert.deepEqual(actual, { 'b': 1 });
	});

	it('`_.cloneDeep` should set the `[[Prototype]]` of a clone', () => {
		assert.ok(_.cloneDeep(new Foo) instanceof Foo);
	});

	it('`_.cloneDeep` should set the `[[Prototype]]` of a clone even when the `constructor` is incorrect', () => {
		Foo.prototype.constructor = Object;
		assert.ok(_.cloneDeep(new Foo) instanceof Foo);
		Foo.prototype.constructor = Foo;
	});

	it('`_.cloneDeep` should ensure `value` constructor is a function before using its `[[Prototype]]`', () => {
		Foo.prototype.constructor = null;
		assert.notOk(_.cloneDeep(new Foo) instanceof Foo);
		Foo.prototype.constructor = Foo;
	});

	it('`_.cloneDeep` should clone properties that shadow those on `Object.prototype`', () => {
		var object = {
			'constructor': objectProto.constructor,
			'hasOwnProperty': objectProto.hasOwnProperty,
			'isPrototypeOf': objectProto.isPrototypeOf,
			'propertyIsEnumerable': objectProto.propertyIsEnumerable,
			'toLocaleString': objectProto.toLocaleString,
			'toString': objectProto.toString,
			'valueOf': objectProto.valueOf
		};

		var actual = _.cloneDeep(object);

		assert.deepEqual(actual, object);
		assert.notStrictEqual(actual, object);
	});

	it('`_.cloneDeep` should clone symbol properties', () => {
		function Foo() {
			this[symbol] = { 'c': 1 };
		}

		if (Symbol) {
			var symbol2 = Symbol('b');
			Foo.prototype[symbol2] = 2;

			var symbol3 = Symbol('c');
			defineProperty(Foo.prototype, symbol3, {
				'configurable': true,
				'enumerable': false,
				'writable': true,
				'value': 3
			});

			var object = { 'a': { 'b': new Foo } };
			object[symbol] = { 'b': 1 };

			var actual = _.cloneDeep(object);
				assert.notStrictEqual(actual[symbol], object[symbol]);
				assert.notStrictEqual(actual.a, object.a);

			assert.deepEqual(actual[symbol], object[symbol]);
			assert.deepEqual(getSymbols(actual.a.b), [symbol]);
			assert.deepEqual(actual.a.b[symbol], object.a.b[symbol]);
			assert.deepEqual(actual.a.b[symbol2], object.a.b[symbol2]);
			assert.deepEqual(actual.a.b[symbol3], object.a.b[symbol3]);
		}
	});

	it('`_.cloneDeep` should clone symbol objects', () => {
		if (Symbol) {
			assert.strictEqual(_.cloneDeep(symbol), symbol);

			var object = Object(symbol),
				actual = _.cloneDeep(object);

			assert.strictEqual(typeof actual, 'object');
			assert.strictEqual(typeof actual.valueOf(), 'symbol');
			assert.notStrictEqual(actual, object);
		}
	});

	it('`_.cloneDeep` should not clone symbol primitives', () => {
		if (Symbol) {
			assert.strictEqual(_.cloneDeep(symbol), symbol);
		}
	});

	it('`_.cloneDeep` should not error on DOM elements', () => {
		if (document) {
			var element = document.createElement('div');

			try {
				assert.deepEqual(_.cloneDeep(element), {} as HTMLDivElement);
			} catch (e) {
				assert.ok(false, e.message);
			}
		}
	});

	it('`_.cloneDeep` should create an object from the same realm as `value`', () => {
		var props = [];

		const ldTemp: any = _;

		var objects = _.transform(ldTemp, function (result, value, key: any) {
			if (_.startsWith(key, '_') && _.isObject(value) &&
				!_.isArguments(value) && !_.isElement(value) &&
				!_.isFunction(value)) {
				props.push(_.capitalize(_.camelCase(key)));
				result.push(value);
			}
		}, []);

		var expected = _.map(objects, stubTrue);

		var actual = _.map(objects, function (object) {
			var Ctor = object.constructor;
			var result = _.cloneDeep(object);

			return result !== object && ((result instanceof Ctor) || !(new Ctor instanceof Ctor));
		});

		assert.deepEqual(actual, expected, props.join(', '));
	});

	it('`_.cloneDeep` should perform a deep clone when used as an iteratee for methods like `_.map`', () => {
		var expected = [{ 'a': [0] }, { 'b': [1] }],
			actual = _.map(expected, _.cloneDeep);

		assert.deepEqual(actual, expected);
		assert.ok(actual[0] !== expected[0] && actual[0].a !== expected[0].a && actual[1].b !== expected[1].b);
	});

	it('`_.cloneDeep` should return a unwrapped value when chaining', () => {
		if (!isNpm) {
			var object = objects.objects,
				actual = _(object)["cloneDeep"]();

			assert.deepEqual(actual, object);
			assert.notStrictEqual(actual, object);
		}
	});

	_.each(arrayViews, function (type) {
		it('`_.cloneDeep` should clone ' + type + ' values', () => {
			var Ctor = root[type];

			_.times(2, function (index) {
				if (Ctor) {
					var buffer = new ArrayBuffer(24),
						view = index ? new Ctor(buffer, 8, 1) : new Ctor(buffer),
						actual = _.cloneDeep(view);

					assert.deepEqual(actual, view);
					assert.notStrictEqual(actual, view);
					assert.strictEqual(actual.buffer === view.buffer, false);
					assert.strictEqual(actual.byteOffset, view.byteOffset);
					assert.strictEqual(actual.length, view.length);
				}
			});
		});
	});

	_.forOwn(uncloneable, function (value, key) {
		it('`_.cloneDeep` should not clone ' + key, () => {
			if (value) {
				var object = { 'a': value, 'b': { 'c': value } },
					actual = _.cloneDeep(object),
					expected = value === Foo ? { 'c': Foo.c } : {};

				assert.deepEqual(actual, object);
				assert.notStrictEqual(actual, object);
				assert.deepEqual(_.cloneDeep(value), expected);
			}
		});
	});

	_.each(['cloneWith', 'cloneDeepWith'], function (methodName) {
		var func = _[methodName],
			isDeep = methodName == 'cloneDeepWith';

		it('`_.' + methodName + '` should provide correct `customizer` arguments', () => {
			var argsList = [],
				object = new Foo;

			func(object, function () {
				var length = arguments.length,
					args = slice.call(arguments, 0, length - (length > 1 ? 1 : 0));

				argsList.push(args);
			});

			assert.deepEqual(argsList, isDeep ? [[object], [1, 'a', object]] : [[object]]);
		});

		it('`_.' + methodName + '` should handle cloning when `customizer` returns `undefined`', () => {
			var actual = func({ 'a': { 'b': 'c' } }, noop);
			assert.deepEqual(actual, { 'a': { 'b': 'c' } });
		});

		_.forOwn(uncloneable, function (value, key) {
			it('`_.' + methodName + '` should work with a `customizer` callback and ' + key, () => {
				var customizer = function (value: any) {
					return _.isPlainObject(value) ? undefined : value;
				};

				var actual = func(value, customizer);
				assert.strictEqual(actual, value);

				var object = { 'a': value, 'b': { 'c': value } };
				actual = func(object, customizer);

				assert.deepEqual(actual, object);
				assert.notStrictEqual(actual, object);
			});
		});
	});
});


describe("lodash.isEqual", () => {

	var symbol1 = Symbol ? Symbol('a') : true,
		symbol2 = Symbol ? Symbol('b') : false;

	it('should compare primitives', () => {
		var pairs = [
			[1, 1, true], [1, Object(1), true], [1, '1', false], [1, 2, false],
			[-0, -0, true], [0, 0, true], [0, Object(0), true], [Object(0), Object(0), true], [-0, 0, true], [0, '0', false], [0, null, false],
			[NaN, NaN, true], [NaN, Object(NaN), true], [Object(NaN), Object(NaN), true], [NaN, 'a', false], [NaN, Infinity, false],
			['a', 'a', true], ['a', Object('a'), true], [Object('a'), Object('a'), true], ['a', 'b', false], ['a', ['a'], false],
			[true, true, true], [true, Object(true), true], [Object(true), Object(true), true], [true, 1, false], [true, 'a', false],
			[false, false, true], [false, Object(false), true], [Object(false), Object(false), true], [false, 0, false], [false, '', false],
			[symbol1, symbol1, true], [symbol1, Object(symbol1), true], [Object(symbol1), Object(symbol1), true], [symbol1, symbol2, false],
			[null, null, true], [null, undefined, false], [null, {}, false], [null, '', false],
			[undefined, undefined, true], [undefined, null, false], [undefined, '', false]
		];

		var expected = _.map(pairs, function (pair) {
			return pair[2];
		});

		var actual = _.map(pairs, function (pair) {
			return _.isEqual(pair[0], pair[1]);
		});

		assert.deepEqual(actual, expected);
	});

	it('should compare arrays', () => {
		var array1: any = [true, null, 1, 'a', undefined],
			array2: any = [true, null, 1, 'a', undefined];

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { 'e': 1 }];
		array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { 'e': 1 }];

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = [1];
		array1[2] = 3;

		array2 = [1];
		array2[1] = undefined;
		array2[2] = 3;

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = [Object(1), false, Object('a'), /x/, new Date(2012, 4, 23), ['a', 'b', [Object('c')]], { 'a': 1 }];
		array2 = [1, Object(false), 'a', /x/, new Date(2012, 4, 23), ['a', Object('b'), ['c']], { 'a': 1 }];

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = [1, 2, 3];
		array2 = [3, 2, 1];

		assert.strictEqual(_.isEqual(array1, array2), false);

		array1 = [1, 2];
		array2 = [1, 2, 3];

		assert.strictEqual(_.isEqual(array1, array2), false);
	});

	it('should treat arrays with identical values but different non-index properties as equal', () => {
		var array1: any = [1, 2, 3],
			array2: any = [1, 2, 3];

		array1.every = array1.filter = array1.forEach =
			array1.indexOf = array1.lastIndexOf = array1.map =
			array1.some = array1.reduce = array1.reduceRight = null;

		array2.concat = array2.join = array2.pop =
			array2.reverse = array2.shift = array2.slice =
			array2.sort = array2.splice = array2.unshift = null;

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = [1, 2, 3];
		array1.a = 1;

		array2 = [1, 2, 3];
		array2.b = 1;

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1 = /c/.exec('abcde');
		array2 = ['c'];

		assert.strictEqual(_.isEqual(array1, array2), true);
	});

	it('should compare sparse arrays', () => {
		var array = Array(1);

		assert.strictEqual(_.isEqual(array, Array(1)), true);
		assert.strictEqual(_.isEqual(array, [undefined]), true);
		assert.strictEqual(_.isEqual(array, Array(2)), false);
	});

	it('should compare plain objects', () => {
		var object1: any = { 'a': true, 'b': null, 'c': 1, 'd': 'a', 'e': undefined },
			object2: any = { 'a': true, 'b': null, 'c': 1, 'd': 'a', 'e': undefined };

		assert.strictEqual(_.isEqual(object1, object2), true);

		object1 = { 'a': [1, 2, 3], 'b': new Date(2012, 4, 23), 'c': /x/, 'd': { 'e': 1 } };
		object2 = { 'a': [1, 2, 3], 'b': new Date(2012, 4, 23), 'c': /x/, 'd': { 'e': 1 } };

		assert.strictEqual(_.isEqual(object1, object2), true);

		object1 = { 'a': 1, 'b': 2, 'c': 3 };
		object2 = { 'a': 3, 'b': 2, 'c': 1 };

		assert.strictEqual(_.isEqual(object1, object2), false);

		object1 = { 'a': 1, 'b': 2, 'c': 3 };
		object2 = { 'd': 1, 'e': 2, 'f': 3 };

		assert.strictEqual(_.isEqual(object1, object2), false);

		object1 = { 'a': 1, 'b': 2 };
		object2 = { 'a': 1, 'b': 2, 'c': 3 };

		assert.strictEqual(_.isEqual(object1, object2), false);
	});

	it('should compare objects regardless of key order', () => {
		var object1 = { 'a': 1, 'b': 2, 'c': 3 },
			object2 = { 'c': 3, 'a': 1, 'b': 2 };

		assert.strictEqual(_.isEqual(object1, object2), true);
	});

	it('should compare nested objects', () => {
		var object1 = {
			'a': [1, 2, 3],
			'b': true,
			'c': Object(1),
			'd': 'a',
			'e': {
				'f': ['a', Object('b'), 'c'],
				'g': Object(false),
				'h': new Date(2012, 4, 23),
				'i': noop,
				'j': 'a'
			}
		};

		var object2 = {
			'a': [1, Object(2), 3],
			'b': Object(true),
			'c': 1,
			'd': Object('a'),
			'e': {
				'f': ['a', 'b', 'c'],
				'g': false,
				'h': new Date(2012, 4, 23),
				'i': noop,
				'j': 'a'
			}
		};

		assert.strictEqual(_.isEqual(object1, object2), true);
	});

	it('should compare object instances', () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.a = 1;

		function Bar() {
			this.a = 1;
		}
		Bar.prototype.a = 2;

		assert.strictEqual(_.isEqual(new Foo, new Foo), true);
		assert.strictEqual(_.isEqual(new Foo, new Bar), false);
		assert.strictEqual(_.isEqual({ 'a': 1 }, new Foo), false);
		assert.strictEqual(_.isEqual({ 'a': 2 }, new Bar), false);
	});

	it('should compare objects with constructor properties', () => {
		assert.strictEqual(_.isEqual({ 'constructor': 1 }, { 'constructor': 1 }), true);
		assert.strictEqual(_.isEqual({ 'constructor': 1 }, { 'constructor': '1' }), false);
		assert.strictEqual(_.isEqual({ 'constructor': [1] }, { 'constructor': [1] }), true);
		assert.strictEqual(_.isEqual({ 'constructor': [1] }, { 'constructor': ['1'] }), false);
		assert.strictEqual(_.isEqual({ 'constructor': Object }, {}), false);
	});

	it('should compare arrays with circular references', () => {
		var array1 = [],
			array2 = [];

		array1.push(array1);
		array2.push(array2);

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1.push('b');
		array2.push('b');

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1.push('c');
		array2.push('d');

		assert.strictEqual(_.isEqual(array1, array2), false);

		array1 = ['a', 'b', 'c'];
		array1[1] = array1;
		array2 = ['a', ['a', 'b', 'c'], 'c'];

		assert.strictEqual(_.isEqual(array1, array2), false);
	});

	it('should have transitive equivalence for circular references of arrays', () => {
		var array1 = [],
			array2 = [array1],
			array3 = [array2];

		array1[0] = array1;

		assert.strictEqual(_.isEqual(array1, array2), true);
		assert.strictEqual(_.isEqual(array2, array3), true);
		assert.strictEqual(_.isEqual(array1, array3), true);
	});

	it('should compare objects with circular references', () => {
		var object1: any = {},
			object2: any = {};

		object1.a = object1;
		object2.a = object2;

		assert.strictEqual(_.isEqual(object1, object2), true);

		object1.b = 0;
		object2.b = Object(0);

		assert.strictEqual(_.isEqual(object1, object2), true);

		object1.c = Object(1);
		object2.c = Object(2);

		assert.strictEqual(_.isEqual(object1, object2), false);

		object1 = { 'a': 1, 'b': 2, 'c': 3 };
		object1.b = object1;
		object2 = { 'a': 1, 'b': { 'a': 1, 'b': 2, 'c': 3 }, 'c': 3 };

		assert.strictEqual(_.isEqual(object1, object2), false);
	});

	it('should have transitive equivalence for circular references of objects', () => {
		var object1: any = {},
			object2: any = { 'a': object1 },
			object3: any = { 'a': object2 };

		object1.a = object1;

		assert.strictEqual(_.isEqual(object1, object2), true);
		assert.strictEqual(_.isEqual(object2, object3), true);
		assert.strictEqual(_.isEqual(object1, object3), true);
	});

	it('should compare objects with multiple circular references', () => {
		var array1: any = [{}],
			array2: any = [{}];

		(array1[0].a = array1).push(array1);
		(array2[0].a = array2).push(array2);

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1[0].b = 0;
		array2[0].b = Object(0);

		assert.strictEqual(_.isEqual(array1, array2), true);

		array1[0].c = Object(1);
		array2[0].c = Object(2);

		assert.strictEqual(_.isEqual(array1, array2), false);
	});

	it('should compare objects with complex circular references', () => {
		var object1: any = {
			'foo': { 'b': { 'c': { 'd': {} } } },
			'bar': { 'a': 2 }
		};

		var object2: any = {
			'foo': { 'b': { 'c': { 'd': {} } } },
			'bar': { 'a': 2 }
		};

		object1.foo.b.c.d = object1;
		object1.bar.b = object1.foo.b;

		object2.foo.b.c.d = object2;
		object2.bar.b = object2.foo.b;

		assert.strictEqual(_.isEqual(object1, object2), true);
	});

	it('should compare objects with shared property values', () => {
		var object1: any = {
			'a': [1, 2]
		};

		var object2: any = {
			'a': [1, 2],
			'b': [1, 2]
		};

		object1.b = object1.a;

		assert.strictEqual(_.isEqual(object1, object2), true);
	});

	it('should treat objects created by `Object.create(null)` like plain objects', () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.constructor = null;

		var object1 = create(null);
		object1.a = 1;

		var object2 = { 'a': 1 };

		assert.strictEqual(_.isEqual(object1, object2), true);
		assert.strictEqual(_.isEqual(new Foo, object2), false);
	});

	it('should avoid common type coercions', () => {
		assert.strictEqual(_.isEqual(true, Object(false)), false);
		assert.strictEqual(_.isEqual(Object(false), Object(0)), false);
		assert.strictEqual(_.isEqual(false, Object('')), false);
		assert.strictEqual(_.isEqual(Object(36), Object('36')), false);
		assert.strictEqual(_.isEqual(0, ''), false);
		assert.strictEqual(_.isEqual(1, true), false);
		assert.strictEqual(_.isEqual(1337756400000, new Date(2012, 4, 23)), false);
		assert.strictEqual(_.isEqual('36', 36), false);
		assert.strictEqual(_.isEqual(36, '36'), false);
	});

	it('should compare `arguments` objects', () => {
		var args1 = (function () { return arguments; }()),
			args2 = (function () { return arguments; }()),
			args3 = (function (...args: any) { if (args || true) return arguments; } (1, 2));

		assert.strictEqual(_.isEqual(args1, args2), true);
		assert.strictEqual(_.isEqual(args1, args3), false);
	});

	it('should treat `arguments` objects like `Object` objects', () => {
		var object = { '0': 1, '1': 2, '2': 3 };

		function Foo() { }
		Foo.prototype = object;

		assert.strictEqual(_.isEqual(args, object), true);
		assert.strictEqual(_.isEqual(object, args), true);
		assert.strictEqual(_.isEqual(args, new Foo), false);
		assert.strictEqual(_.isEqual(new Foo, args), false);
	});

	it('should compare array buffers', () => {
		if (ArrayBuffer) {
			var buffer = new Int8Array([-1]).buffer;

			assert.strictEqual(_.isEqual(buffer, new Uint8Array([255]).buffer), true);
			assert.strictEqual(_.isEqual(buffer, new ArrayBuffer(1)), false);
		}
	});

	it('should compare array views', () => {
		var ns: RootType = root;

		var pairs = _.map(arrayViews, function (type, viewIndex) {
			var otherType = arrayViews[(viewIndex + 1) % arrayViews.length],
				CtorA = ns[type] || function (n: any) { this.n = n; },
				CtorB = ns[otherType] || function (n: any) { this.n = n; },
				bufferA = ns[type] ? new ns.ArrayBuffer(8) : 8,
				bufferB = ns[otherType] ? new ns.ArrayBuffer(8) : 8,
				bufferC = ns[otherType] ? new ns.ArrayBuffer(16) : 16;

			return [new CtorA(bufferA), new CtorA(bufferA), new CtorB(bufferB), new CtorB(bufferC)];
		});

		var expected = _.map(pairs, _.constant([true, false, false]));

		var actual = _.map(pairs, function (pair) {
			return [_.isEqual(pair[0], pair[1]), _.isEqual(pair[0], pair[2]), _.isEqual(pair[2], pair[3])];
		});

		assert.deepEqual(actual, expected);
	});

	it('should compare buffers', () => {
		if (Buffer) {
			var buffer = new Buffer([1]);

			assert.strictEqual(_.isEqual(buffer, new Buffer([1])), true);
			assert.strictEqual(_.isEqual(buffer, new Buffer([2])), false);
			assert.strictEqual(_.isEqual(buffer, new Uint8Array([1])), false);
		}
	});

	it('should compare date objects', () => {
		var date = new Date(2012, 4, 23);

		assert.strictEqual(_.isEqual(date, new Date(2012, 4, 23)), true);
		assert.strictEqual(_.isEqual(new Date('a'), new Date('b')), true);
		assert.strictEqual(_.isEqual(date, new Date(2013, 3, 25)), false);
		assert.strictEqual(_.isEqual(date, { 'getTime': _.constant(+date) }), false);
	});

	it('should compare error objects', () => {
		var pairs = _.map([
			'Error',
			'EvalError',
			'RangeError',
			'ReferenceError',
			'SyntaxError',
			'TypeError',
			'URIError'
		], function (type, index, errorTypes) {
			var otherType = errorTypes[++index % errorTypes.length],
				CtorA = root[type],
				CtorB = root[otherType];

			return [new CtorA('a'), new CtorA('a'), new CtorB('a'), new CtorB('b')];
		});

		var expected = _.map(pairs, _.constant([true, false, false]));

		var actual = _.map(pairs, function (pair) {
			return [_.isEqual(pair[0], pair[1]), _.isEqual(pair[0], pair[2]), _.isEqual(pair[2], pair[3])];
		});

		assert.deepEqual(actual, expected);
	});

	it('should compare functions', () => {
		function a() { return 1 + 2; }
		function b() { return 1 + 2; }

		assert.strictEqual(_.isEqual(a, a), true);
		assert.strictEqual(_.isEqual(a, b), false);
	});

	it('should compare maps', () => {
		if (Map) {
			_.each([[map, new Map]], function (maps) {
				var map1 = maps[0],
					map2 = maps[1];

				map1.set('a', 1);
				map2.set('b', 2);
				assert.strictEqual(_.isEqual(map1, map2), false);

				map1.set('b', 2);
				map2.set('a', 1);
				assert.strictEqual(_.isEqual(map1, map2), true);

				map1.delete('a');
				map1.set('a', 1);
				assert.strictEqual(_.isEqual(map1, map2), true);

				map2.delete('a');
				assert.strictEqual(_.isEqual(map1, map2), false);

				map1.clear();
				map2.clear();
			});
		}
	});

	it('should compare maps with circular references', () => {
		if (Map) {
			var map1 = new Map,
				map2 = new Map;

			map1.set('a', map1);
			map2.set('a', map2);
			assert.strictEqual(_.isEqual(map1, map2), true);

			map1.set('b', 1);
			map2.set('b', 2);
			assert.strictEqual(_.isEqual(map1, map2), false);
		}
	});

	it('should compare promises by reference', () => {
		if (promise) {
			_.each([[promise, Promise.resolve(1)], [promise]], function (promises) {
				var promise1 = promises[0],
					promise2 = promises[1];

				assert.strictEqual(_.isEqual(promise1, promise2), false);
				assert.strictEqual(_.isEqual(promise1, promise1), true);
			});
		}
	});

	it('should compare regexes', () => {
		assert.strictEqual(_.isEqual(/x/gim, /x/gim), true);
		assert.strictEqual(_.isEqual(/x/gim, /x/mgi), true);
		assert.strictEqual(_.isEqual(/x/gi, /x/g), false);
		assert.strictEqual(_.isEqual(/x/, /y/), false);
		assert.strictEqual(_.isEqual(/x/g, { 'global': true, 'ignoreCase': false, 'multiline': false, 'source': 'x' }), false);
	});

	it('should compare sets', () => {
		if (Set) {
			const set1 = set;
			const set2 = new Set();

			set1.add(1);
			set2.add(2);
			assert.strictEqual(_.isEqual(set1, set2), false);

			set1.add(2);
			set2.add(1);
			assert.strictEqual(_.isEqual(set1, set2), true);

			set1.delete(1);
			set1.add(1);
			assert.strictEqual(_.isEqual(set1, set2), true);

			set2.delete(1);
			assert.strictEqual(_.isEqual(set1, set2), false);

			set1.clear();
			set2.clear();
		}
	});

	it('should compare sets with circular references', () => {
		if (Set) {
			var set1 = new Set,
				set2 = new Set;

			set1.add(set1);
			set2.add(set2);
			assert.strictEqual(_.isEqual(set1, set2), true);

			set1.add(1);
			set2.add(2);
			assert.strictEqual(_.isEqual(set1, set2), false);
		}
	});

	it('should compare symbol properties', () => {
		if (Symbol) {
			var object1 = { 'a': 1 },
				object2 = { 'a': 1 };

			object1[symbol1] = { 'a': { 'b': 2 } };
			object2[symbol1] = { 'a': { 'b': 2 } };

			defineProperty(object2, symbol2, {
				'configurable': true,
				'enumerable': false,
				'writable': true,
				'value': 2
			});

			assert.strictEqual(_.isEqual(object1, object2), true);

			object2[symbol1] = { 'a': 1 };
			assert.strictEqual(_.isEqual(object1, object2), false);

			delete object2[symbol1];
			object2[Symbol('a')] = { 'a': { 'b': 2 } };
			assert.strictEqual(_.isEqual(object1, object2), false);
		}
	});

	it('should compare wrapped values', () => {
		var stamp = +new Date;

		var values = [
			[[1, 2], [1, 2], [1, 2, 3]],
			[true, true, false],
			[new Date(stamp), new Date(stamp), new Date(stamp - 100)],
			[{ 'a': 1, 'b': 2 }, { 'a': 1, 'b': 2 }, { 'a': 1, 'b': 1 }],
			[1, 1, 2],
			[NaN, NaN, Infinity],
			[/x/, /x/, /x/i],
			['a', 'a', 'A']
		];

		_.each(values, function (vals) {
			if (!isNpm) {
				var wrapped1 = _(vals[0]),
					wrapped2 = _(vals[1]),
					actual = wrapped1.isEqual(wrapped2);

				assert.strictEqual(actual, true);
				assert.strictEqual(_.isEqual(_(actual), _(true)), true);

				wrapped1 = _(vals[0]);
				wrapped2 = _(vals[2]);

				actual = wrapped1.isEqual(wrapped2);
				assert.strictEqual(actual, false);
				assert.strictEqual(_.isEqual(_(actual), _(false)), true);
			}
		});
	});

	it('should compare wrapped and non-wrapped values', () => {
		if (!isNpm) {
			var object1 = _({ 'a': 1, 'b': 2 }),
				object2 = { 'a': 1, 'b': 2 };

			assert.strictEqual(object1.isEqual(object2), true);
			assert.strictEqual(_.isEqual(object1, object2), true);

			object1 = _({ 'a': 1, 'b': 2 });
			object2 = { 'a': 1, 'b': 1 };

			assert.strictEqual(object1.isEqual(object2), false);
			assert.strictEqual(_.isEqual(object1, object2), false);
		}
	});

	it('should work as an iteratee for `_.every`', () => {
		var actual = _.every([1, 1, 1], _.partial(_.isEqual, 1));
		assert.ok(actual);
	});

	it('should not error on DOM elements', () => {
		if (document) {
			var element1 = document.createElement('div'),
				element2 = element1.cloneNode(true);

			try {
				assert.strictEqual(_.isEqual(element1, element2), false);
			} catch (e) {
				assert.ok(false, e.message);
			}
		}
	});

	it('should return `false` for objects with custom `toString` methods', () => {
		var primitive: any,
			object = { 'toString': function () { return primitive; } },
			values = [true, null, 1, 'a', undefined],
			expected = _.map(values, stubFalse);

		var actual = _.map(values, function (value) {
			primitive = value;
			return _.isEqual(object, value);
		});

		assert.deepEqual(actual, expected);
	});

	it('should return an unwrapped value when implicitly chaining', () => {
		if (!isNpm) {
			assert.strictEqual(_('a').isEqual('a'), true);
		}
	});

	it('should return a wrapped value when explicitly chaining', () => {
		if (!isNpm) {
			assert.ok(_('a').chain().isEqual('a') instanceof _);
		}
	});
});

