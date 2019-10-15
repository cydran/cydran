import {assert} from "chai";
import {describe, it} from "mocha";
import ObjectUtils from "./ObjectUtils";

describe("ObjectUtils tests", () => {

	it("it works", () => {
		assert.isTrue(ObjectUtils.deepEquals(1, 1));
		assert.isNotNull({}, "is null");
	});

});


// ;(function() {

//   /** Used as a safe reference for `undefined` in pre-ES5 environments. */
//   var undefined;

//   /** Used to detect when a function becomes hot. */
//   var HOT_COUNT = 150;

//   /** Used as the size to cover large array optimizations. */
//   var LARGE_ARRAY_SIZE = 200;

//   /** Used as the `TypeError` message for "Functions" methods. */
//   var FUNC_ERROR_TEXT = 'Expected a function';

//   /** Used as the maximum memoize cache size. */
//   var MAX_MEMOIZE_SIZE = 500;

//   /** Used as references for various `Number` constants. */
//   var MAX_SAFE_INTEGER = 9007199254740991,
//       MAX_INTEGER = 1.7976931348623157e+308;

//   /** Used as references for the maximum length and index of an array. */
//   var MAX_ARRAY_LENGTH = 4294967295,
//       MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

//   /** `Object#toString` result references. */
//   var funcTag = '[object Function]',
//       numberTag = '[object Number]',
//       objectTag = '[object Object]';

//   /** Used as a reference to the global object. */
//   var root = (typeof global == 'object' && global) || this;

//   /** Used to store lodash to test for bad extensions/shims. */
//   var lodashBizarro = root.lodashBizarro;

//   /** Used for native method references. */
//   var arrayProto = Array.prototype,
//       funcProto = Function.prototype,
//       objectProto = Object.prototype,
//       numberProto = Number.prototype,
//       stringProto = String.prototype;

//   /** Method and object shortcuts. */
//   var phantom = root.phantom,
//       process = root.process,
//       amd = root.define ? define.amd : undefined,
//       args = toArgs([1, 2, 3]),
//       argv = process ? process.argv : undefined,
//       defineProperty = Object.defineProperty,
//       document = phantom ? undefined : root.document,
//       body = root.document ? root.document.body : undefined,
//       create = Object.create,
//       fnToString = funcProto.toString,
//       freeze = Object.freeze,
//       getSymbols = Object.getOwnPropertySymbols,
//       identity = function(value) { return value; },
//       noop = function() {},
//       objToString = objectProto.toString,
//       params = argv,
//       push = arrayProto.push,
//       realm = {},
//       slice = arrayProto.slice,
//       strictArgs = (function() { 'use strict'; return arguments; }(1, 2, 3));

//   var ArrayBuffer = root.ArrayBuffer,
//       Buffer = root.Buffer,
//       Map = root.Map,
//       Promise = root.Promise,
//       Proxy = root.Proxy,
//       Set = root.Set,
//       Symbol = root.Symbol,
//       Uint8Array = root.Uint8Array,
//       WeakMap = root.WeakMap,
//       WeakSet = root.WeakSet;

//   var arrayBuffer = ArrayBuffer ? new ArrayBuffer(2) : undefined,
//       map = Map ? new Map : undefined,
//       promise = Promise ? Promise.resolve(1) : undefined,
//       set = Set ? new Set : undefined,
//       symbol = Symbol ? Symbol('a') : undefined,
//       weakMap = WeakMap ? new WeakMap : undefined,
//       weakSet = WeakSet ? new WeakSet : undefined;

//   /** Math helpers. */
//   var add = function(x, y) { return x + y; },
//       doubled = function(n) { return n * 2; },
//       isEven = function(n) { return n % 2 == 0; },
//       square = function(n) { return n * n; };

//   /** Stub functions. */
//   var stubA = function() { return 'a'; },
//       stubB = function() { return 'b'; },
//       stubC = function() { return 'c'; };

//   var stubTrue = function() { return true; },
//       stubFalse = function() { return false; };

//   var stubNaN = function() { return NaN; },
//       stubNull = function() { return null; };

//   var stubZero = function() { return 0; },
//       stubOne = function() { return 1; },
//       stubTwo = function() { return 2; },
//       stubThree = function() { return 3; },
//       stubFour = function() { return 4; };

//   var stubArray = function() { return []; },
//       stubObject = function() { return {}; },
//       stubString = function() { return ''; };

//   /** List of Latin Unicode letters. */
//   var burredLetters = [
//     // Latin-1 Supplement letters.
//     '\xc0', '\xc1', '\xc2', '\xc3', '\xc4', '\xc5', '\xc6', '\xc7', '\xc8', '\xc9', '\xca', '\xcb', '\xcc', '\xcd', '\xce', '\xcf',
//     '\xd0', '\xd1', '\xd2', '\xd3', '\xd4', '\xd5', '\xd6',         '\xd8', '\xd9', '\xda', '\xdb', '\xdc', '\xdd', '\xde', '\xdf',
//     '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7', '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
//     '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6',         '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff',
//     // Latin Extended-A letters.
//     '\u0100', '\u0101', '\u0102', '\u0103', '\u0104', '\u0105', '\u0106', '\u0107', '\u0108', '\u0109', '\u010a', '\u010b', '\u010c', '\u010d', '\u010e', '\u010f',
//     '\u0110', '\u0111', '\u0112', '\u0113', '\u0114', '\u0115', '\u0116', '\u0117', '\u0118', '\u0119', '\u011a', '\u011b', '\u011c', '\u011d', '\u011e', '\u011f',
//     '\u0120', '\u0121', '\u0122', '\u0123', '\u0124', '\u0125', '\u0126', '\u0127', '\u0128', '\u0129', '\u012a', '\u012b', '\u012c', '\u012d', '\u012e', '\u012f',
//     '\u0130', '\u0131', '\u0132', '\u0133', '\u0134', '\u0135', '\u0136', '\u0137', '\u0138', '\u0139', '\u013a', '\u013b', '\u013c', '\u013d', '\u013e', '\u013f',
//     '\u0140', '\u0141', '\u0142', '\u0143', '\u0144', '\u0145', '\u0146', '\u0147', '\u0148', '\u0149', '\u014a', '\u014b', '\u014c', '\u014d', '\u014e', '\u014f',
//     '\u0150', '\u0151', '\u0152', '\u0153', '\u0154', '\u0155', '\u0156', '\u0157', '\u0158', '\u0159', '\u015a', '\u015b', '\u015c', '\u015d', '\u015e', '\u015f',
//     '\u0160', '\u0161', '\u0162', '\u0163', '\u0164', '\u0165', '\u0166', '\u0167', '\u0168', '\u0169', '\u016a', '\u016b', '\u016c', '\u016d', '\u016e', '\u016f',
//     '\u0170', '\u0171', '\u0172', '\u0173', '\u0174', '\u0175', '\u0176', '\u0177', '\u0178', '\u0179', '\u017a', '\u017b', '\u017c', '\u017d', '\u017e', '\u017f'
//   ];

//   /** List of combining diacritical marks. */
//   var comboMarks = [
//     '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030a', '\u030b', '\u030c', '\u030d', '\u030e', '\u030f',
//     '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317', '\u0318', '\u0319', '\u031a', '\u031b', '\u031c', '\u031d', '\u031e', '\u031f',
//     '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f',
//     '\u0330', '\u0331', '\u0332', '\u0333', '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0339', '\u033a', '\u033b', '\u033c', '\u033d', '\u033e', '\u033f',
//     '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0345', '\u0346', '\u0347', '\u0348', '\u0349', '\u034a', '\u034b', '\u034c', '\u034d', '\u034e', '\u034f',
//     '\u0350', '\u0351', '\u0352', '\u0353', '\u0354', '\u0355', '\u0356', '\u0357', '\u0358', '\u0359', '\u035a', '\u035b', '\u035c', '\u035d', '\u035e', '\u035f',
//     '\u0360', '\u0361', '\u0362', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f',
//     '\ufe20', '\ufe21', '\ufe22', '\ufe23'
//   ];

//   /** List of converted Latin Unicode letters. */
//   var deburredLetters = [
//     // Converted Latin-1 Supplement letters.
//     'A',  'A', 'A', 'A', 'A', 'A', 'Ae', 'C',  'E', 'E', 'E', 'E', 'I', 'I', 'I',
//     'I',  'D', 'N', 'O', 'O', 'O', 'O',  'O',  'O', 'U', 'U', 'U', 'U', 'Y', 'Th',
//     'ss', 'a', 'a', 'a', 'a', 'a', 'a',  'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i',  'i',
//     'i',  'd', 'n', 'o', 'o', 'o', 'o',  'o',  'o', 'u', 'u', 'u', 'u', 'y', 'th', 'y',
//     // Converted Latin Extended-A letters.
//     'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c',
//     'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e',
//     'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h',
//     'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j',
//     'K', 'k', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l',
//     'N', 'n', 'N', 'n', 'N', 'n', "'n", 'N', 'n',
//     'O', 'o', 'O', 'o', 'O', 'o', 'Oe', 'oe',
//     'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's',
//     'T', 't', 'T', 't', 'T', 't',
//     'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u',
//     'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's'
//   ];

//   /** Used to provide falsey values to methods. */
//   var falsey = [, null, undefined, false, 0, NaN, ''];

//   /** Used to specify the emoji style glyph variant of characters. */
//   var emojiVar = '\ufe0f';

//   /** Used to provide empty values to methods. */
//   var empties = [[], {}].concat(falsey.slice(1));

//   /** Used to test error objects. */
//   var errors = [
//     new Error,
//     new EvalError,
//     new RangeError,
//     new ReferenceError,
//     new SyntaxError,
//     new TypeError,
//     new URIError
//   ];

//   /** List of fitzpatrick modifiers. */
//   var fitzModifiers = [
//     '\ud83c\udffb',
//     '\ud83c\udffc',
//     '\ud83c\udffd',
//     '\ud83c\udffe',
//     '\ud83c\udfff'
//   ];

//   /** Used to provide primitive values to methods. */
//   var primitives = [null, undefined, false, true, 1, NaN, 'a'];

//   /** Used to check whether methods support typed arrays. */
//   var typedArrays = [
//     'Float32Array',
//     'Float64Array',
//     'Int8Array',
//     'Int16Array',
//     'Int32Array',
//     'Uint8Array',
//     'Uint8ClampedArray',
//     'Uint16Array',
//     'Uint32Array'
//   ];

//   /** Used to check whether methods support array views. */
//   var arrayViews = typedArrays.concat('DataView');

//   /** The file path of the lodash file to test. */
//   var filePath = (function() {
//     var min = 2,
//         result = params || [];

//     if (phantom) {
//       min = 0;
//       result = params = phantom.args || require('system').args;
//     }
//     var last = result[result.length - 1];
//     result = (result.length > min && !/test(?:\.js)?$/.test(last)) ? last : '../lodash.js';

//     if (!amd) {
//       try {
//         result = require('fs').realpathSync(result);
//       } catch (e) {}

//       try {
//         result = require.resolve(result);
//       } catch (e) {}
//     }
//     return result;
//   }());

//   /** The `ui` object. */
//   var ui = root.ui || (root.ui = {
//     'buildPath': filePath,
//     'loaderPath': '',
//     'isModularize': /\b(?:amd|commonjs|es|node|npm|(index|main)\.js)\b/.test(filePath),
//     'isStrict': /\bes\b/.test(filePath) || 'default' in require(filePath),
//     'urlParams': {}
//   });

//   /** The basename of the lodash file to test. */
//   var basename = /[\w.-]+$/.exec(filePath)[0];

//   /** Used to indicate testing a modularized build. */
//   var isModularize = ui.isModularize;

//   /** Detect if testing `npm` modules. */
//   var isNpm = isModularize && /\bnpm\b/.test([ui.buildPath, ui.urlParams.build]);

//   /** Detect if running in PhantomJS. */
//   var isPhantom = phantom || (typeof callPhantom == 'function');

//   /** Detect if lodash is in strict mode. */
//   var isStrict = ui.isStrict;

//   /*--------------------------------------------------------------------------*/

//   // Leak to avoid sporadic `noglobals` fails on Edge in Sauce Labs.
//   root.msWDfn = undefined;

//   // Assign `setTimeout` to itself to avoid being flagged as a leak.
//   setProperty(root, 'setTimeout', setTimeout);

//   // Exit early if going to run tests in a PhantomJS web page.
//   if (phantom && isModularize) {
//     var page = require('webpage').create();

//     page.onCallback = function(details) {
//       var coverage = details.coverage;
//       if (coverage) {
//         var fs = require('fs'),
//             cwd = fs.workingDirectory,
//             sep = fs.separator;

//         fs.write([cwd, 'coverage', 'coverage.json'].join(sep), JSON.stringify(coverage));
//       }
//       phantom.exit(details.failed ? 1 : 0);
//     };

//     page.onConsoleMessage = function(message) {
//       console.log(message);
//     };

//     page.onInitialized = function() {
//       page.evaluate(function() {
//         document.addEventListener('DOMContentLoaded', function() {
//           QUnit.done(function(details) {
//             details.coverage = window.__coverage__;
//             callPhantom(details);
//           });
//         });
//       });
//     };

//     page.open(filePath, function(status) {
//       if (status != 'success') {
//         console.log('PhantomJS failed to load page: ' + filePath);
//         phantom.exit(1);
//       }
//     });

//     console.log('test.js invoked with arguments: ' + JSON.stringify(slice.call(params)));
//     return;
//   }

//   /*--------------------------------------------------------------------------*/

//   /** Used to test Web Workers. */
//   var Worker = !(ui.isForeign || ui.isSauceLabs || isModularize) &&
//     (document && document.origin != 'null') && root.Worker;

//   /** Used to test host objects in IE. */
//   try {
//     var xml = new ActiveXObject('Microsoft.XMLDOM');
//   } catch (e) {}

//   /** Poison the free variable `root` in Node.js */
//   try {
//     defineProperty(global.root, 'root', {
//       'configurable': false,
//       'enumerable': false,
//       'get': function() { throw new ReferenceError; }
//     });
//   } catch (e) {}

//   /** Load QUnit and extras. */
//   var QUnit = root.QUnit || require('qunit-extras');

//   /** Load stable Lodash. */
//   var lodashStable = root.lodashStable;
//   if (!lodashStable) {
//     try {
//       lodashStable = interopRequire('../node_modules/lodash/lodash.js');
//     } catch (e) {
//       console.log('Error: The stable lodash dev dependency should be at least a version behind master branch.');
//       return;
//     }
//     lodashStable = lodashStable.noConflict();
//   }

//   /** The `lodash` function to test. */
//   var _ = root._ || (root._ = interopRequire(filePath));

//   /** Used to test pseudo private map caches. */
//   var mapCaches = (function() {
//     var MapCache = (_.memoize || lodashStable.memoize).Cache;
//     var result = {
//       'Hash': new MapCache().__data__.hash.constructor,
//       'MapCache': MapCache
//     };
//     (_.isMatchWith || lodashStable.isMatchWith)({ 'a': 1 }, { 'a': 1 }, function() {
//       var stack = lodashStable.last(arguments);
//       result.ListCache = stack.__data__.constructor;
//       result.Stack = stack.constructor;
//     });
//     return result;
//   }());

//   /** Used to detect instrumented istanbul code coverage runs. */
//   var coverage = root.__coverage__ || root[lodashStable.find(lodashStable.keys(root), function(key) {
//     return /^(?:\$\$cov_\d+\$\$)$/.test(key);
//   })];

//   /** Used to test async functions. */
//   var asyncFunc = lodashStable.attempt(function() {
//     return Function('return async () => {}');
//   });

//   /** Used to test generator functions. */
//   var genFunc = lodashStable.attempt(function() {
//     return Function('return function*(){}');
//   });

//   /** Used to restore the `_` reference. */
//   var oldDash = root._;

//   /**
//    * Used to check for problems removing whitespace. For a whitespace reference,
//    * see [V8's unit test](https://code.google.com/p/v8/source/browse/branches/bleeding_edge/test/mjsunit/whitespaces.js).
//    */
//   var whitespace = lodashStable.filter([
//     // Basic whitespace characters.
//     ' ', '\t', '\x0b', '\f', '\xa0', '\ufeff',

//     // Line terminators.
//     '\n', '\r', '\u2028', '\u2029',

//     // Unicode category "Zs" space separators.
//     '\u1680', '\u180e', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005',
//     '\u2006', '\u2007', '\u2008', '\u2009', '\u200a', '\u202f', '\u205f', '\u3000'
//   ],
//   function(chr) { return /\s/.exec(chr); })
//   .join('');

//   /**
//    * Creates a custom error object.
//    *
//    * @private
//    * @constructor
//    * @param {string} message The error message.
//    */
//   function CustomError(message) {
//     this.name = 'CustomError';
//     this.message = message;
//   }

//   CustomError.prototype = lodashStable.create(Error.prototype, {
//     'constructor': CustomError
//   });

//   /**
//    * Removes all own enumerable string keyed properties from a given object.
//    *
//    * @private
//    * @param {Object} object The object to empty.
//    */
//   function emptyObject(object) {
//     lodashStable.forOwn(object, function(value, key, object) {
//       delete object[key];
//     });
//   }

//   /**
//    * Extracts the unwrapped value from its wrapper.
//    *
//    * @private
//    * @param {Object} wrapper The wrapper to unwrap.
//    * @returns {*} Returns the unwrapped value.
//    */
//   function getUnwrappedValue(wrapper) {
//     var index = -1,
//         actions = wrapper.__actions__,
//         length = actions.length,
//         result = wrapper.__wrapped__;

//     while (++index < length) {
//       var args = [result],
//           action = actions[index];

//       push.apply(args, action.args);
//       result = action.func.apply(action.thisArg, args);
//     }
//     return result;
//   }

//   /**
//    * Loads the module of `id`. If the module has an `exports.default`, the
//    * exported default value is returned as the resolved module.
//    *
//    * @private
//    * @param {string} id The identifier of the module to resolve.
//    * @returns {*} Returns the resolved module.
//    */
//   function interopRequire(id) {
//     var result = require(id);
//     return 'default' in result ? result['default'] : result;
//   }

//   /**
//    * Sets a non-enumerable property value on `object`.
//    *
//    * Note: This function is used to avoid a bug in older versions of V8 where
//    * overwriting non-enumerable built-ins makes them enumerable.
//    * See https://code.google.com/p/v8/issues/detail?id=1623
//    *
//    * @private
//    * @param {Object} object The object modify.
//    * @param {string} key The name of the property to set.
//    * @param {*} value The property value.
//    */
//   function setProperty(object, key, value) {
//     try {
//       defineProperty(object, key, {
//         'configurable': true,
//         'enumerable': false,
//         'writable': true,
//         'value': value
//       });
//     } catch (e) {
//       object[key] = value;
//     }
//     return object;
//   }

//   /**
//    * Skips a given number of tests with a passing result.
//    *
//    * @private
//    * @param {Object} assert The QUnit assert object.
//    * @param {number} [count=1] The number of tests to skip.
//    */
//   function skipAssert(assert, count) {
//     count || (count = 1);
//     while (count--) {
//       assert.ok(true, 'test skipped');
//     }
//   }

//   /**
//    * Converts `array` to an `arguments` object.
//    *
//    * @private
//    * @param {Array} array The array to convert.
//    * @returns {Object} Returns the converted `arguments` object.
//    */
//   function toArgs(array) {
//     return (function() { return arguments; }.apply(undefined, array));
//   }

//   /*--------------------------------------------------------------------------*/

//   // Add bizarro values.
//   (function() {
//     if (document || (typeof require != 'function')) {
//       return;
//     }
//     var nativeString = fnToString.call(toString),
//         reToString = /toString/g;

//     function createToString(funcName) {
//       return lodashStable.constant(nativeString.replace(reToString, funcName));
//     }

//     // Allow bypassing native checks.
//     setProperty(funcProto, 'toString', function wrapper() {
//       setProperty(funcProto, 'toString', fnToString);
//       var result = lodashStable.has(this, 'toString') ? this.toString() : fnToString.call(this);
//       setProperty(funcProto, 'toString', wrapper);
//       return result;
//     });

//     // Add prototype extensions.
//     funcProto._method = noop;

//     // Set bad shims.
//     setProperty(Object, 'create', undefined);
//     setProperty(Object, 'getOwnPropertySymbols', undefined);

//     var _propertyIsEnumerable = objectProto.propertyIsEnumerable;
//     setProperty(objectProto, 'propertyIsEnumerable', function(key) {
//       return !(key == 'valueOf' && this && this.valueOf === 1) && _propertyIsEnumerable.call(this, key);
//     });

//     if (Buffer) {
//       defineProperty(root, 'Buffer', {
//         'configurable': true,
//         'enumerable': true,
//         'get': function get() {
//           var caller = get.caller,
//               name = caller ? caller.name : '';

//           if (!(name == 'runInContext' || name.length == 1 || /\b_\.isBuffer\b/.test(caller))) {
//             return Buffer;
//           }
//         }
//       });
//     }
//     if (Map) {
//       setProperty(root, 'Map', (function() {
//         var count = 0;
//         return function() {
//           if (count++) {
//             return new Map;
//           }
//           setProperty(root, 'Map', Map);
//           return {};
//         };
//       }()));

//       setProperty(root.Map, 'toString', createToString('Map'));
//     }
//     setProperty(root, 'Promise', noop);
//     setProperty(root, 'Set', noop);
//     setProperty(root, 'Symbol', undefined);
//     setProperty(root, 'WeakMap', noop);

//     // Fake `WinRTError`.
//     setProperty(root, 'WinRTError', Error);

//     // Clear cache so lodash can be reloaded.
//     emptyObject(require.cache);

//     // Load lodash and expose it to the bad extensions/shims.
//     lodashBizarro = interopRequire(filePath);
//     root._ = oldDash;

//     // Restore built-in methods.
//     setProperty(Object, 'create', create);
//     setProperty(objectProto, 'propertyIsEnumerable', _propertyIsEnumerable);
//     setProperty(root, 'Buffer', Buffer);

//     if (getSymbols) {
//       Object.getOwnPropertySymbols = getSymbols;
//     } else {
//       delete Object.getOwnPropertySymbols;
//     }
//     if (Map) {
//       setProperty(root, 'Map', Map);
//     } else {
//       delete root.Map;
//     }
//     if (Promise) {
//       setProperty(root, 'Promise', Promise);
//     } else {
//       delete root.Promise;
//     }
//     if (Set) {
//       setProperty(root, 'Set', Set);
//     } else {
//       delete root.Set;
//     }
//     if (Symbol) {
//       setProperty(root, 'Symbol', Symbol);
//     } else {
//       delete root.Symbol;
//     }
//     if (WeakMap) {
//       setProperty(root, 'WeakMap', WeakMap);
//     } else {
//       delete root.WeakMap;
//     }
//     delete root.WinRTError;
//     delete funcProto._method;
//   }());

//   // Add other realm values from the `vm` module.
//   lodashStable.attempt(function() {
//     lodashStable.assign(realm, require('vm').runInNewContext([
//       '(function() {',
//       '  var noop = function() {},',
//       '      root = this;',
//       '',
//       '  var object = {',
//       "    'ArrayBuffer': root.ArrayBuffer,",
//       "    'arguments': (function() { return arguments; }(1, 2, 3)),",
//       "    'array': [1],",
//       "    'arrayBuffer': root.ArrayBuffer ? new root.ArrayBuffer : undefined,",
//       "    'boolean': Object(false),",
//       "    'date': new Date,",
//       "    'errors': [new Error, new EvalError, new RangeError, new ReferenceError, new SyntaxError, new TypeError, new URIError],",
//       "    'function': noop,",
//       "    'map': root.Map ? new root.Map : undefined,",
//       "    'nan': NaN,",
//       "    'null': null,",
//       "    'number': Object(0),",
//       "    'object': { 'a': 1 },",
//       "    'promise': root.Promise ? Promise.resolve(1) : undefined,",
//       "    'regexp': /x/,",
//       "    'set': root.Set ? new root.Set : undefined,",
//       "    'string': Object('a'),",
//       "    'symbol': root.Symbol ? root.Symbol() : undefined,",
//       "    'undefined': undefined,",
//       "    'weakMap': root.WeakMap ? new root.WeakMap : undefined,",
//       "    'weakSet': root.WeakSet ? new root.WeakSet : undefined",
//       '  };',
//       '',
//       "  ['" + arrayViews.join("', '") + "'].forEach(function(type) {",
//       '    var Ctor = root[type]',
//       '    object[type] = Ctor;',
//       '    object[type.toLowerCase()] = Ctor ? new Ctor(new ArrayBuffer(24)) : undefined;',
//       '  });',
//       '',
//       '  return object;',
//       '}());'
//     ].join('\n')));
//   });

//   // Add other realm values from an iframe.
//   lodashStable.attempt(function() {
//     _._realm = realm;

//     var iframe = document.createElement('iframe');
//     iframe.frameBorder = iframe.height = iframe.width = 0;
//     body.appendChild(iframe);

//     var idoc = (idoc = iframe.contentDocument || iframe.contentWindow).document || idoc;
//     idoc.write([
//       '<html>',
//       '<body>',
//       '<script>',
//       'var _ = parent._,',
//       '    noop = function() {},',
//       '    root = this;',
//       '',
//       'var object = {',
//       "  'ArrayBuffer': root.ArrayBuffer,",
//       "  'arguments': (function() { return arguments; }(1, 2, 3)),",
//       "  'array': [1],",
//       "  'arrayBuffer': root.ArrayBuffer ? new root.ArrayBuffer : undefined,",
//       "  'boolean': Object(false),",
//       "  'date': new Date,",
//       "  'element': document.body,",
//       "  'errors': [new Error, new EvalError, new RangeError, new ReferenceError, new SyntaxError, new TypeError, new URIError],",
//       "  'function': noop,",
//       "  'map': root.Map ? new root.Map : undefined,",
//       "  'nan': NaN,",
//       "  'null': null,",
//       "  'number': Object(0),",
//       "  'object': { 'a': 1 },",
//       "  'promise': root.Promise ? Promise.resolve(1) : undefined,",
//       "  'regexp': /x/,",
//       "  'set': root.Set ? new root.Set : undefined,",
//       "  'string': Object('a'),",
//       "  'symbol': root.Symbol ? root.Symbol() : undefined,",
//       "  'undefined': undefined,",
//       "  'weakMap': root.WeakMap ? new root.WeakMap : undefined,",
//       "  'weakSet': root.WeakSet ? new root.WeakSet : undefined",
//       '};',
//       '',
//       "_.each(['" + arrayViews.join("', '") + "'], function(type) {",
//       '  var Ctor = root[type];',
//       '  object[type] = Ctor;',
//       '  object[type.toLowerCase()] = Ctor ? new Ctor(new ArrayBuffer(24)) : undefined;',
//       '});',
//       '',
//       '_.assign(_._realm, object);',
//       '</script>',
//       '</body>',
//       '</html>'
//     ].join('\n'));

//     idoc.close();
//     delete _._realm;
//   });

//   // Add a web worker.
//   lodashStable.attempt(function() {
//     var worker = new Worker('./asset/worker.js?t=' + (+new Date));
//     worker.addEventListener('message', function(e) {
//       _._VERSION = e.data || '';
//     }, false);

//     worker.postMessage(ui.buildPath);
//   });

//   // Expose internal modules for better code coverage.
//   lodashStable.attempt(function() {
//     var path = require('path'),
//         basePath = path.dirname(filePath);

//     if (isModularize && !(amd || isNpm)) {
//       lodashStable.each([
//         'baseEach',
//         'isIndex',
//         'isIterateeCall',
//         'memoizeCapped'
//       ], function(funcName) {
//         _['_' + funcName] = interopRequire(path.join(basePath, '_' + funcName));
//       });
//     }
//   });

//   /*--------------------------------------------------------------------------*/

//   if (params) {
//     console.log('Running lodash tests.');
//     console.log('test.js invoked with arguments: ' + JSON.stringify(slice.call(params)));
//   }

//   QUnit.module(basename);

//   (function() {
//     QUnit.test('should support loading ' + basename + ' as the "lodash" module', function(assert) {
//       assert.expect(1);

//       if (amd) {
//         assert.strictEqual((lodashModule || {}).moduleName, 'lodash');
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should support loading ' + basename + ' with the Require.js "shim" configuration option', function(assert) {
//       assert.expect(1);

//       if (amd && lodashStable.includes(ui.loaderPath, 'requirejs')) {
//         assert.strictEqual((shimmedModule || {}).moduleName, 'shimmed');
//       } else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should support loading ' + basename + ' as the "underscore" module', function(assert) {
//       assert.expect(1);

//       if (amd) {
//         assert.strictEqual((underscoreModule || {}).moduleName, 'underscore');
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should support loading ' + basename + ' in a web worker', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       if (Worker) {
//         var limit = 30000 / QUnit.config.asyncRetries,
//             start = +new Date;

//         var attempt = function() {
//           var actual = _._VERSION;
//           if ((new Date - start) < limit && typeof actual != 'string') {
//             setTimeout(attempt, 16);
//             return;
//           }
//           assert.strictEqual(actual, _.VERSION);
//           done();
//         };

//         attempt();
//       }
//       else {
//         skipAssert(assert);
//         done();
//       }
//     });

//     QUnit.test('should not add `Function.prototype` extensions to lodash', function(assert) {
//       assert.expect(1);

//       if (lodashBizarro) {
//         assert.notOk('_method' in lodashBizarro);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should avoid non-native built-ins', function(assert) {
//       assert.expect(6);

//       function message(lodashMethod, nativeMethod) {
//         return '`' + lodashMethod + '` should avoid overwritten native `' + nativeMethod + '`';
//       }

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.b = 2;

//       var object = { 'a': 1 },
//           otherObject = { 'b': 2 },
//           largeArray = lodashStable.times(LARGE_ARRAY_SIZE, lodashStable.constant(object));

//       if (lodashBizarro) {
//         try {
//           var actual = lodashBizarro.create(Foo.prototype);
//         } catch (e) {
//           actual = null;
//         }
//         var label = message('_.create', 'Object.create');
//         assert.ok(actual instanceof Foo, label);

//         try {
//           actual = [
//             lodashBizarro.difference([object, otherObject], largeArray),
//             lodashBizarro.intersection(largeArray, [object]),
//             lodashBizarro.uniq(largeArray)
//           ];
//         } catch (e) {
//           actual = null;
//         }
//         label = message('_.difference`, `_.intersection`, and `_.uniq', 'Map');
//         assert.deepEqual(actual, [[otherObject], [object], [object]], label);

//         try {
//           if (Symbol) {
//             object[symbol] = {};
//           }
//           actual = [
//             lodashBizarro.clone(object),
//             lodashBizarro.cloneDeep(object)
//           ];
//         } catch (e) {
//           actual = null;
//         }
//         label = message('_.clone` and `_.cloneDeep', 'Object.getOwnPropertySymbols');
//         assert.deepEqual(actual, [object, object], label);

//         try {
//           // Avoid buggy symbol detection in Babel's `_typeof` helper.
//           var symObject = setProperty(Object(symbol), 'constructor', Object);
//           actual = [
//             Symbol ? lodashBizarro.clone(symObject) : {},
//             Symbol ? lodashBizarro.isEqual(symObject, Object(symbol)) : false,
//             Symbol ? lodashBizarro.toString(symObject) : ''
//           ];
//         } catch (e) {
//           actual = null;
//         }
//         label = message('_.clone`, `_.isEqual`, and `_.toString', 'Symbol');
//         assert.deepEqual(actual, [{}, false, ''], label);

//         try {
//           var map = new lodashBizarro.memoize.Cache;
//           actual = map.set('a', 1).get('a');
//         } catch (e) {
//           actual = null;
//         }
//         label = message('_.memoize.Cache', 'Map');
//         assert.deepEqual(actual, 1, label);

//         try {
//           map = new (Map || Object);
//           if (Symbol && Symbol.iterator) {
//             map[Symbol.iterator] = null;
//           }
//           actual = lodashBizarro.toArray(map);
//         } catch (e) {
//           actual = null;
//         }
//         label = message('_.toArray', 'Map');
//         assert.deepEqual(actual, [], label);
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('isIndex');

//   (function() {
//     var func = _._isIndex;

//     QUnit.test('should return `true` for indexes', function(assert) {
//       assert.expect(1);

//       if (func) {
//         var values = [[0], ['0'], ['1'], [3, 4], [MAX_SAFE_INTEGER - 1]],
//             expected = lodashStable.map(values, stubTrue);

//         var actual = lodashStable.map(values, function(args) {
//           return func.apply(undefined, args);
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return `false` for non-indexes', function(assert) {
//       assert.expect(1);

//       if (func) {
//         var values = [['1abc'], ['07'], ['0001'], [-1], [3, 3], [1.1], [MAX_SAFE_INTEGER]],
//             expected = lodashStable.map(values, stubFalse);

//         var actual = lodashStable.map(values, function(args) {
//           return func.apply(undefined, args);
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('isIterateeCall');

//   (function() {
//     var array = [1],
//         func = _._isIterateeCall,
//         object =  { 'a': 1 };

//     QUnit.test('should return `true` for iteratee calls', function(assert) {
//       assert.expect(3);

//       function Foo() {}
//       Foo.prototype.a = 1;

//       if (func) {
//         assert.strictEqual(func(1, 0, array), true);
//         assert.strictEqual(func(1, 'a', object), true);
//         assert.strictEqual(func(1, 'a', new Foo), true);
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });

//     QUnit.test('should return `false` for non-iteratee calls', function(assert) {
//       assert.expect(4);

//       if (func) {
//         assert.strictEqual(func(2, 0, array), false);
//         assert.strictEqual(func(1, 1.1, array), false);
//         assert.strictEqual(func(1, 0, { 'length': MAX_SAFE_INTEGER + 1 }), false);
//         assert.strictEqual(func(1, 'b', object), false);
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should work with `NaN` values', function(assert) {
//       assert.expect(2);

//       if (func) {
//         assert.strictEqual(func(NaN, 0, [NaN]), true);
//         assert.strictEqual(func(NaN, 'a', { 'a': NaN }), true);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should not error when `index` is an object without a `toString` method', function(assert) {
//       assert.expect(1);

//       if (func) {
//         try {
//           var actual = func(1, { 'toString': null }, [1]);
//         } catch (e) {
//           var message = e.message;
//         }
//         assert.strictEqual(actual, false, message || '');
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('map caches');

//   (function() {
//     var keys = [null, undefined, false, true, 1, -Infinity, NaN, {}, 'a', symbol || noop];

//     var pairs = lodashStable.map(keys, function(key, index) {
//       var lastIndex = keys.length - 1;
//       return [key, keys[lastIndex - index]];
//     });

//     function createCaches(pairs) {
//       var largeStack = new mapCaches.Stack(pairs),
//           length = pairs ? pairs.length : 0;

//       lodashStable.times(LARGE_ARRAY_SIZE - length, function() {
//         largeStack.set({}, {});
//       });

//       return {
//         'hashes': new mapCaches.Hash(pairs),
//         'list caches': new mapCaches.ListCache(pairs),
//         'map caches': new mapCaches.MapCache(pairs),
//         'stack caches': new mapCaches.Stack(pairs),
//         'large stacks': largeStack
//       };
//     }

//     lodashStable.forOwn(createCaches(pairs), function(cache, kind) {
//       var isLarge = /^large/.test(kind);

//       QUnit.test('should implement a `Map` interface for ' + kind, function(assert) {
//         assert.expect(83);

//         lodashStable.each(keys, function(key, index) {
//           var value = pairs[index][1];

//           assert.deepEqual(cache.get(key), value);
//           assert.strictEqual(cache.has(key), true);
//           assert.strictEqual(cache.delete(key), true);
//           assert.strictEqual(cache.has(key), false);
//           assert.strictEqual(cache.get(key), undefined);
//           assert.strictEqual(cache.delete(key), false);
//           assert.strictEqual(cache.set(key, value), cache);
//           assert.strictEqual(cache.has(key), true);
//         });

//         assert.strictEqual(cache.size, isLarge ? LARGE_ARRAY_SIZE : keys.length);
//         assert.strictEqual(cache.clear(), undefined);
//         assert.ok(lodashStable.every(keys, function(key) {
//           return !cache.has(key);
//         }));
//       });
//     });

//     lodashStable.forOwn(createCaches(), function(cache, kind) {
//       QUnit.test('should support changing values of ' + kind, function(assert) {
//         assert.expect(10);

//         lodashStable.each(keys, function(key) {
//           cache.set(key, 1).set(key, 2);
//           assert.strictEqual(cache.get(key), 2);
//         });
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash constructor');

//   (function() {
//     var values = empties.concat(true, 1, 'a'),
//         expected = lodashStable.map(values, stubTrue);

//     QUnit.test('should create a new instance when called without the `new` operator', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var actual = lodashStable.map(values, function(value) {
//           return _(value) instanceof _;
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return the given `lodash` instances', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var actual = lodashStable.map(values, function(value) {
//           var wrapped = _(value);
//           return _(wrapped) === wrapped;
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should convert foreign wrapped values to `lodash` instances', function(assert) {
//       assert.expect(1);

//       if (!isNpm && lodashBizarro) {
//         var actual = lodashStable.map(values, function(value) {
//           var wrapped = _(lodashBizarro(value)),
//               unwrapped = wrapped.value();

//           return wrapped instanceof _ &&
//             ((unwrapped === value) || (unwrapped !== unwrapped && value !== value));
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.add');

//   (function() {
//     QUnit.test('should add two numbers', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.add(6, 4), 10);
//       assert.strictEqual(_.add(-6, 4), -2);
//       assert.strictEqual(_.add(-6, -4), -10);
//     });

//     QUnit.test('should not coerce arguments to numbers', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.add('6', '4'), '64');
//       assert.strictEqual(_.add('x', 'y'), 'xy');
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.after');

//   (function() {
//     function after(n, times) {
//       var count = 0;
//       lodashStable.times(times, _.after(n, function() { count++; }));
//       return count;
//     }

//     QUnit.test('should create a function that invokes `func` after `n` calls', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(after(5, 5), 1, 'after(n) should invoke `func` after being called `n` times');
//       assert.strictEqual(after(5, 4), 0, 'after(n) should not invoke `func` before being called `n` times');
//       assert.strictEqual(after(0, 0), 0, 'after(0) should not invoke `func` immediately');
//       assert.strictEqual(after(0, 1), 1, 'after(0) should invoke `func` when called once');
//     });

//     QUnit.test('should coerce `n` values of `NaN` to `0`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(after(NaN, 1), 1);
//     });

//     QUnit.test('should use `this` binding of function', function(assert) {
//       assert.expect(2);

//       var after = _.after(1, function(assert) { return ++this.count; }),
//           object = { 'after': after, 'count': 0 };

//       object.after();
//       assert.strictEqual(object.after(), 2);
//       assert.strictEqual(object.count, 2);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.ary');

//   (function() {
//     function fn(a, b, c) {
//       return slice.call(arguments);
//     }

//     QUnit.test('should cap the number of arguments provided to `func`', function(assert) {
//       assert.expect(2);

//       var actual = lodashStable.map(['6', '8', '10'], _.ary(parseInt, 1));
//       assert.deepEqual(actual, [6, 8, 10]);

//       var capped = _.ary(fn, 2);
//       assert.deepEqual(capped('a', 'b', 'c', 'd'), ['a', 'b']);
//     });

//     QUnit.test('should use `func.length` if `n` is not given', function(assert) {
//       assert.expect(1);

//       var capped = _.ary(fn);
//       assert.deepEqual(capped('a', 'b', 'c', 'd'), ['a', 'b', 'c']);
//     });

//     QUnit.test('should treat a negative `n` as `0`', function(assert) {
//       assert.expect(1);

//       var capped = _.ary(fn, -1);

//       try {
//         var actual = capped('a');
//       } catch (e) {}

//       assert.deepEqual(actual, []);
//     });

//     QUnit.test('should coerce `n` to an integer', function(assert) {
//       assert.expect(1);

//       var values = ['1', 1.6, 'xyz'],
//           expected = [['a'], ['a'], []];

//       var actual = lodashStable.map(values, function(n) {
//         var capped = _.ary(fn, n);
//         return capped('a', 'b');
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should not force a minimum argument count', function(assert) {
//       assert.expect(1);

//       var args = ['a', 'b', 'c'],
//           capped = _.ary(fn, 3);

//       var expected = lodashStable.map(args, function(arg, index) {
//         return args.slice(0, index);
//       });

//       var actual = lodashStable.map(expected, function(array) {
//         return capped.apply(undefined, array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should use `this` binding of function', function(assert) {
//       assert.expect(1);

//       var capped = _.ary(function(a, b) { return this; }, 1),
//           object = { 'capped': capped };

//       assert.strictEqual(object.capped(), object);
//     });

//     QUnit.test('should use the existing `ary` if smaller', function(assert) {
//       assert.expect(1);

//       var capped = _.ary(_.ary(fn, 1), 2);
//       assert.deepEqual(capped('a', 'b', 'c'), ['a']);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var funcs = lodashStable.map([fn], _.ary),
//           actual = funcs[0]('a', 'b', 'c');

//       assert.deepEqual(actual, ['a', 'b', 'c']);
//     });

//     QUnit.test('should work when combined with other methods that use metadata', function(assert) {
//       assert.expect(2);

//       var array = ['a', 'b', 'c'],
//           includes = _.curry(_.rearg(_.ary(_.includes, 2), 1, 0), 2);

//       assert.strictEqual(includes('b')(array, 2), true);

//       if (!isNpm) {
//         includes = _(_.includes).ary(2).rearg(1, 0).curry(2).value();
//         assert.strictEqual(includes('b')(array, 2), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.assignIn');

//   (function() {
//     QUnit.test('should be aliased', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.extend, _.assignIn);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.assign and lodash.assignIn');

//   lodashStable.each(['assign', 'assignIn'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should assign source properties to `object`', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(func({ 'a': 1 }, { 'b': 2 }), { 'a': 1, 'b': 2 });
//     });

//     QUnit.test('`_.' + methodName + '` should accept multiple sources', function(assert) {
//       assert.expect(2);

//       var expected = { 'a': 1, 'b': 2, 'c': 3 };
//       assert.deepEqual(func({ 'a': 1 }, { 'b': 2 }, { 'c': 3 }), expected);
//       assert.deepEqual(func({ 'a': 1 }, { 'b': 2, 'c': 2 }, { 'c': 3 }), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should overwrite destination properties', function(assert) {
//       assert.expect(1);

//       var expected = { 'a': 3, 'b': 2, 'c': 1 };
//       assert.deepEqual(func({ 'a': 1, 'b': 2 }, expected), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should assign source properties with nullish values', function(assert) {
//       assert.expect(1);

//       var expected = { 'a': null, 'b': undefined, 'c': null };
//       assert.deepEqual(func({ 'a': 1, 'b': 2 }, expected), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should skip assignments if values are the same', function(assert) {
//       assert.expect(1);

//       var object = {};

//       var descriptor = {
//         'configurable': true,
//         'enumerable': true,
//         'set': function() { throw new Error; }
//       };

//       var source = {
//         'a': 1,
//         'b': undefined,
//         'c': NaN,
//         'd': undefined,
//         'constructor': Object,
//         'toString': lodashStable.constant('source')
//       };

//       defineProperty(object, 'a', lodashStable.assign({}, descriptor, {
//         'get': stubOne
//       }));

//       defineProperty(object, 'b', lodashStable.assign({}, descriptor, {
//         'get': noop
//       }));

//       defineProperty(object, 'c', lodashStable.assign({}, descriptor, {
//         'get': stubNaN
//       }));

//       defineProperty(object, 'constructor', lodashStable.assign({}, descriptor, {
//         'get': lodashStable.constant(Object)
//       }));

//       try {
//         var actual = func(object, source);
//       } catch (e) {}

//       assert.deepEqual(actual, source);
//     });

//     QUnit.test('`_.' + methodName + '` should treat sparse array sources as dense', function(assert) {
//       assert.expect(1);

//       var array = [1];
//       array[2] = 3;

//       assert.deepEqual(func({}, array), { '0': 1, '1': undefined, '2': 3 });
//     });

//     QUnit.test('`_.' + methodName + '` should assign values of prototype objects', function(assert) {
//       assert.expect(1);

//       function Foo() {}
//       Foo.prototype.a = 1;

//       assert.deepEqual(func({}, Foo.prototype), { 'a': 1 });
//     });

//     QUnit.test('`_.' + methodName + '` should coerce string sources to objects', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(func({}, 'a'), { '0': 'a' });
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.assignInWith');

//   (function() {
//     QUnit.test('should be aliased', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.extendWith, _.assignInWith);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.assignWith and lodash.assignInWith');

//   lodashStable.each(['assignWith', 'assignInWith'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should work with a `customizer` callback', function(assert) {
//       assert.expect(1);

//       var actual = func({ 'a': 1, 'b': 2 }, { 'a': 3, 'c': 3 }, function(a, b) {
//         return a === undefined ? b : a;
//       });

//       assert.deepEqual(actual, { 'a': 1, 'b': 2, 'c': 3 });
//     });

//     QUnit.test('`_.' + methodName + '` should work with a `customizer` that returns `undefined`', function(assert) {
//       assert.expect(1);

//       var expected = { 'a': 1 };
//       assert.deepEqual(func({}, expected, noop), expected);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.at');

//   (function() {
//     var array = ['a', 'b', 'c'],
//         object = { 'a': [{ 'b': { 'c': 3 } }, 4] };

//     QUnit.test('should return the elements corresponding to the specified keys', function(assert) {
//       assert.expect(1);

//       var actual = _.at(array, [0, 2]);
//       assert.deepEqual(actual, ['a', 'c']);
//     });

//     QUnit.test('should return `undefined` for nonexistent keys', function(assert) {
//       assert.expect(1);

//       var actual = _.at(array, [2, 4, 0]);
//       assert.deepEqual(actual, ['c', undefined, 'a']);
//     });

//     QUnit.test('should work with non-index keys on array values', function(assert) {
//       assert.expect(1);

//       var values = lodashStable.reject(empties, function(value) {
//         return (value === 0) || lodashStable.isArray(value);
//       }).concat(-1, 1.1);

//       var array = lodashStable.transform(values, function(result, value) {
//         result[value] = 1;
//       }, []);

//       var expected = lodashStable.map(values, stubOne),
//           actual = _.at(array, values);

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return an empty array when no keys are given', function(assert) {
//       assert.expect(2);

//       assert.deepEqual(_.at(array), []);
//       assert.deepEqual(_.at(array, [], []), []);
//     });

//     QUnit.test('should accept multiple key arguments', function(assert) {
//       assert.expect(1);

//       var actual = _.at(['a', 'b', 'c', 'd'], 3, 0, 2);
//       assert.deepEqual(actual, ['d', 'a', 'c']);
//     });

//     QUnit.test('should work with a falsey `object` when keys are given', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, lodashStable.constant(Array(4)));

//       var actual = lodashStable.map(falsey, function(object) {
//         try {
//           return _.at(object, 0, 1, 'pop', 'push');
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with an `arguments` object for `object`', function(assert) {
//       assert.expect(1);

//       var actual = _.at(args, [2, 0]);
//       assert.deepEqual(actual, [3, 1]);
//     });

//     QUnit.test('should work with `arguments` object as secondary arguments', function(assert) {
//       assert.expect(1);

//       var actual = _.at([1, 2, 3, 4, 5], args);
//       assert.deepEqual(actual, [2, 3, 4]);
//     });

//     QUnit.test('should work with an object for `object`', function(assert) {
//       assert.expect(1);

//       var actual = _.at(object, ['a[0].b.c', 'a[1]']);
//       assert.deepEqual(actual, [3, 4]);
//     });

//     QUnit.test('should pluck inherited property values', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.b = 2;

//       var actual = _.at(new Foo, 'b');
//       assert.deepEqual(actual, [2]);
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         var largeArray = lodashStable.range(LARGE_ARRAY_SIZE),
//             smallArray = array;

//         lodashStable.each([[2], ['2'], [2, 1]], function(paths) {
//           lodashStable.times(2, function(index) {
//             var array = index ? largeArray : smallArray,
//                 wrapped = _(array).map(identity).at(paths);

//             assert.deepEqual(wrapped.value(), _.at(_.map(array, identity), paths));
//           });
//         });
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });

//     QUnit.test('should support shortcut fusion', function(assert) {
//       assert.expect(8);

//       if (!isNpm) {
//         var array = lodashStable.range(LARGE_ARRAY_SIZE),
//             count = 0,
//             iteratee = function(value) { count++; return square(value); },
//             lastIndex = LARGE_ARRAY_SIZE - 1;

//         lodashStable.each([lastIndex, lastIndex + '', LARGE_ARRAY_SIZE, []], function(n, index) {
//           count = 0;
//           var actual = _(array).map(iteratee).at(n).value(),
//               expected = index < 2 ? 1 : 0;

//           assert.strictEqual(count, expected);

//           expected = index == 3 ? [] : [index == 2 ? undefined : square(lastIndex)];
//           assert.deepEqual(actual, expected);
//         });
//       }
//       else {
//         skipAssert(assert, 8);
//       }
//     });

//     QUnit.test('work with an object for `object` when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var paths = ['a[0].b.c', 'a[1]'],
//             actual = _(object).map(identity).at(paths).value();

//         assert.deepEqual(actual, _.at(_.map(object, identity), paths));

//         var indexObject = { '0': 1 };
//         actual = _(indexObject).at(0).value();
//         assert.deepEqual(actual, _.at(indexObject, 0));
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.attempt');

//   (function() {
//     QUnit.test('should return the result of `func`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.attempt(lodashStable.constant('x')), 'x');
//     });

//     QUnit.test('should provide additional arguments to `func`', function(assert) {
//       assert.expect(1);

//       var actual = _.attempt(function() { return slice.call(arguments); }, 1, 2);
//       assert.deepEqual(actual, [1, 2]);
//     });

//     QUnit.test('should return the caught error', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(errors, stubTrue);

//       var actual = lodashStable.map(errors, function(error) {
//         return _.attempt(function() { throw error; }) === error;
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should coerce errors to error objects', function(assert) {
//       assert.expect(1);

//       var actual = _.attempt(function() { throw 'x'; });
//       assert.ok(lodashStable.isEqual(actual, Error('x')));
//     });

//     QUnit.test('should preserve custom errors', function(assert) {
//       assert.expect(1);

//       var actual = _.attempt(function() { throw new CustomError('x'); });
//       assert.ok(actual instanceof CustomError);
//     });

//     QUnit.test('should work with an error object from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.errors) {
//         var expected = lodashStable.map(realm.errors, stubTrue);

//         var actual = lodashStable.map(realm.errors, function(error) {
//           return _.attempt(function() { throw error; }) === error;
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.strictEqual(_(lodashStable.constant('x')).attempt(), 'x');
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.ok(_(lodashStable.constant('x')).chain().attempt() instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.before');

//   (function() {
//     function before(n, times) {
//       var count = 0;
//       lodashStable.times(times, _.before(n, function() { count++; }));
//       return count;
//     }

//     QUnit.test('should create a function that invokes `func` after `n` calls', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(before(5, 4), 4, 'before(n) should invoke `func` before being called `n` times');
//       assert.strictEqual(before(5, 6), 4, 'before(n) should not invoke `func` after being called `n - 1` times');
//       assert.strictEqual(before(0, 0), 0, 'before(0) should not invoke `func` immediately');
//       assert.strictEqual(before(0, 1), 0, 'before(0) should not invoke `func` when called');
//     });

//     QUnit.test('should coerce `n` values of `NaN` to `0`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(before(NaN, 1), 0);
//     });

//     QUnit.test('should use `this` binding of function', function(assert) {
//       assert.expect(2);

//       var before = _.before(2, function(assert) { return ++this.count; }),
//           object = { 'before': before, 'count': 0 };

//       object.before();
//       assert.strictEqual(object.before(), 1);
//       assert.strictEqual(object.count, 1);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.bind');

//   (function() {
//     function fn() {
//       var result = [this];
//       push.apply(result, arguments);
//       return result;
//     }

//     QUnit.test('should bind a function to an object', function(assert) {
//       assert.expect(1);

//       var object = {},
//           bound = _.bind(fn, object);

//       assert.deepEqual(bound('a'), [object, 'a']);
//     });

//     QUnit.test('should accept a falsey `thisArg`', function(assert) {
//       assert.expect(1);

//       var values = lodashStable.reject(falsey.slice(1), function(value) { return value == null; }),
//           expected = lodashStable.map(values, function(value) { return [value]; });

//       var actual = lodashStable.map(values, function(value) {
//         try {
//           var bound = _.bind(fn, value);
//           return bound();
//         } catch (e) {}
//       });

//       assert.ok(lodashStable.every(actual, function(value, index) {
//         return lodashStable.isEqual(value, expected[index]);
//       }));
//     });

//     QUnit.test('should bind a function to nullish values', function(assert) {
//       assert.expect(6);

//       var bound = _.bind(fn, null),
//           actual = bound('a');

//       assert.ok((actual[0] === null) || (actual[0] && actual[0].Array));
//       assert.strictEqual(actual[1], 'a');

//       lodashStable.times(2, function(index) {
//         bound = index ? _.bind(fn, undefined) : _.bind(fn);
//         actual = bound('b');

//         assert.ok((actual[0] === undefined) || (actual[0] && actual[0].Array));
//         assert.strictEqual(actual[1], 'b');
//       });
//     });

//     QUnit.test('should partially apply arguments ', function(assert) {
//       assert.expect(4);

//       var object = {},
//           bound = _.bind(fn, object, 'a');

//       assert.deepEqual(bound(), [object, 'a']);

//       bound = _.bind(fn, object, 'a');
//       assert.deepEqual(bound('b'), [object, 'a', 'b']);

//       bound = _.bind(fn, object, 'a', 'b');
//       assert.deepEqual(bound(), [object, 'a', 'b']);
//       assert.deepEqual(bound('c', 'd'), [object, 'a', 'b', 'c', 'd']);
//     });

//     QUnit.test('should support placeholders', function(assert) {
//       assert.expect(4);

//       var object = {},
//           ph = _.bind.placeholder,
//           bound = _.bind(fn, object, ph, 'b', ph);

//       assert.deepEqual(bound('a', 'c'), [object, 'a', 'b', 'c']);
//       assert.deepEqual(bound('a'), [object, 'a', 'b', undefined]);
//       assert.deepEqual(bound('a', 'c', 'd'), [object, 'a', 'b', 'c', 'd']);
//       assert.deepEqual(bound(), [object, undefined, 'b', undefined]);
//     });

//     QUnit.test('should use `_.placeholder` when set', function(assert) {
//       assert.expect(1);

//       if (!isModularize) {
//         var _ph = _.placeholder = {},
//             ph = _.bind.placeholder,
//             object = {},
//             bound = _.bind(fn, object, _ph, 'b', ph);

//         assert.deepEqual(bound('a', 'c'), [object, 'a', 'b', ph, 'c']);
//         delete _.placeholder;
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should create a function with a `length` of `0`', function(assert) {
//       assert.expect(2);

//       var fn = function(a, b, c) {},
//           bound = _.bind(fn, {});

//       assert.strictEqual(bound.length, 0);

//       bound = _.bind(fn, {}, 1);
//       assert.strictEqual(bound.length, 0);
//     });

//     QUnit.test('should ignore binding when called with the `new` operator', function(assert) {
//       assert.expect(3);

//       function Foo() {
//         return this;
//       }

//       var bound = _.bind(Foo, { 'a': 1 }),
//           newBound = new bound;

//       assert.strictEqual(bound().a, 1);
//       assert.strictEqual(newBound.a, undefined);
//       assert.ok(newBound instanceof Foo);
//     });

//     QUnit.test('should handle a number of arguments when called with the `new` operator', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         return this;
//       }

//       function Bar() {}

//       var thisArg = { 'a': 1 },
//           boundFoo = _.bind(Foo, thisArg),
//           boundBar = _.bind(Bar, thisArg),
//           count = 9,
//           expected = lodashStable.times(count, lodashStable.constant([undefined, undefined]));

//       var actual = lodashStable.times(count, function(index) {
//         try {
//           switch (index) {
//             case 0: return [new boundFoo().a, new boundBar().a];
//             case 1: return [new boundFoo(1).a, new boundBar(1).a];
//             case 2: return [new boundFoo(1, 2).a, new boundBar(1, 2).a];
//             case 3: return [new boundFoo(1, 2, 3).a, new boundBar(1, 2, 3).a];
//             case 4: return [new boundFoo(1, 2, 3, 4).a, new boundBar(1, 2, 3, 4).a];
//             case 5: return [new boundFoo(1, 2, 3, 4, 5).a, new boundBar(1, 2, 3, 4, 5).a];
//             case 6: return [new boundFoo(1, 2, 3, 4, 5, 6).a, new boundBar(1, 2, 3, 4, 5, 6).a];
//             case 7: return [new boundFoo(1, 2, 3, 4, 5, 6, 7).a, new boundBar(1, 2, 3, 4, 5, 6, 7).a];
//             case 8: return [new boundFoo(1, 2, 3, 4, 5, 6, 7, 8).a, new boundBar(1, 2, 3, 4, 5, 6, 7, 8).a];
//           }
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should ensure `new bound` is an instance of `func`', function(assert) {
//       assert.expect(2);

//       function Foo(value) {
//         return value && object;
//       }

//       var bound = _.bind(Foo),
//           object = {};

//       assert.ok(new bound instanceof Foo);
//       assert.strictEqual(new bound(true), object);
//     });

//     QUnit.test('should append array arguments to partially applied arguments', function(assert) {
//       assert.expect(1);

//       var object = {},
//           bound = _.bind(fn, object, 'a');

//       assert.deepEqual(bound(['b'], 'c'), [object, 'a', ['b'], 'c']);
//     });

//     QUnit.test('should not rebind functions', function(assert) {
//       assert.expect(3);

//       var object1 = {},
//           object2 = {},
//           object3 = {};

//       var bound1 = _.bind(fn, object1),
//           bound2 = _.bind(bound1, object2, 'a'),
//           bound3 = _.bind(bound1, object3, 'b');

//       assert.deepEqual(bound1(), [object1]);
//       assert.deepEqual(bound2(), [object1, 'a']);
//       assert.deepEqual(bound3(), [object1, 'b']);
//     });

//     QUnit.test('should not error when instantiating bound built-ins', function(assert) {
//       assert.expect(2);

//       var Ctor = _.bind(Date, null),
//           expected = new Date(2012, 4, 23, 0, 0, 0, 0);

//       try {
//         var actual = new Ctor(2012, 4, 23, 0, 0, 0, 0);
//       } catch (e) {}

//       assert.deepEqual(actual, expected);

//       Ctor = _.bind(Date, null, 2012, 4, 23);

//       try {
//         actual = new Ctor(0, 0, 0, 0);
//       } catch (e) {}

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should not error when calling bound class constructors with the `new` operator', function(assert) {
//       assert.expect(1);

//       var createCtor = lodashStable.attempt(Function, '"use strict";return class A{}');

//       if (typeof createCtor == 'function') {
//         var bound = _.bind(createCtor()),
//             count = 8,
//             expected = lodashStable.times(count, stubTrue);

//         var actual = lodashStable.times(count, function(index) {
//           try {
//             switch (index) {
//               case 0: return !!(new bound);
//               case 1: return !!(new bound(1));
//               case 2: return !!(new bound(1, 2));
//               case 3: return !!(new bound(1, 2, 3));
//               case 4: return !!(new bound(1, 2, 3, 4));
//               case 5: return !!(new bound(1, 2, 3, 4, 5));
//               case 6: return !!(new bound(1, 2, 3, 4, 5, 6));
//               case 7: return !!(new bound(1, 2, 3, 4, 5, 6, 7));
//             }
//           } catch (e) {}
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var object = {},
//             bound = _(fn).bind({}, 'a', 'b');

//         assert.ok(bound instanceof _);

//         var actual = bound.value()('c');
//         assert.deepEqual(actual, [object, 'a', 'b', 'c']);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.bindAll');

//   (function() {
//     var args = toArgs(['a']);

//     var source = {
//       '_n0': -2,
//       '_p0': -1,
//       '_a': 1,
//       '_b': 2,
//       '_c': 3,
//       '_d': 4,
//       '-0': function() { return this._n0; },
//       '0': function() { return this._p0; },
//       'a': function() { return this._a; },
//       'b': function() { return this._b; },
//       'c': function() { return this._c; },
//       'd': function() { return this._d; }
//     };

//     QUnit.test('should accept individual method names', function(assert) {
//       assert.expect(1);

//       var object = lodashStable.cloneDeep(source);
//       _.bindAll(object, 'a', 'b');

//       var actual = lodashStable.map(['a', 'b', 'c'], function(key) {
//         return object[key].call({});
//       });

//       assert.deepEqual(actual, [1, 2, undefined]);
//     });

//     QUnit.test('should accept arrays of method names', function(assert) {
//       assert.expect(1);

//       var object = lodashStable.cloneDeep(source);
//       _.bindAll(object, ['a', 'b'], ['c']);

//       var actual = lodashStable.map(['a', 'b', 'c', 'd'], function(key) {
//         return object[key].call({});
//       });

//       assert.deepEqual(actual, [1, 2, 3, undefined]);
//     });

//     QUnit.test('should preserve the sign of `0`', function(assert) {
//       assert.expect(1);

//       var props = [-0, Object(-0), 0, Object(0)];

//       var actual = lodashStable.map(props, function(key) {
//         var object = lodashStable.cloneDeep(source);
//         _.bindAll(object, key);
//         return object[lodashStable.toString(key)].call({});
//       });

//       assert.deepEqual(actual, [-2, -2, -1, -1]);
//     });

//     QUnit.test('should work with an array `object`', function(assert) {
//       assert.expect(1);

//       var array = ['push', 'pop'];
//       _.bindAll(array);
//       assert.strictEqual(array.pop, arrayProto.pop);
//     });

//     QUnit.test('should work with `arguments` objects as secondary arguments', function(assert) {
//       assert.expect(1);

//       var object = lodashStable.cloneDeep(source);
//       _.bindAll(object, args);

//       var actual = lodashStable.map(args, function(key) {
//         return object[key].call({});
//       });

//       assert.deepEqual(actual, [1]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.bindKey');

//   (function() {
//     QUnit.test('should work when the target function is overwritten', function(assert) {
//       assert.expect(2);

//       var object = {
//         'user': 'fred',
//         'greet': function(greeting) {
//           return this.user + ' says: ' + greeting;
//         }
//       };

//       var bound = _.bindKey(object, 'greet', 'hi');
//       assert.strictEqual(bound(), 'fred says: hi');

//       object.greet = function(greeting) {
//         return this.user + ' says: ' + greeting + '!';
//       };

//       assert.strictEqual(bound(), 'fred says: hi!');
//     });

//     QUnit.test('should support placeholders', function(assert) {
//       assert.expect(4);

//       var object = {
//         'fn': function() {
//           return slice.call(arguments);
//         }
//       };

//       var ph = _.bindKey.placeholder,
//           bound = _.bindKey(object, 'fn', ph, 'b', ph);

//       assert.deepEqual(bound('a', 'c'), ['a', 'b', 'c']);
//       assert.deepEqual(bound('a'), ['a', 'b', undefined]);
//       assert.deepEqual(bound('a', 'c', 'd'), ['a', 'b', 'c', 'd']);
//       assert.deepEqual(bound(), [undefined, 'b', undefined]);
//     });

//     QUnit.test('should use `_.placeholder` when set', function(assert) {
//       assert.expect(1);

//       if (!isModularize) {
//         var object = {
//           'fn': function() {
//             return slice.call(arguments);
//           }
//         };

//         var _ph = _.placeholder = {},
//             ph = _.bindKey.placeholder,
//             bound = _.bindKey(object, 'fn', _ph, 'b', ph);

//         assert.deepEqual(bound('a', 'c'), ['a', 'b', ph, 'c']);
//         delete _.placeholder;
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should ensure `new bound` is an instance of `object[key]`', function(assert) {
//       assert.expect(2);

//       function Foo(value) {
//         return value && object;
//       }

//       var object = { 'Foo': Foo },
//           bound = _.bindKey(object, 'Foo');

//       assert.ok(new bound instanceof Foo);
//       assert.strictEqual(new bound(true), object);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('case methods');

//   lodashStable.each(['camel', 'kebab', 'lower', 'snake', 'start', 'upper'], function(caseName) {
//     var methodName = caseName + 'Case',
//         func = _[methodName];

//     var strings = [
//       'foo bar', 'Foo bar', 'foo Bar', 'Foo Bar',
//       'FOO BAR', 'fooBar', '--foo-bar--', '__foo_bar__'
//     ];

//     var converted = (function() {
//       switch (caseName) {
//         case 'camel': return 'fooBar';
//         case 'kebab': return 'foo-bar';
//         case 'lower': return 'foo bar';
//         case 'snake': return 'foo_bar';
//         case 'start': return 'Foo Bar';
//         case 'upper': return 'FOO BAR';
//       }
//     }());

//     QUnit.test('`_.' + methodName + '` should convert `string` to ' + caseName + ' case', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map(strings, function(string) {
//         var expected = (caseName == 'start' && string == 'FOO BAR') ? string : converted;
//         return func(string) === expected;
//       });

//       assert.deepEqual(actual, lodashStable.map(strings, stubTrue));
//     });

//     QUnit.test('`_.' + methodName + '` should handle double-converting strings', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map(strings, function(string) {
//         var expected = (caseName == 'start' && string == 'FOO BAR') ? string : converted;
//         return func(func(string)) === expected;
//       });

//       assert.deepEqual(actual, lodashStable.map(strings, stubTrue));
//     });

//     QUnit.test('`_.' + methodName + '` should deburr letters', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map(burredLetters, function(burred, index) {
//         var letter = deburredLetters[index].replace(/['\u2019]/g, '');
//         if (caseName == 'start') {
//           letter = letter == 'IJ' ? letter : lodashStable.capitalize(letter);
//         } else if (caseName == 'upper') {
//           letter = letter.toUpperCase();
//         } else {
//           letter = letter.toLowerCase();
//         }
//         return func(burred) === letter;
//       });

//       assert.deepEqual(actual, lodashStable.map(burredLetters, stubTrue));
//     });

//     QUnit.test('`_.' + methodName + '` should remove contraction apostrophes', function(assert) {
//       assert.expect(2);

//       var postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

//       lodashStable.each(["'", '\u2019'], function(apos) {
//         var actual = lodashStable.map(postfixes, function(postfix) {
//           return func('a b' + apos + postfix +  ' c');
//         });

//         var expected = lodashStable.map(postfixes, function(postfix) {
//           switch (caseName) {
//             case 'camel': return 'aB'  + postfix + 'C';
//             case 'kebab': return 'a-b' + postfix + '-c';
//             case 'lower': return 'a b' + postfix + ' c';
//             case 'snake': return 'a_b' + postfix + '_c';
//             case 'start': return 'A B' + postfix + ' C';
//             case 'upper': return 'A B' + postfix.toUpperCase() + ' C';
//           }
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should remove Latin mathematical operators', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map(['\xd7', '\xf7'], func);
//       assert.deepEqual(actual, ['', '']);
//     });

//     QUnit.test('`_.' + methodName + '` should coerce `string` to a string', function(assert) {
//       assert.expect(2);

//       var string = 'foo bar';
//       assert.strictEqual(func(Object(string)), converted);
//       assert.strictEqual(func({ 'toString': lodashStable.constant(string) }), converted);
//     });

//     QUnit.test('`_.' + methodName + '` should return an unwrapped value implicitly when chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.strictEqual(_('foo bar')[methodName](), converted);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.ok(_('foo bar').chain()[methodName]() instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   });

//   (function() {
//     QUnit.test('should get the original value after cycling through all case methods', function(assert) {
//       assert.expect(1);

//       var funcs = [_.camelCase, _.kebabCase, _.lowerCase, _.snakeCase, _.startCase, _.lowerCase, _.camelCase];

//       var actual = lodashStable.reduce(funcs, function(result, func) {
//         return func(result);
//       }, 'enable 6h format');

//       assert.strictEqual(actual, 'enable6HFormat');
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.camelCase');

//   (function() {
//     QUnit.test('should work with numbers', function(assert) {
//       assert.expect(6);

//       assert.strictEqual(_.camelCase('12 feet'), '12Feet');
//       assert.strictEqual(_.camelCase('enable 6h format'), 'enable6HFormat');
//       assert.strictEqual(_.camelCase('enable 24H format'), 'enable24HFormat');
//       assert.strictEqual(_.camelCase('too legit 2 quit'), 'tooLegit2Quit');
//       assert.strictEqual(_.camelCase('walk 500 miles'), 'walk500Miles');
//       assert.strictEqual(_.camelCase('xhr2 request'), 'xhr2Request');
//     });

//     QUnit.test('should handle acronyms', function(assert) {
//       assert.expect(6);

//       lodashStable.each(['safe HTML', 'safeHTML'], function(string) {
//         assert.strictEqual(_.camelCase(string), 'safeHtml');
//       });

//       lodashStable.each(['escape HTML entities', 'escapeHTMLEntities'], function(string) {
//         assert.strictEqual(_.camelCase(string), 'escapeHtmlEntities');
//       });

//       lodashStable.each(['XMLHttpRequest', 'XmlHTTPRequest'], function(string) {
//         assert.strictEqual(_.camelCase(string), 'xmlHttpRequest');
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.capitalize');

//   (function() {
//     QUnit.test('should capitalize the first character of a string', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.capitalize('fred'), 'Fred');
//       assert.strictEqual(_.capitalize('Fred'), 'Fred');
//       assert.strictEqual(_.capitalize(' fred'), ' fred');
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.castArray');

//   (function() {
//     QUnit.test('should wrap non-array items in an array', function(assert) {
//       assert.expect(1);

//       var values = falsey.concat(true, 1, 'a', { 'a': 1 }),
//           expected = lodashStable.map(values, function(value) { return [value]; }),
//           actual = lodashStable.map(values, _.castArray);

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return array values by reference', function(assert) {
//       assert.expect(1);

//       var array = [1];
//       assert.strictEqual(_.castArray(array), array);
//     });

//     QUnit.test('should return an empty array when no arguments are given', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.castArray(), []);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.chain');

//   (function() {
//     QUnit.test('should return a wrapped value', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var actual = _.chain({ 'a': 0 });
//         assert.ok(actual instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return existing wrapped values', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _({ 'a': 0 });
//         assert.strictEqual(_.chain(wrapped), wrapped);
//         assert.strictEqual(wrapped.chain(), wrapped);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should enable chaining for methods that return unwrapped values', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         var array = ['c', 'b', 'a'];

//         assert.ok(_.chain(array).head() instanceof _);
//         assert.ok(_(array).chain().head() instanceof _);

//         assert.ok(_.chain(array).isArray() instanceof _);
//         assert.ok(_(array).chain().isArray() instanceof _);

//         assert.ok(_.chain(array).sortBy().head() instanceof _);
//         assert.ok(_(array).chain().sortBy().head() instanceof _);
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });

//     QUnit.test('should chain multiple methods', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         lodashStable.times(2, function(index) {
//           var array = ['one two three four', 'five six seven eight', 'nine ten eleven twelve'],
//               expected = { ' ': 9, 'e': 14, 'f': 2, 'g': 1, 'h': 2, 'i': 4, 'l': 2, 'n': 6, 'o': 3, 'r': 2, 's': 2, 't': 5, 'u': 1, 'v': 4, 'w': 2, 'x': 1 },
//               wrapped = index ? _(array).chain() : _.chain(array);

//           var actual = wrapped
//             .chain()
//             .map(function(value) { return value.split(''); })
//             .flatten()
//             .reduce(function(object, chr) {
//               object[chr] || (object[chr] = 0);
//               object[chr]++;
//               return object;
//             }, {})
//             .value();

//           assert.deepEqual(actual, expected);

//           array = [1, 2, 3, 4, 5, 6];
//           wrapped = index ? _(array).chain() : _.chain(array);
//           actual = wrapped
//             .chain()
//             .filter(function(n) { return n % 2 != 0; })
//             .reject(function(n) { return n % 3 == 0; })
//             .sortBy(function(n) { return -n; })
//             .value();

//           assert.deepEqual(actual, [5, 1]);

//           array = [3, 4];
//           wrapped = index ? _(array).chain() : _.chain(array);
//           actual = wrapped
//             .reverse()
//             .concat([2, 1])
//             .unshift(5)
//             .tap(function(value) { value.pop(); })
//             .map(square)
//             .value();

//           assert.deepEqual(actual, [25, 16, 9, 4]);
//         });
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.chunk');

//   (function() {
//     var array = [0, 1, 2, 3, 4, 5];

//     QUnit.test('should return chunked arrays', function(assert) {
//       assert.expect(1);

//       var actual = _.chunk(array, 3);
//       assert.deepEqual(actual, [[0, 1, 2], [3, 4, 5]]);
//     });

//     QUnit.test('should return the last chunk as remaining elements', function(assert) {
//       assert.expect(1);

//       var actual = _.chunk(array, 4);
//       assert.deepEqual(actual, [[0, 1, 2, 3], [4, 5]]);
//     });

//     QUnit.test('should treat falsey `size` values, except `undefined`, as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === undefined ? [[0], [1], [2], [3], [4], [5]] : [];
//       });

//       var actual = lodashStable.map(falsey, function(size, index) {
//         return index ? _.chunk(array, size) : _.chunk(array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should ensure the minimum `size` is `0`', function(assert) {
//       assert.expect(1);

//       var values = lodashStable.reject(falsey, lodashStable.isUndefined).concat(-1, -Infinity),
//           expected = lodashStable.map(values, stubArray);

//       var actual = lodashStable.map(values, function(n) {
//         return _.chunk(array, n);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should coerce `size` to an integer', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.chunk(array, array.length / 4), [[0], [1], [2], [3], [4], [5]]);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map([[1, 2], [3, 4]], _.chunk);
//       assert.deepEqual(actual, [[[1], [2]], [[3], [4]]]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.clamp');

//   (function() {
//     QUnit.test('should work with a `max`', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.clamp(5, 3), 3);
//       assert.strictEqual(_.clamp(1, 3), 1);
//     });

//     QUnit.test('should clamp negative numbers', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.clamp(-10, -5, 5), -5);
//       assert.strictEqual(_.clamp(-10.2, -5.5, 5.5), -5.5);
//       assert.strictEqual(_.clamp(-Infinity, -5, 5), -5);
//     });

//     QUnit.test('should clamp positive numbers', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.clamp(10, -5, 5), 5);
//       assert.strictEqual(_.clamp(10.6, -5.6, 5.4), 5.4);
//       assert.strictEqual(_.clamp(Infinity, -5, 5), 5);
//     });

//     QUnit.test('should not alter negative numbers in range', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.clamp(-4, -5, 5), -4);
//       assert.strictEqual(_.clamp(-5, -5, 5), -5);
//       assert.strictEqual(_.clamp(-5.5, -5.6, 5.6), -5.5);
//     });

//     QUnit.test('should not alter positive numbers in range', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.clamp(4, -5, 5), 4);
//       assert.strictEqual(_.clamp(5, -5, 5), 5);
//       assert.strictEqual(_.clamp(4.5, -5.1, 5.2), 4.5);
//     });

//     QUnit.test('should not alter `0` in range', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(1 / _.clamp(0, -5, 5), Infinity);
//     });

//     QUnit.test('should clamp to `0`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(1 / _.clamp(-10, 0, 5), Infinity);
//     });

//     QUnit.test('should not alter `-0` in range', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(1 / _.clamp(-0, -5, 5), -Infinity);
//     });

//     QUnit.test('should clamp to `-0`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(1 / _.clamp(-10, -0, 5), -Infinity);
//     });

//     QUnit.test('should return `NaN` when `number` is `NaN`', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.clamp(NaN, -5, 5), NaN);
//     });

//     QUnit.test('should coerce `min` and `max` of `NaN` to `0`', function(assert) {
//       assert.expect(2);

//       assert.deepEqual(_.clamp(1, -5, NaN), 0);
//       assert.deepEqual(_.clamp(-1, NaN, 5), 0);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('clone methods');

//   (function() {
//     function Foo() {
//       this.a = 1;
//     }
//     Foo.prototype.b = 1;
//     Foo.c = function() {};

//     if (Map) {
//       var map = new Map;
//       map.set('a', 1);
//       map.set('b', 2);
//     }
//     if (Set) {
//       var set = new Set;
//       set.add(1);
//       set.add(2);
//     }
//     var objects = {
//       '`arguments` objects': arguments,
//       'arrays': ['a', ''],
//       'array-like objects': { '0': 'a', 'length': 1 },
//       'booleans': false,
//       'boolean objects': Object(false),
//       'date objects': new Date,
//       'Foo instances': new Foo,
//       'objects': { 'a': 0, 'b': 1, 'c': 2 },
//       'objects with object values': { 'a': /a/, 'b': ['B'], 'c': { 'C': 1 } },
//       'objects from another document': realm.object || {},
//       'maps': map,
//       'null values': null,
//       'numbers': 0,
//       'number objects': Object(0),
//       'regexes': /a/gim,
//       'sets': set,
//       'strings': 'a',
//       'string objects': Object('a'),
//       'undefined values': undefined
//     };

//     objects.arrays.length = 3;

//     var uncloneable = {
//       'DOM elements': body,
//       'functions': Foo,
//       'async functions': asyncFunc,
//       'generator functions': genFunc,
//       'the `Proxy` constructor': Proxy
//     };

//     lodashStable.each(errors, function(error) {
//       uncloneable[error.name + 's'] = error;
//     });

//     QUnit.test('`_.clone` should perform a shallow clone', function(assert) {
//       assert.expect(2);

//       var array = [{ 'a': 0 }, { 'b': 1 }],
//           actual = _.clone(array);

//       assert.deepEqual(actual, array);
//       assert.ok(actual !== array && actual[0] === array[0]);
//     });

//     QUnit.test('`_.cloneDeep` should deep clone objects with circular references', function(assert) {
//       assert.expect(1);

//       var object = {
//         'foo': { 'b': { 'c': { 'd': {} } } },
//         'bar': {}
//       };

//       object.foo.b.c.d = object;
//       object.bar.b = object.foo.b;

//       var actual = _.cloneDeep(object);
//       assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object);
//     });

//     QUnit.test('`_.cloneDeep` should deep clone objects with lots of circular references', function(assert) {
//       assert.expect(2);

//       var cyclical = {};
//       lodashStable.times(LARGE_ARRAY_SIZE + 1, function(index) {
//         cyclical['v' + index] = [index ? cyclical['v' + (index - 1)] : cyclical];
//       });

//       var clone = _.cloneDeep(cyclical),
//           actual = clone['v' + LARGE_ARRAY_SIZE][0];

//       assert.strictEqual(actual, clone['v' + (LARGE_ARRAY_SIZE - 1)]);
//       assert.notStrictEqual(actual, cyclical['v' + (LARGE_ARRAY_SIZE - 1)]);
//     });

//     QUnit.test('`_.cloneDeepWith` should provide `stack` to `customizer`', function(assert) {
//       assert.expect(1);

//       var actual;

//       _.cloneDeepWith({ 'a': 1 }, function() {
//         actual = _.last(arguments);
//       });

//       assert.ok(isNpm
//         ? actual.constructor.name == 'Stack'
//         : actual instanceof mapCaches.Stack
//       );
//     });

//     lodashStable.each(['clone', 'cloneDeep'], function(methodName) {
//       var func = _[methodName],
//           isDeep = methodName == 'cloneDeep';

//       lodashStable.forOwn(objects, function(object, kind) {
//         QUnit.test('`_.' + methodName + '` should clone ' + kind, function(assert) {
//           assert.expect(2);

//           var actual = func(object);
//           assert.ok(lodashStable.isEqual(actual, object));

//           if (lodashStable.isObject(object)) {
//             assert.notStrictEqual(actual, object);
//           } else {
//             assert.strictEqual(actual, object);
//           }
//         });
//       });

//       QUnit.test('`_.' + methodName + '` should clone array buffers', function(assert) {
//         assert.expect(2);

//         if (ArrayBuffer) {
//           var actual = func(arrayBuffer);
//           assert.strictEqual(actual.byteLength, arrayBuffer.byteLength);
//           assert.notStrictEqual(actual, arrayBuffer);
//         }
//         else {
//           skipAssert(assert, 2);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should clone buffers', function(assert) {
//         assert.expect(4);

//         if (Buffer) {
//           var buffer = new Buffer([1, 2]),
//               actual = func(buffer);

//           assert.strictEqual(actual.byteLength, buffer.byteLength);
//           assert.strictEqual(actual.inspect(), buffer.inspect());
//           assert.notStrictEqual(actual, buffer);

//           buffer[0] = 2;
//           assert.strictEqual(actual[0], isDeep ? 2 : 1);
//         }
//         else {
//           skipAssert(assert, 4);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should clone `index` and `input` array properties', function(assert) {
//         assert.expect(2);

//         var array = /c/.exec('abcde'),
//             actual = func(array);

//         assert.strictEqual(actual.index, 2);
//         assert.strictEqual(actual.input, 'abcde');
//       });

//       QUnit.test('`_.' + methodName + '` should clone `lastIndex` regexp property', function(assert) {
//         assert.expect(1);

//         var regexp = /c/g;
//         regexp.exec('abcde');

//         assert.strictEqual(func(regexp).lastIndex, 3);
//       });

//       QUnit.test('`_.' + methodName + '` should clone expando properties', function(assert) {
//         assert.expect(1);

//         var values = lodashStable.map([false, true, 1, 'a'], function(value) {
//           var object = Object(value);
//           object.a = 1;
//           return object;
//         });

//         var expected = lodashStable.map(values, stubTrue);

//         var actual = lodashStable.map(values, function(value) {
//           return func(value).a === 1;
//         });

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should clone prototype objects', function(assert) {
//         assert.expect(2);

//         var actual = func(Foo.prototype);

//         assert.notOk(actual instanceof Foo);
//         assert.deepEqual(actual, { 'b': 1 });
//       });

//       QUnit.test('`_.' + methodName + '` should set the `[[Prototype]]` of a clone', function(assert) {
//         assert.expect(1);

//         assert.ok(func(new Foo) instanceof Foo);
//       });

//       QUnit.test('`_.' + methodName + '` should set the `[[Prototype]]` of a clone even when the `constructor` is incorrect', function(assert) {
//         assert.expect(1);

//         Foo.prototype.constructor = Object;
//         assert.ok(func(new Foo) instanceof Foo);
//         Foo.prototype.constructor = Foo;
//       });

//       QUnit.test('`_.' + methodName + '` should ensure `value` constructor is a function before using its `[[Prototype]]`', function(assert) {
//         assert.expect(1);

//         Foo.prototype.constructor = null;
//         assert.notOk(func(new Foo) instanceof Foo);
//         Foo.prototype.constructor = Foo;
//       });

//       QUnit.test('`_.' + methodName + '` should clone properties that shadow those on `Object.prototype`', function(assert) {
//         assert.expect(2);

//         var object = {
//           'constructor': objectProto.constructor,
//           'hasOwnProperty': objectProto.hasOwnProperty,
//           'isPrototypeOf': objectProto.isPrototypeOf,
//           'propertyIsEnumerable': objectProto.propertyIsEnumerable,
//           'toLocaleString': objectProto.toLocaleString,
//           'toString': objectProto.toString,
//           'valueOf': objectProto.valueOf
//         };

//         var actual = func(object);

//         assert.deepEqual(actual, object);
//         assert.notStrictEqual(actual, object);
//       });

//       QUnit.test('`_.' + methodName + '` should clone symbol properties', function(assert) {
//         assert.expect(7);

//         function Foo() {
//           this[symbol] = { 'c': 1 };
//         }

//         if (Symbol) {
//           var symbol2 = Symbol('b');
//           Foo.prototype[symbol2] = 2;

//           var symbol3 = Symbol('c');
//           defineProperty(Foo.prototype, symbol3, {
//             'configurable': true,
//             'enumerable': false,
//             'writable': true,
//             'value': 3
//           });

//           var object = { 'a': { 'b': new Foo } };
//           object[symbol] = { 'b': 1 };

//           var actual = func(object);
//           if (isDeep) {
//             assert.notStrictEqual(actual[symbol], object[symbol]);
//             assert.notStrictEqual(actual.a, object.a);
//           } else {
//             assert.strictEqual(actual[symbol], object[symbol]);
//             assert.strictEqual(actual.a, object.a);
//           }
//           assert.deepEqual(actual[symbol], object[symbol]);
//           assert.deepEqual(getSymbols(actual.a.b), [symbol]);
//           assert.deepEqual(actual.a.b[symbol], object.a.b[symbol]);
//           assert.deepEqual(actual.a.b[symbol2], object.a.b[symbol2]);
//           assert.deepEqual(actual.a.b[symbol3], object.a.b[symbol3]);
//         }
//         else {
//           skipAssert(assert, 7);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should clone symbol objects', function(assert) {
//         assert.expect(4);

//         if (Symbol) {
//           assert.strictEqual(func(symbol), symbol);

//           var object = Object(symbol),
//               actual = func(object);

//           assert.strictEqual(typeof actual, 'object');
//           assert.strictEqual(typeof actual.valueOf(), 'symbol');
//           assert.notStrictEqual(actual, object);
//         }
//         else {
//           skipAssert(assert, 4);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should not clone symbol primitives', function(assert) {
//         assert.expect(1);

//         if (Symbol) {
//           assert.strictEqual(func(symbol), symbol);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should not error on DOM elements', function(assert) {
//         assert.expect(1);

//         if (document) {
//           var element = document.createElement('div');

//           try {
//             assert.deepEqual(func(element), {});
//           } catch (e) {
//             assert.ok(false, e.message);
//           }
//         }
//         else {
//           skipAssert(assert);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should create an object from the same realm as `value`', function(assert) {
//         assert.expect(1);

//         var props = [];

//         var objects = lodashStable.transform(_, function(result, value, key) {
//           if (lodashStable.startsWith(key, '_') && lodashStable.isObject(value) &&
//               !lodashStable.isArguments(value) && !lodashStable.isElement(value) &&
//               !lodashStable.isFunction(value)) {
//             props.push(lodashStable.capitalize(lodashStable.camelCase(key)));
//             result.push(value);
//           }
//         }, []);

//         var expected = lodashStable.map(objects, stubTrue);

//         var actual = lodashStable.map(objects, function(object) {
//           var Ctor = object.constructor,
//               result = func(object);

//           return result !== object && ((result instanceof Ctor) || !(new Ctor instanceof Ctor));
//         });

//         assert.deepEqual(actual, expected, props.join(', '));
//       });

//       QUnit.test('`_.' + methodName + '` should perform a ' + (isDeep ? 'deep' : 'shallow') + ' clone when used as an iteratee for methods like `_.map`', function(assert) {
//         assert.expect(2);

//         var expected = [{ 'a': [0] }, { 'b': [1] }],
//             actual = lodashStable.map(expected, func);

//         assert.deepEqual(actual, expected);

//         if (isDeep) {
//           assert.ok(actual[0] !== expected[0] && actual[0].a !== expected[0].a && actual[1].b !== expected[1].b);
//         } else {
//           assert.ok(actual[0] !== expected[0] && actual[0].a === expected[0].a && actual[1].b === expected[1].b);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should return a unwrapped value when chaining', function(assert) {
//         assert.expect(2);

//         if (!isNpm) {
//           var object = objects.objects,
//               actual = _(object)[methodName]();

//           assert.deepEqual(actual, object);
//           assert.notStrictEqual(actual, object);
//         }
//         else {
//           skipAssert(assert, 2);
//         }
//       });

//       lodashStable.each(arrayViews, function(type) {
//         QUnit.test('`_.' + methodName + '` should clone ' + type + ' values', function(assert) {
//           assert.expect(10);

//           var Ctor = root[type];

//           lodashStable.times(2, function(index) {
//             if (Ctor) {
//               var buffer = new ArrayBuffer(24),
//                   view = index ? new Ctor(buffer, 8, 1) : new Ctor(buffer),
//                   actual = func(view);

//               assert.deepEqual(actual, view);
//               assert.notStrictEqual(actual, view);
//               assert.strictEqual(actual.buffer === view.buffer, !isDeep);
//               assert.strictEqual(actual.byteOffset, view.byteOffset);
//               assert.strictEqual(actual.length, view.length);
//             }
//             else {
//               skipAssert(assert, 5);
//             }
//           });
//         });
//       });

//       lodashStable.forOwn(uncloneable, function(value, key) {
//         QUnit.test('`_.' + methodName + '` should not clone ' + key, function(assert) {
//           assert.expect(3);

//           if (value) {
//             var object = { 'a': value, 'b': { 'c': value } },
//                 actual = func(object),
//                 expected = value === Foo ? { 'c': Foo.c } : {};

//             assert.deepEqual(actual, object);
//             assert.notStrictEqual(actual, object);
//             assert.deepEqual(func(value), expected);
//           }
//           else {
//             skipAssert(assert, 3);
//           }
//         });
//       });
//     });

//     lodashStable.each(['cloneWith', 'cloneDeepWith'], function(methodName) {
//       var func = _[methodName],
//           isDeep = methodName == 'cloneDeepWith';

//       QUnit.test('`_.' + methodName + '` should provide correct `customizer` arguments', function(assert) {
//         assert.expect(1);

//         var argsList = [],
//             object = new Foo;

//         func(object, function() {
//           var length = arguments.length,
//               args = slice.call(arguments, 0, length - (length > 1 ? 1 : 0));

//           argsList.push(args);
//         });

//         assert.deepEqual(argsList, isDeep ? [[object], [1, 'a', object]] : [[object]]);
//       });

//       QUnit.test('`_.' + methodName + '` should handle cloning when `customizer` returns `undefined`', function(assert) {
//         assert.expect(1);

//         var actual = func({ 'a': { 'b': 'c' } }, noop);
//         assert.deepEqual(actual, { 'a': { 'b': 'c' } });
//       });

//       lodashStable.forOwn(uncloneable, function(value, key) {
//         QUnit.test('`_.' + methodName + '` should work with a `customizer` callback and ' + key, function(assert) {
//           assert.expect(3);

//           var customizer = function(value) {
//             return lodashStable.isPlainObject(value) ? undefined : value;
//           };

//           var actual = func(value, customizer);
//           assert.strictEqual(actual, value);

//           var object = { 'a': value, 'b': { 'c': value } };
//           actual = func(object, customizer);

//           assert.deepEqual(actual, object);
//           assert.notStrictEqual(actual, object);
//         });
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.compact');

//   (function() {
//     var largeArray = lodashStable.range(LARGE_ARRAY_SIZE).concat(null);

//     QUnit.test('should filter falsey values', function(assert) {
//       assert.expect(1);

//       var array = ['0', '1', '2'];
//       assert.deepEqual(_.compact(falsey.concat(array)), array);
//     });

//     QUnit.test('should work when in-between lazy operators', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var actual = _(falsey).thru(_.slice).compact().thru(_.slice).value();
//         assert.deepEqual(actual, []);

//         actual = _(falsey).thru(_.slice).push(true, 1).compact().push('a').value();
//         assert.deepEqual(actual, [true, 1, 'a']);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var actual = _(largeArray).slice(1).compact().reverse().take().value();
//         assert.deepEqual(actual, _.take(_.compact(_.slice(largeArray, 1)).reverse()));
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should work in a lazy sequence with a custom `_.iteratee`', function(assert) {
//       assert.expect(1);

//       if (!isModularize) {
//         var iteratee = _.iteratee,
//             pass = false;

//         _.iteratee = identity;

//         try {
//           var actual = _(largeArray).slice(1).compact().value();
//           pass = lodashStable.isEqual(actual, _.compact(_.slice(largeArray, 1)));
//         } catch (e) {console.log(e);}

//         assert.ok(pass);
//         _.iteratee = iteratee;
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.concat');

//   (function() {
//     QUnit.test('should shallow clone `array`', function(assert) {
//       assert.expect(2);

//       var array = [1, 2, 3],
//           actual = _.concat(array);

//       assert.deepEqual(actual, array);
//       assert.notStrictEqual(actual, array);
//     });

//     QUnit.test('should concat arrays and values', function(assert) {
//       assert.expect(2);

//       var array = [1],
//           actual = _.concat(array, 2, [3], [[4]]);

//       assert.deepEqual(actual, [1, 2, 3, [4]]);
//       assert.deepEqual(array, [1]);
//     });

//     QUnit.test('should cast non-array `array` values to arrays', function(assert) {
//       assert.expect(2);

//       var values = [, null, undefined, false, true, 1, NaN, 'a'];

//       var expected = lodashStable.map(values, function(value, index) {
//         return index ? [value] : [];
//       });

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.concat(value) : _.concat();
//       });

//       assert.deepEqual(actual, expected);

//       expected = lodashStable.map(values, function(value) {
//         return [value, 2, [3]];
//       });

//       actual = lodashStable.map(values, function(value) {
//         return _.concat(value, [2], [[3]]);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should treat sparse arrays as dense', function(assert) {
//       assert.expect(3);

//       var expected = [],
//           actual = _.concat(Array(1), Array(1));

//       expected.push(undefined, undefined);

//       assert.ok('0'in actual);
//       assert.ok('1' in actual);
//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return a new wrapped array', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var array = [1],
//             wrapped = _(array).concat([2, 3]),
//             actual = wrapped.value();

//         assert.deepEqual(array, [1]);
//         assert.deepEqual(actual, [1, 2, 3]);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.cond');

//   (function() {
//     QUnit.test('should create a conditional function', function(assert) {
//       assert.expect(3);

//       var cond = _.cond([
//         [lodashStable.matches({ 'a': 1 }),     stubA],
//         [lodashStable.matchesProperty('b', 1), stubB],
//         [lodashStable.property('c'),           stubC]
//       ]);

//       assert.strictEqual(cond({ 'a':  1, 'b': 2, 'c': 3 }), 'a');
//       assert.strictEqual(cond({ 'a':  0, 'b': 1, 'c': 2 }), 'b');
//       assert.strictEqual(cond({ 'a': -1, 'b': 0, 'c': 1 }), 'c');
//     });

//     QUnit.test('should provide arguments to functions', function(assert) {
//       assert.expect(2);

//       var args1,
//           args2,
//           expected = ['a', 'b', 'c'];

//       var cond = _.cond([[
//         function() { args1 || (args1 = slice.call(arguments)); return true; },
//         function() { args2 || (args2 = slice.call(arguments)); }
//       ]]);

//       cond('a', 'b', 'c');

//       assert.deepEqual(args1, expected);
//       assert.deepEqual(args2, expected);
//     });

//     QUnit.test('should work with predicate shorthands', function(assert) {
//       assert.expect(3);

//       var cond = _.cond([
//         [{ 'a': 1 }, stubA],
//         [['b', 1],   stubB],
//         ['c',        stubC]
//       ]);

//       assert.strictEqual(cond({ 'a':  1, 'b': 2, 'c': 3 }), 'a');
//       assert.strictEqual(cond({ 'a':  0, 'b': 1, 'c': 2 }), 'b');
//       assert.strictEqual(cond({ 'a': -1, 'b': 0, 'c': 1 }), 'c');
//     });

//     QUnit.test('should return `undefined` when no condition is met', function(assert) {
//       assert.expect(1);

//       var cond = _.cond([[stubFalse, stubA]]);
//       assert.strictEqual(cond({ 'a': 1 }), undefined);
//     });

//     QUnit.test('should throw a TypeError if `pairs` is not composed of functions', function(assert) {
//       assert.expect(2);

//       lodashStable.each([false, true], function(value) {
//         assert.raises(function() { _.cond([[stubTrue, value]])(); }, TypeError);
//       });
//     });

//     QUnit.test('should use `this` binding of function for `pairs`', function(assert) {
//       assert.expect(1);

//       var cond = _.cond([
//         [function(a) { return this[a]; }, function(a, b) { return this[b]; }]
//       ]);

//       var object = { 'cond': cond, 'a': 1, 'b': 2 };
//       assert.strictEqual(object.cond('a', 'b'), 2);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.conforms');

//   (function() {
//     QUnit.test('should not change behavior if `source` is modified', function(assert) {
//       assert.expect(2);

//       var object = { 'a': 2 },
//           source = { 'a': function(value) { return value > 1; } },
//           par = _.conforms(source);

//       assert.strictEqual(par(object), true);

//       source.a = function(value) { return value < 2; };
//       assert.strictEqual(par(object), true);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('conforms methods');

//   lodashStable.each(['conforms', 'conformsTo'], function(methodName) {
//     var isConforms = methodName == 'conforms';

//     function conforms(source) {
//       return isConforms ? _.conforms(source) : function(object) {
//         return _.conformsTo(object, source);
//       };
//     }

//     QUnit.test('`_.' + methodName + '` should check if `object` conforms to `source`', function(assert) {
//       assert.expect(2);

//       var objects = [
//         { 'a': 1, 'b': 8 },
//         { 'a': 2, 'b': 4 },
//         { 'a': 3, 'b': 16 }
//       ];

//       var par = conforms({
//         'b': function(value) { return value > 4; }
//       });

//       var actual = lodashStable.filter(objects, par);
//       assert.deepEqual(actual, [objects[0], objects[2]]);

//       par = conforms({
//         'b': function(value) { return value > 8; },
//         'a': function(value) { return value > 1; }
//       });

//       actual = lodashStable.filter(objects, par);
//       assert.deepEqual(actual, [objects[2]]);
//     });

//     QUnit.test('`_.' + methodName + '` should not match by inherited `source` properties', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = function(value) {
//           return value > 1;
//         };
//       }
//       Foo.prototype.b = function(value) {
//         return value > 8;
//       };

//       var objects = [
//         { 'a': 1, 'b': 8 },
//         { 'a': 2, 'b': 4 },
//         { 'a': 3, 'b': 16 }
//       ];

//       var par = conforms(new Foo),
//           actual = lodashStable.filter(objects, par);

//       assert.deepEqual(actual, [objects[1], objects[2]]);
//     });

//     QUnit.test('`_.' + methodName + '` should not invoke `source` predicates for missing `object` properties', function(assert) {
//       assert.expect(2);

//       var count = 0;

//       var par = conforms({
//         'a': function() { count++; return true; }
//       });

//       assert.strictEqual(par({}), false);
//       assert.strictEqual(count, 0);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a function for `object`', function(assert) {
//       assert.expect(2);

//       function Foo() {}
//       Foo.a = 1;

//       function Bar() {}
//       Bar.a = 2;

//       var par = conforms({
//         'a': function(value) { return value > 1; }
//       });

//       assert.strictEqual(par(Foo), false);
//       assert.strictEqual(par(Bar), true);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a function for `source`', function(assert) {
//       assert.expect(1);

//       function Foo() {}
//       Foo.a = function(value) { return value > 1; };

//       var objects = [{ 'a': 1 }, { 'a': 2 }],
//           actual = lodashStable.filter(objects, conforms(Foo));

//       assert.deepEqual(actual, [objects[1]]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a non-plain `object`', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.b = 2;

//       var par = conforms({
//         'b': function(value) { return value > 1; }
//       });

//       assert.strictEqual(par(new Foo), true);
//     });

//     QUnit.test('`_.' + methodName + '` should return `false` when `object` is nullish', function(assert) {
//       assert.expect(1);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, stubFalse);

//       var par = conforms({
//         'a': function(value) { return value > 1; }
//       });

//       var actual = lodashStable.map(values, function(value, index) {
//         try {
//           return index ? par(value) : par();
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should return `true` when comparing an empty `source` to a nullish `object`', function(assert) {
//       assert.expect(1);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, stubTrue),
//           par = conforms({});

//       var actual = lodashStable.map(values, function(value, index) {
//         try {
//           return index ? par(value) : par();
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should return `true` when comparing an empty `source`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 1 },
//           expected = lodashStable.map(empties, stubTrue);

//       var actual = lodashStable.map(empties, function(value) {
//         var par = conforms(value);
//         return par(object);
//       });

//       assert.deepEqual(actual, expected);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.constant');

//   (function() {
//     QUnit.test('should create a function that returns `value`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 1 },
//           values = Array(2).concat(empties, true, 1, 'a'),
//           constant = _.constant(object);

//       var results = lodashStable.map(values, function(value, index) {
//         if (index < 2) {
//           return index ? constant.call({}) : constant();
//         }
//         return constant(value);
//       });

//       assert.ok(lodashStable.every(results, function(result) {
//         return result === object;
//       }));
//     });

//     QUnit.test('should work with falsey values', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubTrue);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         var constant = index ? _.constant(value) : _.constant(),
//             result = constant();

//         return (result === value) || (result !== result && value !== value);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var wrapped = _(true).constant();
//         assert.ok(wrapped instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.countBy');

//   (function() {
//     var array = [6.1, 4.2, 6.3];

//     QUnit.test('should transform keys by `iteratee`', function(assert) {
//       assert.expect(1);

//       var actual = _.countBy(array, Math.floor);
//       assert.deepEqual(actual, { '4': 1, '6': 2 });
//     });

//     QUnit.test('should use `_.identity` when `iteratee` is nullish', function(assert) {
//       assert.expect(1);

//       var array = [4, 6, 6],
//           values = [, null, undefined],
//           expected = lodashStable.map(values, lodashStable.constant({ '4': 1, '6':  2 }));

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.countBy(array, value) : _.countBy(array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       var actual = _.countBy(['one', 'two', 'three'], 'length');
//       assert.deepEqual(actual, { '3': 2, '5': 1 });
//     });

//     QUnit.test('should only add values to own, not inherited, properties', function(assert) {
//       assert.expect(2);

//       var actual = _.countBy(array, function(n) {
//         return Math.floor(n) > 4 ? 'hasOwnProperty' : 'constructor';
//       });

//       assert.deepEqual(actual.constructor, 1);
//       assert.deepEqual(actual.hasOwnProperty, 2);
//     });

//     QUnit.test('should work with a number for `iteratee`', function(assert) {
//       assert.expect(2);

//       var array = [
//         [1, 'a'],
//         [2, 'a'],
//         [2, 'b']
//       ];

//       assert.deepEqual(_.countBy(array, 0), { '1': 1, '2': 2 });
//       assert.deepEqual(_.countBy(array, 1), { 'a': 2, 'b': 1 });
//     });

//     QUnit.test('should work with an object for `collection`', function(assert) {
//       assert.expect(1);

//       var actual = _.countBy({ 'a': 6.1, 'b': 4.2, 'c': 6.3 }, Math.floor);
//       assert.deepEqual(actual, { '4': 1, '6': 2 });
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var array = lodashStable.range(LARGE_ARRAY_SIZE).concat(
//           lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 2), LARGE_ARRAY_SIZE),
//           lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 1.5), LARGE_ARRAY_SIZE)
//         );

//         var actual = _(array).countBy().map(square).filter(isEven).take().value();

//         assert.deepEqual(actual, _.take(_.filter(_.map(_.countBy(array), square), isEven)));
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.create');

//   (function() {
//     function Shape() {
//       this.x = 0;
//       this.y = 0;
//     }

//     function Circle() {
//       Shape.call(this);
//     }

//     QUnit.test('should create an object that inherits from the given `prototype` object', function(assert) {
//       assert.expect(3);

//       Circle.prototype = _.create(Shape.prototype);
//       Circle.prototype.constructor = Circle;

//       var actual = new Circle;

//       assert.ok(actual instanceof Circle);
//       assert.ok(actual instanceof Shape);
//       assert.notStrictEqual(Circle.prototype, Shape.prototype);
//     });

//     QUnit.test('should assign `properties` to the created object', function(assert) {
//       assert.expect(3);

//       var expected = { 'constructor': Circle, 'radius': 0 };
//       Circle.prototype = _.create(Shape.prototype, expected);

//       var actual = new Circle;

//       assert.ok(actual instanceof Circle);
//       assert.ok(actual instanceof Shape);
//       assert.deepEqual(Circle.prototype, expected);
//     });

//     QUnit.test('should assign own properties', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//         this.c = 3;
//       }
//       Foo.prototype.b = 2;

//       assert.deepEqual(_.create({}, new Foo), { 'a': 1, 'c': 3 });
//     });

//     QUnit.test('should assign properties that shadow those of `prototype`', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//       }
//       var object = _.create(new Foo, { 'a': 1 });
//       assert.deepEqual(lodashStable.keys(object), ['a']);
//     });

//     QUnit.test('should accept a falsey `prototype`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubObject);

//       var actual = lodashStable.map(falsey, function(prototype, index) {
//         return index ? _.create(prototype) : _.create();
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should ignore a primitive `prototype` and use an empty object instead', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(primitives, stubTrue);

//       var actual = lodashStable.map(primitives, function(value, index) {
//         return lodashStable.isPlainObject(index ? _.create(value) : _.create());
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [{ 'a': 1 }, { 'a': 1 }, { 'a': 1 }],
//           expected = lodashStable.map(array, stubTrue),
//           objects = lodashStable.map(array, _.create);

//       var actual = lodashStable.map(objects, function(object) {
//         return object.a === 1 && !_.keys(object).length;
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.curry');

//   (function() {
//     function fn(a, b, c, d) {
//       return slice.call(arguments);
//     }

//     QUnit.test('should curry based on the number of arguments given', function(assert) {
//       assert.expect(3);

//       var curried = _.curry(fn),
//           expected = [1, 2, 3, 4];

//       assert.deepEqual(curried(1)(2)(3)(4), expected);
//       assert.deepEqual(curried(1, 2)(3, 4), expected);
//       assert.deepEqual(curried(1, 2, 3, 4), expected);
//     });

//     QUnit.test('should allow specifying `arity`', function(assert) {
//       assert.expect(3);

//       var curried = _.curry(fn, 3),
//           expected = [1, 2, 3];

//       assert.deepEqual(curried(1)(2, 3), expected);
//       assert.deepEqual(curried(1, 2)(3), expected);
//       assert.deepEqual(curried(1, 2, 3), expected);
//     });

//     QUnit.test('should coerce `arity` to an integer', function(assert) {
//       assert.expect(2);

//       var values = ['0', 0.6, 'xyz'],
//           expected = lodashStable.map(values, stubArray);

//       var actual = lodashStable.map(values, function(arity) {
//         return _.curry(fn, arity)();
//       });

//       assert.deepEqual(actual, expected);
//       assert.deepEqual(_.curry(fn, '2')(1)(2), [1, 2]);
//     });

//     QUnit.test('should support placeholders', function(assert) {
//       assert.expect(4);

//       var curried = _.curry(fn),
//           ph = curried.placeholder;

//       assert.deepEqual(curried(1)(ph, 3)(ph, 4)(2), [1, 2, 3, 4]);
//       assert.deepEqual(curried(ph, 2)(1)(ph, 4)(3), [1, 2, 3, 4]);
//       assert.deepEqual(curried(ph, ph, 3)(ph, 2)(ph, 4)(1), [1, 2, 3, 4]);
//       assert.deepEqual(curried(ph, ph, ph, 4)(ph, ph, 3)(ph, 2)(1), [1, 2, 3, 4]);
//     });

//     QUnit.test('should persist placeholders', function(assert) {
//       assert.expect(1);

//       var curried = _.curry(fn),
//           ph = curried.placeholder,
//           actual = curried(ph, ph, ph, 'd')('a')(ph)('b')('c');

//       assert.deepEqual(actual, ['a', 'b', 'c', 'd']);
//     });

//     QUnit.test('should use `_.placeholder` when set', function(assert) {
//       assert.expect(1);

//       if (!isModularize) {
//         var curried = _.curry(fn),
//             _ph = _.placeholder = {},
//             ph = curried.placeholder;

//         assert.deepEqual(curried(1)(_ph, 3)(ph, 4), [1, ph, 3, 4]);
//         delete _.placeholder;
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should provide additional arguments after reaching the target arity', function(assert) {
//       assert.expect(3);

//       var curried = _.curry(fn, 3);
//       assert.deepEqual(curried(1)(2, 3, 4), [1, 2, 3, 4]);
//       assert.deepEqual(curried(1, 2)(3, 4, 5), [1, 2, 3, 4, 5]);
//       assert.deepEqual(curried(1, 2, 3, 4, 5, 6), [1, 2, 3, 4, 5, 6]);
//     });

//     QUnit.test('should create a function with a `length` of `0`', function(assert) {
//       assert.expect(6);

//       lodashStable.times(2, function(index) {
//         var curried = index ? _.curry(fn, 4) : _.curry(fn);
//         assert.strictEqual(curried.length, 0);
//         assert.strictEqual(curried(1).length, 0);
//         assert.strictEqual(curried(1, 2).length, 0);
//       });
//     });

//     QUnit.test('should ensure `new curried` is an instance of `func`', function(assert) {
//       assert.expect(2);

//       function Foo(value) {
//         return value && object;
//       }

//       var curried = _.curry(Foo),
//           object = {};

//       assert.ok(new curried(false) instanceof Foo);
//       assert.strictEqual(new curried(true), object);
//     });

//     QUnit.test('should use `this` binding of function', function(assert) {
//       assert.expect(9);

//       var fn = function(a, b, c) {
//         var value = this || {};
//         return [value[a], value[b], value[c]];
//       };

//       var object = { 'a': 1, 'b': 2, 'c': 3 },
//           expected = [1, 2, 3];

//       assert.deepEqual(_.curry(_.bind(fn, object), 3)('a')('b')('c'), expected);
//       assert.deepEqual(_.curry(_.bind(fn, object), 3)('a', 'b')('c'), expected);
//       assert.deepEqual(_.curry(_.bind(fn, object), 3)('a', 'b', 'c'), expected);

//       assert.deepEqual(_.bind(_.curry(fn), object)('a')('b')('c'), Array(3));
//       assert.deepEqual(_.bind(_.curry(fn), object)('a', 'b')('c'), Array(3));
//       assert.deepEqual(_.bind(_.curry(fn), object)('a', 'b', 'c'), expected);

//       object.curried = _.curry(fn);
//       assert.deepEqual(object.curried('a')('b')('c'), Array(3));
//       assert.deepEqual(object.curried('a', 'b')('c'), Array(3));
//       assert.deepEqual(object.curried('a', 'b', 'c'), expected);
//     });

//     QUnit.test('should work with partialed methods', function(assert) {
//       assert.expect(2);

//       var curried = _.curry(fn),
//           expected = [1, 2, 3, 4];

//       var a = _.partial(curried, 1),
//           b = _.bind(a, null, 2),
//           c = _.partialRight(b, 4),
//           d = _.partialRight(b(3), 4);

//       assert.deepEqual(c(3), expected);
//       assert.deepEqual(d(), expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.curryRight');

//   (function() {
//     function fn(a, b, c, d) {
//       return slice.call(arguments);
//     }

//     QUnit.test('should curry based on the number of arguments given', function(assert) {
//       assert.expect(3);

//       var curried = _.curryRight(fn),
//           expected = [1, 2, 3, 4];

//       assert.deepEqual(curried(4)(3)(2)(1), expected);
//       assert.deepEqual(curried(3, 4)(1, 2), expected);
//       assert.deepEqual(curried(1, 2, 3, 4), expected);
//     });

//     QUnit.test('should allow specifying `arity`', function(assert) {
//       assert.expect(3);

//       var curried = _.curryRight(fn, 3),
//           expected = [1, 2, 3];

//       assert.deepEqual(curried(3)(1, 2), expected);
//       assert.deepEqual(curried(2, 3)(1), expected);
//       assert.deepEqual(curried(1, 2, 3), expected);
//     });

//     QUnit.test('should coerce `arity` to an integer', function(assert) {
//       assert.expect(2);

//       var values = ['0', 0.6, 'xyz'],
//           expected = lodashStable.map(values, stubArray);

//       var actual = lodashStable.map(values, function(arity) {
//         return _.curryRight(fn, arity)();
//       });

//       assert.deepEqual(actual, expected);
//       assert.deepEqual(_.curryRight(fn, '2')(1)(2), [2, 1]);
//     });

//     QUnit.test('should support placeholders', function(assert) {
//       assert.expect(4);

//       var curried = _.curryRight(fn),
//           expected = [1, 2, 3, 4],
//           ph = curried.placeholder;

//       assert.deepEqual(curried(4)(2, ph)(1, ph)(3), expected);
//       assert.deepEqual(curried(3, ph)(4)(1, ph)(2), expected);
//       assert.deepEqual(curried(ph, ph, 4)(ph, 3)(ph, 2)(1), expected);
//       assert.deepEqual(curried(ph, ph, ph, 4)(ph, ph, 3)(ph, 2)(1), expected);
//     });

//     QUnit.test('should persist placeholders', function(assert) {
//       assert.expect(1);

//       var curried = _.curryRight(fn),
//           ph = curried.placeholder,
//           actual = curried('a', ph, ph, ph)('b')(ph)('c')('d');

//       assert.deepEqual(actual, ['a', 'b', 'c', 'd']);
//     });

//     QUnit.test('should use `_.placeholder` when set', function(assert) {
//       assert.expect(1);

//       if (!isModularize) {
//         var curried = _.curryRight(fn),
//             _ph = _.placeholder = {},
//             ph = curried.placeholder;

//         assert.deepEqual(curried(4)(2, _ph)(1, ph), [1, 2, ph, 4]);
//         delete _.placeholder;
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should provide additional arguments after reaching the target arity', function(assert) {
//       assert.expect(3);

//       var curried = _.curryRight(fn, 3);
//       assert.deepEqual(curried(4)(1, 2, 3), [1, 2, 3, 4]);
//       assert.deepEqual(curried(4, 5)(1, 2, 3), [1, 2, 3, 4, 5]);
//       assert.deepEqual(curried(1, 2, 3, 4, 5, 6), [1, 2, 3, 4, 5, 6]);
//     });

//     QUnit.test('should create a function with a `length` of `0`', function(assert) {
//       assert.expect(6);

//       lodashStable.times(2, function(index) {
//         var curried = index ? _.curryRight(fn, 4) : _.curryRight(fn);
//         assert.strictEqual(curried.length, 0);
//         assert.strictEqual(curried(4).length, 0);
//         assert.strictEqual(curried(3, 4).length, 0);
//       });
//     });

//     QUnit.test('should ensure `new curried` is an instance of `func`', function(assert) {
//       assert.expect(2);

//       function Foo(value) {
//         return value && object;
//       }

//       var curried = _.curryRight(Foo),
//           object = {};

//       assert.ok(new curried(false) instanceof Foo);
//       assert.strictEqual(new curried(true), object);
//     });

//     QUnit.test('should use `this` binding of function', function(assert) {
//       assert.expect(9);

//       var fn = function(a, b, c) {
//         var value = this || {};
//         return [value[a], value[b], value[c]];
//       };

//       var object = { 'a': 1, 'b': 2, 'c': 3 },
//           expected = [1, 2, 3];

//       assert.deepEqual(_.curryRight(_.bind(fn, object), 3)('c')('b')('a'), expected);
//       assert.deepEqual(_.curryRight(_.bind(fn, object), 3)('b', 'c')('a'), expected);
//       assert.deepEqual(_.curryRight(_.bind(fn, object), 3)('a', 'b', 'c'), expected);

//       assert.deepEqual(_.bind(_.curryRight(fn), object)('c')('b')('a'), Array(3));
//       assert.deepEqual(_.bind(_.curryRight(fn), object)('b', 'c')('a'), Array(3));
//       assert.deepEqual(_.bind(_.curryRight(fn), object)('a', 'b', 'c'), expected);

//       object.curried = _.curryRight(fn);
//       assert.deepEqual(object.curried('c')('b')('a'), Array(3));
//       assert.deepEqual(object.curried('b', 'c')('a'), Array(3));
//       assert.deepEqual(object.curried('a', 'b', 'c'), expected);
//     });

//     QUnit.test('should work with partialed methods', function(assert) {
//       assert.expect(2);

//       var curried = _.curryRight(fn),
//           expected = [1, 2, 3, 4];

//       var a = _.partialRight(curried, 4),
//           b = _.partialRight(a, 3),
//           c = _.bind(b, null, 1),
//           d = _.partial(b(2), 1);

//       assert.deepEqual(c(2), expected);
//       assert.deepEqual(d(), expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('curry methods');

//   lodashStable.each(['curry', 'curryRight'], function(methodName) {
//     var func = _[methodName],
//         fn = function(a, b) { return slice.call(arguments); },
//         isCurry = methodName == 'curry';

//     QUnit.test('`_.' + methodName + '` should not error on functions with the same name as lodash methods', function(assert) {
//       assert.expect(1);

//       function run(a, b) {
//         return a + b;
//       }

//       var curried = func(run);

//       try {
//         var actual = curried(1)(2);
//       } catch (e) {}

//       assert.strictEqual(actual, 3);
//     });

//     QUnit.test('`_.' + methodName + '` should work for function names that shadow those on `Object.prototype`', function(assert) {
//       assert.expect(1);

//       var curried = _.curry(function hasOwnProperty(a, b, c) {
//         return [a, b, c];
//       });

//       var expected = [1, 2, 3];

//       assert.deepEqual(curried(1)(2)(3), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(2);

//       var array = [fn, fn, fn],
//           object = { 'a': fn, 'b': fn, 'c': fn };

//       lodashStable.each([array, object], function(collection) {
//         var curries = lodashStable.map(collection, func),
//             expected = lodashStable.map(collection, lodashStable.constant(isCurry ? ['a', 'b'] : ['b', 'a']));

//         var actual = lodashStable.map(curries, function(curried) {
//           return curried('a')('b');
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.debounce');

//   (function() {
//     QUnit.test('should debounce a function', function(assert) {
//       assert.expect(6);

//       var done = assert.async();

//       var callCount = 0;

//       var debounced = _.debounce(function(value) {
//         ++callCount;
//         return value;
//       }, 32);

//       var results = [debounced('a'), debounced('b'), debounced('c')];
//       assert.deepEqual(results, [undefined, undefined, undefined]);
//       assert.strictEqual(callCount, 0);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 1);

//         var results = [debounced('d'), debounced('e'), debounced('f')];
//         assert.deepEqual(results, ['c', 'c', 'c']);
//         assert.strictEqual(callCount, 1);
//       }, 128);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 2);
//         done();
//       }, 256);
//     });

//     QUnit.test('subsequent debounced calls return the last `func` result', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var debounced = _.debounce(identity, 32);
//       debounced('a');

//       setTimeout(function() {
//         assert.notEqual(debounced('b'), 'b');
//       }, 64);

//       setTimeout(function() {
//         assert.notEqual(debounced('c'), 'c');
//         done();
//       }, 128);
//     });

//     QUnit.test('should not immediately call `func` when `wait` is `0`', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var callCount = 0,
//           debounced = _.debounce(function() { ++callCount; }, 0);

//       debounced();
//       debounced();
//       assert.strictEqual(callCount, 0);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 1);
//         done();
//       }, 5);
//     });

//     QUnit.test('should apply default options', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var callCount = 0,
//           debounced = _.debounce(function() { callCount++; }, 32, {});

//       debounced();
//       assert.strictEqual(callCount, 0);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 1);
//         done();
//       }, 64);
//     });

//     QUnit.test('should support a `leading` option', function(assert) {
//       assert.expect(4);

//       var done = assert.async();

//       var callCounts = [0, 0];

//       var withLeading = _.debounce(function() {
//         callCounts[0]++;
//       }, 32, { 'leading': true });

//       var withLeadingAndTrailing = _.debounce(function() {
//         callCounts[1]++;
//       }, 32, { 'leading': true });

//       withLeading();
//       assert.strictEqual(callCounts[0], 1);

//       withLeadingAndTrailing();
//       withLeadingAndTrailing();
//       assert.strictEqual(callCounts[1], 1);

//       setTimeout(function() {
//         assert.deepEqual(callCounts, [1, 2]);

//         withLeading();
//         assert.strictEqual(callCounts[0], 2);

//         done();
//       }, 64);
//     });

//     QUnit.test('subsequent leading debounced calls return the last `func` result', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var debounced = _.debounce(identity, 32, { 'leading': true, 'trailing': false }),
//           results = [debounced('a'), debounced('b')];

//       assert.deepEqual(results, ['a', 'a']);

//       setTimeout(function() {
//         var results = [debounced('c'), debounced('d')];
//         assert.deepEqual(results, ['c', 'c']);
//         done();
//       }, 64);
//     });

//     QUnit.test('should support a `trailing` option', function(assert) {
//       assert.expect(4);

//       var done = assert.async();

//       var withCount = 0,
//           withoutCount = 0;

//       var withTrailing = _.debounce(function() {
//         withCount++;
//       }, 32, { 'trailing': true });

//       var withoutTrailing = _.debounce(function() {
//         withoutCount++;
//       }, 32, { 'trailing': false });

//       withTrailing();
//       assert.strictEqual(withCount, 0);

//       withoutTrailing();
//       assert.strictEqual(withoutCount, 0);

//       setTimeout(function() {
//         assert.strictEqual(withCount, 1);
//         assert.strictEqual(withoutCount, 0);
//         done();
//       }, 64);
//     });

//     QUnit.test('should support a `maxWait` option', function(assert) {
//       assert.expect(4);

//       var done = assert.async();

//       var callCount = 0;

//       var debounced = _.debounce(function(value) {
//         ++callCount;
//         return value;
//       }, 32, { 'maxWait': 64 });

//       debounced();
//       debounced();
//       assert.strictEqual(callCount, 0);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 1);
//         debounced();
//         debounced();
//         assert.strictEqual(callCount, 1);
//       }, 128);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 2);
//         done();
//       }, 256);
//     });

//     QUnit.test('should support `maxWait` in a tight loop', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var limit = (argv || isPhantom) ? 1000 : 320,
//           withCount = 0,
//           withoutCount = 0;

//       var withMaxWait = _.debounce(function() {
//         withCount++;
//       }, 64, { 'maxWait': 128 });

//       var withoutMaxWait = _.debounce(function() {
//         withoutCount++;
//       }, 96);

//       var start = +new Date;
//       while ((new Date - start) < limit) {
//         withMaxWait();
//         withoutMaxWait();
//       }
//       var actual = [Boolean(withoutCount), Boolean(withCount)];
//       setTimeout(function() {
//         assert.deepEqual(actual, [false, true]);
//         done();
//       }, 1);
//     });

//     QUnit.test('should queue a trailing call for subsequent debounced calls after `maxWait`', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var callCount = 0;

//       var debounced = _.debounce(function() {
//         ++callCount;
//       }, 200, { 'maxWait': 200 });

//       debounced();

//       setTimeout(debounced, 190);
//       setTimeout(debounced, 200);
//       setTimeout(debounced, 210);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 2);
//         done();
//       }, 500);
//     });

//     QUnit.test('should cancel `maxDelayed` when `delayed` is invoked', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var callCount = 0;

//       var debounced = _.debounce(function() {
//         callCount++;
//       }, 32, { 'maxWait': 64 });

//       debounced();

//       setTimeout(function() {
//         debounced();
//         assert.strictEqual(callCount, 1);
//       }, 128);

//       setTimeout(function() {
//         assert.strictEqual(callCount, 2);
//         done();
//       }, 192);
//     });

//     QUnit.test('should invoke the trailing call with the correct arguments and `this` binding', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var actual,
//           callCount = 0,
//           object = {};

//       var debounced = _.debounce(function(value) {
//         actual = [this];
//         push.apply(actual, arguments);
//         return ++callCount != 2;
//       }, 32, { 'leading': true, 'maxWait': 64 });

//       while (true) {
//         if (!debounced.call(object, 'a')) {
//           break;
//         }
//       }
//       setTimeout(function() {
//         assert.strictEqual(callCount, 2);
//         assert.deepEqual(actual, [object, 'a']);
//         done();
//       }, 64);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.deburr');

//   (function() {
//     QUnit.test('should convert Latin Unicode letters to basic Latin', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map(burredLetters, _.deburr);
//       assert.deepEqual(actual, deburredLetters);
//     });

//     QUnit.test('should not deburr Latin mathematical operators', function(assert) {
//       assert.expect(1);

//       var operators = ['\xd7', '\xf7'],
//           actual = lodashStable.map(operators, _.deburr);

//       assert.deepEqual(actual, operators);
//     });

//     QUnit.test('should deburr combining diacritical marks', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(comboMarks, lodashStable.constant('ei'));

//       var actual = lodashStable.map(comboMarks, function(chr) {
//         return _.deburr('e' + chr + 'i');
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.defaults');

//   (function() {
//     QUnit.test('should assign source properties if missing on `object`', function(assert) {
//       assert.expect(1);

//       var actual = _.defaults({ 'a': 1 }, { 'a': 2, 'b': 2 });
//       assert.deepEqual(actual, { 'a': 1, 'b': 2 });
//     });

//     QUnit.test('should accept multiple sources', function(assert) {
//       assert.expect(2);

//       var expected = { 'a': 1, 'b': 2, 'c': 3 },
//           actual = _.defaults({ 'a': 1, 'b': 2 }, { 'b': 3 }, { 'c': 3 });

//       assert.deepEqual(actual, expected);

//       actual = _.defaults({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 3 }, { 'c': 2 });
//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should not overwrite `null` values', function(assert) {
//       assert.expect(1);

//       var actual = _.defaults({ 'a': null }, { 'a': 1 });
//       assert.strictEqual(actual.a, null);
//     });

//     QUnit.test('should overwrite `undefined` values', function(assert) {
//       assert.expect(1);

//       var actual = _.defaults({ 'a': undefined }, { 'a': 1 });
//       assert.strictEqual(actual.a, 1);
//     });

//     QUnit.test('should assign `undefined` values', function(assert) {
//       assert.expect(1);

//       var source = { 'a': undefined, 'b': 1 },
//           actual = _.defaults({}, source);

//       assert.deepEqual(actual, { 'a': undefined, 'b': 1 });
//     });

//     QUnit.test('should assign properties that shadow those on `Object.prototype`', function(assert) {
//       assert.expect(2);

//       var object = {
//         'constructor': objectProto.constructor,
//         'hasOwnProperty': objectProto.hasOwnProperty,
//         'isPrototypeOf': objectProto.isPrototypeOf,
//         'propertyIsEnumerable': objectProto.propertyIsEnumerable,
//         'toLocaleString': objectProto.toLocaleString,
//         'toString': objectProto.toString,
//         'valueOf': objectProto.valueOf
//       };

//       var source = {
//         'constructor': 1,
//         'hasOwnProperty': 2,
//         'isPrototypeOf': 3,
//         'propertyIsEnumerable': 4,
//         'toLocaleString': 5,
//         'toString': 6,
//         'valueOf': 7
//       };

//       var expected = lodashStable.clone(source);
//       assert.deepEqual(_.defaults({}, source), expected);

//       expected = lodashStable.clone(object);
//       assert.deepEqual(_.defaults({}, object, source), expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.defaultsDeep');

//   (function() {
//     QUnit.test('should deep assign source properties if missing on `object`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': { 'b': 2 }, 'd': 4 },
//           source = { 'a': { 'b': 3, 'c': 3 }, 'e': 5 },
//           expected = { 'a': { 'b': 2, 'c': 3 }, 'd': 4, 'e': 5 };

//       assert.deepEqual(_.defaultsDeep(object, source), expected);
//     });

//     QUnit.test('should accept multiple sources', function(assert) {
//       assert.expect(2);

//       var source1 = { 'a': { 'b': 3 } },
//           source2 = { 'a': { 'c': 3 } },
//           source3 = { 'a': { 'b': 3, 'c': 3 } },
//           source4 = { 'a': { 'c': 4 } },
//           expected = { 'a': { 'b': 2, 'c': 3 } };

//       assert.deepEqual(_.defaultsDeep({ 'a': { 'b': 2 } }, source1, source2), expected);
//       assert.deepEqual(_.defaultsDeep({ 'a': { 'b': 2 } }, source3, source4), expected);
//     });

//     QUnit.test('should not overwrite `null` values', function(assert) {
//       assert.expect(1);

//       var object = { 'a': { 'b': null } },
//           source = { 'a': { 'b': 2 } },
//           actual = _.defaultsDeep(object, source);

//       assert.strictEqual(actual.a.b, null);
//     });

//     QUnit.test('should not overwrite regexp values', function(assert) {
//       assert.expect(1);

//       var object = { 'a': { 'b': /x/ } },
//           source = { 'a': { 'b': /y/ } },
//           actual = _.defaultsDeep(object, source);

//       assert.deepEqual(actual.a.b, /x/);
//     });

//     QUnit.test('should not convert function properties to objects', function(assert) {
//       assert.expect(2);

//       var actual = _.defaultsDeep({}, { 'a': noop });
//       assert.strictEqual(actual.a, noop);

//       actual = _.defaultsDeep({}, { 'a': { 'b': noop } });
//       assert.strictEqual(actual.a.b, noop);
//     });

//     QUnit.test('should overwrite `undefined` values', function(assert) {
//       assert.expect(1);

//       var object = { 'a': { 'b': undefined } },
//           source = { 'a': { 'b': 2 } },
//           actual = _.defaultsDeep(object, source);

//       assert.strictEqual(actual.a.b, 2);
//     });

//     QUnit.test('should assign `undefined` values', function(assert) {
//       assert.expect(1);

//       var source = { 'a': undefined, 'b': { 'c': undefined, 'd': 1 } },
//           expected = lodashStable.cloneDeep(source),
//           actual = _.defaultsDeep({}, source);

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should merge sources containing circular references', function(assert) {
//       assert.expect(2);

//       var object = {
//         'foo': { 'b': { 'c': { 'd': {} } } },
//         'bar': { 'a': 2 }
//       };

//       var source = {
//         'foo': { 'b': { 'c': { 'd': {} } } },
//         'bar': {}
//       };

//       object.foo.b.c.d = object;
//       source.foo.b.c.d = source;
//       source.bar.b = source.foo.b;

//       var actual = _.defaultsDeep(object, source);

//       assert.strictEqual(actual.bar.b, actual.foo.b);
//       assert.strictEqual(actual.foo.b.c.d, actual.foo.b.c.d.foo.b.c.d);
//     });

//     QUnit.test('should not modify sources', function(assert) {
//       assert.expect(3);

//       var source1 = { 'a': 1, 'b': { 'c': 2 } },
//           source2 = { 'b': { 'c': 3, 'd': 3 } },
//           actual = _.defaultsDeep({}, source1, source2);

//       assert.deepEqual(actual, { 'a': 1, 'b': { 'c': 2, 'd': 3 } });
//       assert.deepEqual(source1, { 'a': 1, 'b': { 'c': 2 } });
//       assert.deepEqual(source2, { 'b': { 'c': 3, 'd': 3 } });
//     });

//     QUnit.test('should not attempt a merge of a string into an array', function(assert) {
//       assert.expect(1);

//       var actual = _.defaultsDeep({ 'a': ['abc'] }, { 'a': 'abc' });
//       assert.deepEqual(actual.a, ['abc']);
//     });

//     QUnit.test('should not indirectly merge `Object` properties', function(assert) {
//       assert.expect(1);

//       _.defaultsDeep({}, { 'constructor': { 'a': 1 } });

//       var actual = 'a' in Object;
//       delete Object.a;

//       assert.notOk(actual);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.defaultTo');

//   (function() {
//     QUnit.test('should return a default value if `value` is `NaN` or nullish', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, function(value) {
//         return (value == null || value !== value) ? 1 : value;
//       });

//       var actual = lodashStable.map(falsey, function(value) {
//         return _.defaultTo(value, 1);
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.defer');

//   (function() {
//     QUnit.test('should defer `func` execution', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var pass = false;
//       _.defer(function() { pass = true; });

//       setTimeout(function() {
//         assert.ok(pass);
//         done();
//       }, 32);
//     });

//     QUnit.test('should provide additional arguments to `func`', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var args;

//       _.defer(function() {
//         args = slice.call(arguments);
//       }, 1, 2);

//       setTimeout(function() {
//         assert.deepEqual(args, [1, 2]);
//         done();
//       }, 32);
//     });

//     QUnit.test('should be cancelable', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var pass = true,
//           timerId = _.defer(function() { pass = false; });

//       clearTimeout(timerId);

//       setTimeout(function() {
//         assert.ok(pass);
//         done();
//       }, 32);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.delay');

//   (function() {
//     QUnit.test('should delay `func` execution', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var pass = false;
//       _.delay(function() { pass = true; }, 32);

//       setTimeout(function() {
//         assert.notOk(pass);
//       }, 1);

//       setTimeout(function() {
//         assert.ok(pass);
//         done();
//       }, 64);
//     });

//     QUnit.test('should provide additional arguments to `func`', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var args;

//       _.delay(function() {
//         args = slice.call(arguments);
//       }, 32, 1, 2);

//       setTimeout(function() {
//         assert.deepEqual(args, [1, 2]);
//         done();
//       }, 64);
//     });

//     QUnit.test('should use a default `wait` of `0`', function(assert) {
//       assert.expect(2);

//       var done = assert.async();

//       var pass = false;
//       _.delay(function() { pass = true; });

//       assert.notOk(pass);

//       setTimeout(function() {
//         assert.ok(pass);
//         done();
//       }, 0);
//     });

//     QUnit.test('should be cancelable', function(assert) {
//       assert.expect(1);

//       var done = assert.async();

//       var pass = true,
//           timerId = _.delay(function() { pass = false; }, 32);

//       clearTimeout(timerId);

//       setTimeout(function() {
//         assert.ok(pass);
//         done();
//       }, 64);
//     });

//     QUnit.test('should work with mocked `setTimeout`', function(assert) {
//       assert.expect(1);

//       if (!isPhantom) {
//         var pass = false,
//             setTimeout = root.setTimeout;

//         setProperty(root, 'setTimeout', function(func) { func(); });
//         _.delay(function() { pass = true; }, 32);
//         setProperty(root, 'setTimeout', setTimeout);

//         assert.ok(pass);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('difference methods');

//   lodashStable.each(['difference', 'differenceBy', 'differenceWith'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should return the difference of two arrays', function(assert) {
//       assert.expect(1);

//       var actual = func([2, 1], [2, 3]);
//       assert.deepEqual(actual, [1]);
//     });

//     QUnit.test('`_.' + methodName + '` should return the difference of multiple arrays', function(assert) {
//       assert.expect(1);

//       var actual = func([2, 1, 2, 3], [3, 4], [3, 2]);
//       assert.deepEqual(actual, [1]);
//     });

//     QUnit.test('`_.' + methodName + '` should treat `-0` as `0`', function(assert) {
//       assert.expect(2);

//       var array = [-0, 0];

//       var actual = lodashStable.map(array, function(value) {
//         return func(array, [value]);
//       });

//       assert.deepEqual(actual, [[], []]);

//       actual = lodashStable.map(func([-0, 1], [1]), lodashStable.toString);
//       assert.deepEqual(actual, ['0']);
//     });

//     QUnit.test('`_.' + methodName + '` should match `NaN`', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(func([1, NaN, 3], [NaN, 5, NaN]), [1, 3]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays', function(assert) {
//       assert.expect(1);

//       var array1 = lodashStable.range(LARGE_ARRAY_SIZE + 1),
//           array2 = lodashStable.range(LARGE_ARRAY_SIZE),
//           a = {},
//           b = {},
//           c = {};

//       array1.push(a, b, c);
//       array2.push(b, c, a);

//       assert.deepEqual(func(array1, array2), [LARGE_ARRAY_SIZE]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of `-0` as `0`', function(assert) {
//       assert.expect(2);

//       var array = [-0, 0];

//       var actual = lodashStable.map(array, function(value) {
//         var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, lodashStable.constant(value));
//         return func(array, largeArray);
//       });

//       assert.deepEqual(actual, [[], []]);

//       var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, stubOne);
//       actual = lodashStable.map(func([-0, 1], largeArray), lodashStable.toString);
//       assert.deepEqual(actual, ['0']);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of `NaN`', function(assert) {
//       assert.expect(1);

//       var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, stubNaN);
//       assert.deepEqual(func([1, NaN, 3], largeArray), [1, 3]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of objects', function(assert) {
//       assert.expect(1);

//       var object1 = {},
//           object2 = {},
//           largeArray = lodashStable.times(LARGE_ARRAY_SIZE, lodashStable.constant(object1));

//       assert.deepEqual(func([object1, object2], largeArray), [object2]);
//     });

//     QUnit.test('`_.' + methodName + '` should ignore values that are not array-like', function(assert) {
//       assert.expect(3);

//       var array = [1, null, 3];

//       assert.deepEqual(func(args, 3, { '0': 1 }), [1, 2, 3]);
//       assert.deepEqual(func(null, array, 1), []);
//       assert.deepEqual(func(array, args, null), [null]);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.differenceBy');

//   (function() {
//     QUnit.test('should accept an `iteratee`', function(assert) {
//       assert.expect(2);

//       var actual = _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
//       assert.deepEqual(actual, [1.2]);

//       actual = _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
//       assert.deepEqual(actual, [{ 'x': 2 }]);
//     });

//     QUnit.test('should provide correct `iteratee` arguments', function(assert) {
//       assert.expect(1);

//       var args;

//       _.differenceBy([2.1, 1.2], [2.3, 3.4], function() {
//         args || (args = slice.call(arguments));
//       });

//       assert.deepEqual(args, [2.3]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.differenceWith');

//   (function() {
//     QUnit.test('should work with a `comparator`', function(assert) {
//       assert.expect(1);

//       var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }],
//           actual = _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], lodashStable.isEqual);

//       assert.deepEqual(actual, [objects[1]]);
//     });

//     QUnit.test('should preserve the sign of `0`', function(assert) {
//       assert.expect(1);

//       var array = [-0, 1],
//           largeArray = lodashStable.times(LARGE_ARRAY_SIZE, stubOne),
//           others = [[1], largeArray],
//           expected = lodashStable.map(others, lodashStable.constant(['-0']));

//       var actual = lodashStable.map(others, function(other) {
//         return lodashStable.map(_.differenceWith(array, other, lodashStable.eq), lodashStable.toString);
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.divide');

//   (function() {
//     QUnit.test('should divide two numbers', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.divide(6, 4), 1.5);
//       assert.strictEqual(_.divide(-6, 4), -1.5);
//       assert.strictEqual(_.divide(-6, -4), 1.5);
//     });

//     QUnit.test('should coerce arguments to numbers', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.divide('6', '4'), 1.5);
//       assert.deepEqual(_.divide('x', 'y'), NaN);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.drop');

//   (function() {
//     var array = [1, 2, 3];

//     QUnit.test('should drop the first two elements', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.drop(array, 2), [3]);
//     });

//     QUnit.test('should treat falsey `n` values, except `undefined`, as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === undefined ? [2, 3] : array;
//       });

//       var actual = lodashStable.map(falsey, function(n) {
//         return _.drop(array, n);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return all elements when `n` < `1`', function(assert) {
//       assert.expect(3);

//       lodashStable.each([0, -1, -Infinity], function(n) {
//         assert.deepEqual(_.drop(array, n), array);
//       });
//     });

//     QUnit.test('should return an empty array when `n` >= `length`', function(assert) {
//       assert.expect(4);

//       lodashStable.each([3, 4, Math.pow(2, 32), Infinity], function(n) {
//         assert.deepEqual(_.drop(array, n), []);
//       });
//     });

//     QUnit.test('should coerce `n` to an integer', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.drop(array, 1.6), [2, 3]);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
//           actual = lodashStable.map(array, _.drop);

//       assert.deepEqual(actual, [[2, 3], [5, 6], [8, 9]]);
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         var array = lodashStable.range(1, LARGE_ARRAY_SIZE + 1),
//             predicate = function(value) { values.push(value); return isEven(value); },
//             values = [],
//             actual = _(array).drop(2).drop().value();

//         assert.deepEqual(actual, array.slice(3));

//         actual = _(array).filter(predicate).drop(2).drop().value();
//         assert.deepEqual(values, array);
//         assert.deepEqual(actual, _.drop(_.drop(_.filter(array, predicate), 2)));

//         actual = _(array).drop(2).dropRight().drop().dropRight(2).value();
//         assert.deepEqual(actual, _.dropRight(_.drop(_.dropRight(_.drop(array, 2))), 2));

//         values = [];

//         actual = _(array).drop().filter(predicate).drop(2).dropRight().drop().dropRight(2).value();
//         assert.deepEqual(values, array.slice(1));
//         assert.deepEqual(actual, _.dropRight(_.drop(_.dropRight(_.drop(_.filter(_.drop(array), predicate), 2))), 2));
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.dropRight');

//   (function() {
//     var array = [1, 2, 3];

//     QUnit.test('should drop the last two elements', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropRight(array, 2), [1]);
//     });

//     QUnit.test('should treat falsey `n` values, except `undefined`, as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === undefined ? [1, 2] : array;
//       });

//       var actual = lodashStable.map(falsey, function(n) {
//         return _.dropRight(array, n);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return all elements when `n` < `1`', function(assert) {
//       assert.expect(3);

//       lodashStable.each([0, -1, -Infinity], function(n) {
//         assert.deepEqual(_.dropRight(array, n), array);
//       });
//     });

//     QUnit.test('should return an empty array when `n` >= `length`', function(assert) {
//       assert.expect(4);

//       lodashStable.each([3, 4, Math.pow(2, 32), Infinity], function(n) {
//         assert.deepEqual(_.dropRight(array, n), []);
//       });
//     });

//     QUnit.test('should coerce `n` to an integer', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropRight(array, 1.6), [1, 2]);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
//           actual = lodashStable.map(array, _.dropRight);

//       assert.deepEqual(actual, [[1, 2], [4, 5], [7, 8]]);
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         var array = lodashStable.range(1, LARGE_ARRAY_SIZE + 1),
//             predicate = function(value) { values.push(value); return isEven(value); },
//             values = [],
//             actual = _(array).dropRight(2).dropRight().value();

//         assert.deepEqual(actual, array.slice(0, -3));

//         actual = _(array).filter(predicate).dropRight(2).dropRight().value();
//         assert.deepEqual(values, array);
//         assert.deepEqual(actual, _.dropRight(_.dropRight(_.filter(array, predicate), 2)));

//         actual = _(array).dropRight(2).drop().dropRight().drop(2).value();
//         assert.deepEqual(actual, _.drop(_.dropRight(_.drop(_.dropRight(array, 2))), 2));

//         values = [];

//         actual = _(array).dropRight().filter(predicate).dropRight(2).drop().dropRight().drop(2).value();
//         assert.deepEqual(values, array.slice(0, -1));
//         assert.deepEqual(actual, _.drop(_.dropRight(_.drop(_.dropRight(_.filter(_.dropRight(array), predicate), 2))), 2));
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.dropRightWhile');

//   (function() {
//     var array = [1, 2, 3, 4];

//     var objects = [
//       { 'a': 0, 'b': 0 },
//       { 'a': 1, 'b': 1 },
//       { 'a': 2, 'b': 2 }
//     ];

//     QUnit.test('should drop elements while `predicate` returns truthy', function(assert) {
//       assert.expect(1);

//       var actual = _.dropRightWhile(array, function(n) {
//         return n > 2;
//       });

//       assert.deepEqual(actual, [1, 2]);
//     });

//     QUnit.test('should provide correct `predicate` arguments', function(assert) {
//       assert.expect(1);

//       var args;

//       _.dropRightWhile(array, function() {
//         args = slice.call(arguments);
//       });

//       assert.deepEqual(args, [4, 3, array]);
//     });

//     QUnit.test('should work with `_.matches` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropRightWhile(objects, { 'b': 2 }), objects.slice(0, 2));
//     });

//     QUnit.test('should work with `_.matchesProperty` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropRightWhile(objects, ['b', 2]), objects.slice(0, 2));
//     });

//     QUnit.test('should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropRightWhile(objects, 'b'), objects.slice(0, 1));
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _(array).dropRightWhile(function(n) {
//           return n > 2;
//         });

//         assert.ok(wrapped instanceof _);
//         assert.deepEqual(wrapped.value(), [1, 2]);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.dropWhile');

//   (function() {
//     var array = [1, 2, 3, 4];

//     var objects = [
//       { 'a': 2, 'b': 2 },
//       { 'a': 1, 'b': 1 },
//       { 'a': 0, 'b': 0 }
//     ];

//     QUnit.test('should drop elements while `predicate` returns truthy', function(assert) {
//       assert.expect(1);

//       var actual = _.dropWhile(array, function(n) {
//         return n < 3;
//       });

//       assert.deepEqual(actual, [3, 4]);
//     });

//     QUnit.test('should provide correct `predicate` arguments', function(assert) {
//       assert.expect(1);

//       var args;

//       _.dropWhile(array, function() {
//         args = slice.call(arguments);
//       });

//       assert.deepEqual(args, [1, 0, array]);
//     });

//     QUnit.test('should work with `_.matches` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropWhile(objects, { 'b': 2 }), objects.slice(1));
//     });

//     QUnit.test('should work with `_.matchesProperty` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropWhile(objects, ['b', 2]), objects.slice(1));
//     });

//     QUnit.test('should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.dropWhile(objects, 'b'), objects.slice(2));
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(3);

//       if (!isNpm) {
//         var array = lodashStable.range(1, LARGE_ARRAY_SIZE + 3),
//             predicate = function(n) { return n < 3; },
//             expected = _.dropWhile(array, predicate),
//             wrapped = _(array).dropWhile(predicate);

//         assert.deepEqual(wrapped.value(), expected);
//         assert.deepEqual(wrapped.reverse().value(), expected.slice().reverse());
//         assert.strictEqual(wrapped.last(), _.last(expected));
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });

//     QUnit.test('should work in a lazy sequence with `drop`', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var array = lodashStable.range(1, LARGE_ARRAY_SIZE + 3);

//         var actual = _(array)
//           .dropWhile(function(n) { return n == 1; })
//           .drop()
//           .dropWhile(function(n) { return n == 3; })
//           .value();

//         assert.deepEqual(actual, array.slice(3));
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.endsWith');

//   (function() {
//     var string = 'abc';

//     QUnit.test('should return `true` if a string ends with `target`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.endsWith(string, 'c'), true);
//     });

//     QUnit.test('should return `false` if a string does not end with `target`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.endsWith(string, 'b'), false);
//     });

//     QUnit.test('should work with a `position`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.endsWith(string, 'b', 2), true);
//     });

//     QUnit.test('should work with `position` >= `length`', function(assert) {
//       assert.expect(4);

//       lodashStable.each([3, 5, MAX_SAFE_INTEGER, Infinity], function(position) {
//         assert.strictEqual(_.endsWith(string, 'c', position), true);
//       });
//     });

//     QUnit.test('should treat falsey `position` values, except `undefined`, as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubTrue);

//       var actual = lodashStable.map(falsey, function(position) {
//         return _.endsWith(string, position === undefined ? 'c' : '', position);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should treat a negative `position` as `0`', function(assert) {
//       assert.expect(6);

//       lodashStable.each([-1, -3, -Infinity], function(position) {
//         assert.ok(lodashStable.every(string, function(chr) {
//           return !_.endsWith(string, chr, position);
//         }));
//         assert.strictEqual(_.endsWith(string, '', position), true);
//       });
//     });

//     QUnit.test('should coerce `position` to an integer', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.endsWith(string, 'ab', 2.2), true);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.eq');

//   (function() {
//     QUnit.test('should perform a `SameValueZero` comparison of two values', function(assert) {
//       assert.expect(11);

//       assert.strictEqual(_.eq(), true);
//       assert.strictEqual(_.eq(undefined), true);
//       assert.strictEqual(_.eq(0, -0), true);
//       assert.strictEqual(_.eq(NaN, NaN), true);
//       assert.strictEqual(_.eq(1, 1), true);

//       assert.strictEqual(_.eq(null, undefined), false);
//       assert.strictEqual(_.eq(1, Object(1)), false);
//       assert.strictEqual(_.eq(1, '1'), false);
//       assert.strictEqual(_.eq(1, '1'), false);

//       var object = { 'a': 1 };
//       assert.strictEqual(_.eq(object, object), true);
//       assert.strictEqual(_.eq(object, { 'a': 1 }), false);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.escape');

//   (function() {
//     var escaped = '&amp;&lt;&gt;&quot;&#39;/',
//         unescaped = '&<>"\'/';

//     escaped += escaped;
//     unescaped += unescaped;

//     QUnit.test('should escape values', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.escape(unescaped), escaped);
//     });

//     QUnit.test('should handle strings with nothing to escape', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.escape('abc'), 'abc');
//     });

//     QUnit.test('should escape the same characters unescaped by `_.unescape`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.escape(_.unescape(escaped)), escaped);
//     });

//     lodashStable.each(['`', '/'], function(chr) {
//       QUnit.test('should not escape the "' + chr + '" character', function(assert) {
//         assert.expect(1);

//         assert.strictEqual(_.escape(chr), chr);
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.escapeRegExp');

//   (function() {
//     var escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\',
//         unescaped = '^$.*+?()[]{}|\\';

//     QUnit.test('should escape values', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.escapeRegExp(unescaped + unescaped), escaped + escaped);
//     });

//     QUnit.test('should handle strings with nothing to escape', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.escapeRegExp('abc'), 'abc');
//     });

//     QUnit.test('should return an empty string for empty values', function(assert) {
//       assert.expect(1);

//       var values = [, null, undefined, ''],
//           expected = lodashStable.map(values, stubString);

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.escapeRegExp(value) : _.escapeRegExp();
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.every');

//   (function() {
//     QUnit.test('should return `true` if `predicate` returns truthy for all elements', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(lodashStable.every([true, 1, 'a'], identity), true);
//     });

//     QUnit.test('should return `true` for empty collections', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(empties, stubTrue);

//       var actual = lodashStable.map(empties, function(value) {
//         try {
//           return _.every(value, identity);
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return `false` as soon as `predicate` returns falsey', function(assert) {
//       assert.expect(2);

//       var count = 0;

//       assert.strictEqual(_.every([true, null, true], function(value) {
//         count++;
//         return value;
//       }), false);

//       assert.strictEqual(count, 2);
//     });

//     QUnit.test('should work with collections of `undefined` values (test in IE < 9)', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.every([undefined, undefined, undefined], identity), false);
//     });

//     QUnit.test('should use `_.identity` when `predicate` is nullish', function(assert) {
//       assert.expect(2);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, stubFalse);

//       var actual = lodashStable.map(values, function(value, index) {
//         var array = [0];
//         return index ? _.every(array, value) : _.every(array);
//       });

//       assert.deepEqual(actual, expected);

//       expected = lodashStable.map(values, stubTrue);
//       actual = lodashStable.map(values, function(value, index) {
//         var array = [1];
//         return index ? _.every(array, value) : _.every(array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with `_.property` shorthands', function(assert) {
//       assert.expect(2);

//       var objects = [{ 'a': 0, 'b': 1 }, { 'a': 1, 'b': 2 }];
//       assert.strictEqual(_.every(objects, 'a'), false);
//       assert.strictEqual(_.every(objects, 'b'), true);
//     });

//     QUnit.test('should work with `_.matches` shorthands', function(assert) {
//       assert.expect(2);

//       var objects = [{ 'a': 0, 'b': 0 }, { 'a': 0, 'b': 1 }];
//       assert.strictEqual(_.every(objects, { 'a': 0 }), true);
//       assert.strictEqual(_.every(objects, { 'b': 1 }), false);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.map([[1]], _.every);
//       assert.deepEqual(actual, [true]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('strict mode checks');

//   lodashStable.each(['assign', 'assignIn', 'bindAll', 'defaults', 'defaultsDeep', 'merge'], function(methodName) {
//     var func = _[methodName],
//         isBindAll = methodName == 'bindAll';

//     QUnit.test('`_.' + methodName + '` should ' + (isStrict ? '' : 'not ') + 'throw strict mode errors', function(assert) {
//       assert.expect(1);

//       var object = freeze({ 'a': undefined, 'b': function() {} }),
//           pass = !isStrict;

//       try {
//         func(object, isBindAll ? 'b' : { 'a': 1 });
//       } catch (e) {
//         pass = !pass;
//       }
//       assert.ok(pass);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.fill');

//   (function() {
//     QUnit.test('should use a default `start` of `0` and a default `end` of `length`', function(assert) {
//       assert.expect(1);

//       var array = [1, 2, 3];
//       assert.deepEqual(_.fill(array, 'a'), ['a', 'a', 'a']);
//     });

//     QUnit.test('should use `undefined` for `value` if not given', function(assert) {
//       assert.expect(2);

//       var array = [1, 2, 3],
//           actual = _.fill(array);

//       assert.deepEqual(actual, Array(3));
//       assert.ok(lodashStable.every(actual, function(value, index) {
//         return index in actual;
//       }));
//     });

//     QUnit.test('should work with a positive `start`', function(assert) {
//       assert.expect(1);

//       var array = [1, 2, 3];
//       assert.deepEqual(_.fill(array, 'a', 1), [1, 'a', 'a']);
//     });

//     QUnit.test('should work with a `start` >= `length`', function(assert) {
//       assert.expect(4);

//       lodashStable.each([3, 4, Math.pow(2, 32), Infinity], function(start) {
//         var array = [1, 2, 3];
//         assert.deepEqual(_.fill(array, 'a', start), [1, 2, 3]);
//       });
//     });

//     QUnit.test('should treat falsey `start` values as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, lodashStable.constant(['a', 'a', 'a']));

//       var actual = lodashStable.map(falsey, function(start) {
//         var array = [1, 2, 3];
//         return _.fill(array, 'a', start);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with a negative `start`', function(assert) {
//       assert.expect(1);

//       var array = [1, 2, 3];
//       assert.deepEqual(_.fill(array, 'a', -1), [1, 2, 'a']);
//     });

//     QUnit.test('should work with a negative `start` <= negative `length`', function(assert) {
//       assert.expect(3);

//       lodashStable.each([-3, -4, -Infinity], function(start) {
//         var array = [1, 2, 3];
//         assert.deepEqual(_.fill(array, 'a', start), ['a', 'a', 'a']);
//       });
//     });

//     QUnit.test('should work with `start` >= `end`', function(assert) {
//       assert.expect(2);

//       lodashStable.each([2, 3], function(start) {
//         var array = [1, 2, 3];
//         assert.deepEqual(_.fill(array, 'a', start, 2), [1, 2, 3]);
//       });
//     });

//     QUnit.test('should work with a positive `end`', function(assert) {
//       assert.expect(1);

//       var array = [1, 2, 3];
//       assert.deepEqual(_.fill(array, 'a', 0, 1), ['a', 2, 3]);
//     });

//     QUnit.test('should work with a `end` >= `length`', function(assert) {
//       assert.expect(4);

//       lodashStable.each([3, 4, Math.pow(2, 32), Infinity], function(end) {
//         var array = [1, 2, 3];
//         assert.deepEqual(_.fill(array, 'a', 0, end), ['a', 'a', 'a']);
//       });
//     });

//     QUnit.test('should treat falsey `end` values, except `undefined`, as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === undefined ? ['a', 'a', 'a'] : [1, 2, 3];
//       });

//       var actual = lodashStable.map(falsey, function(end) {
//         var array = [1, 2, 3];
//         return _.fill(array, 'a', 0, end);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with a negative `end`', function(assert) {
//       assert.expect(1);

//       var array = [1, 2, 3];
//       assert.deepEqual(_.fill(array, 'a', 0, -1), ['a', 'a', 3]);
//     });

//     QUnit.test('should work with a negative `end` <= negative `length`', function(assert) {
//       assert.expect(3);

//       lodashStable.each([-3, -4, -Infinity], function(end) {
//         var array = [1, 2, 3];
//         assert.deepEqual(_.fill(array, 'a', 0, end), [1, 2, 3]);
//       });
//     });

//     QUnit.test('should coerce `start` and `end` to integers', function(assert) {
//       assert.expect(1);

//       var positions = [[0.1, 1.6], ['0', 1], [0, '1'], ['1'], [NaN, 1], [1, NaN]];

//       var actual = lodashStable.map(positions, function(pos) {
//         var array = [1, 2, 3];
//         return _.fill.apply(_, [array, 'a'].concat(pos));
//       });

//       assert.deepEqual(actual, [['a', 2, 3], ['a', 2, 3], ['a', 2, 3], [1, 'a', 'a'], ['a', 2, 3], [1, 2, 3]]);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [[1, 2], [3, 4]],
//           actual = lodashStable.map(array, _.fill);

//       assert.deepEqual(actual, [[0, 0], [1, 1]]);
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(3);

//       if (!isNpm) {
//         var array = [1, 2, 3],
//             wrapped = _(array).fill('a'),
//             actual = wrapped.value();

//         assert.ok(wrapped instanceof _);
//         assert.strictEqual(actual, array);
//         assert.deepEqual(actual, ['a', 'a', 'a']);
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.filter');

//   (function() {
//     var array = [1, 2, 3];

//     QUnit.test('should return elements `predicate` returns truthy for', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.filter(array, isEven), [2]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   lodashStable.each(['find', 'findIndex', 'findKey', 'findLast', 'findLastIndex', 'findLastKey'], function(methodName) {
//     QUnit.module('lodash.' + methodName);

//     var array = [1, 2, 3, 4],
//         func = _[methodName];

//     var objects = [
//       { 'a': 0, 'b': 0 },
//       { 'a': 1, 'b': 1 },
//       { 'a': 2, 'b': 2 }
//     ];

//     var expected = ({
//       'find': [objects[1], undefined, objects[2]],
//       'findIndex': [1, -1, 2],
//       'findKey': ['1', undefined, '2'],
//       'findLast': [objects[2], undefined, objects[2]],
//       'findLastIndex': [2, -1, 2],
//       'findLastKey': ['2', undefined, '2']
//     })[methodName];

//     QUnit.test('`_.' + methodName + '` should return the found value', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(objects, function(object) { return object.a; }), expected[0]);
//     });

//     QUnit.test('`_.' + methodName + '` should return `' + expected[1] + '` if value is not found', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(objects, function(object) { return object.a === 3; }), expected[1]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with `_.matches` shorthands', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(objects, { 'b': 2 }), expected[2]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with `_.matchesProperty` shorthands', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(objects, ['b', 2]), expected[2]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(objects, 'b'), expected[0]);
//     });

//     QUnit.test('`_.' + methodName + '` should return `' + expected[1] + '` for empty collections', function(assert) {
//       assert.expect(1);

//       var emptyValues = lodashStable.endsWith(methodName, 'Index') ? lodashStable.reject(empties, lodashStable.isPlainObject) : empties,
//           expecting = lodashStable.map(emptyValues, lodashStable.constant(expected[1]));

//       var actual = lodashStable.map(emptyValues, function(value) {
//         try {
//           return func(value, { 'a': 3 });
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expecting);
//     });

//     QUnit.test('`_.' + methodName + '` should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(1);

//       var expected = ({
//         'find': 1,
//         'findIndex': 0,
//         'findKey': '0',
//         'findLast': 4,
//         'findLastIndex': 3,
//         'findLastKey': '3'
//       })[methodName];

//       if (!isNpm) {
//         assert.strictEqual(_(array)[methodName](), expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.ok(_(array).chain()[methodName]() instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should not execute immediately when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var wrapped = _(array).chain()[methodName]();
//         assert.strictEqual(wrapped.__wrapped__, array);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should work in a lazy sequence', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var largeArray = lodashStable.range(1, LARGE_ARRAY_SIZE + 1),
//             smallArray = array;

//         lodashStable.times(2, function(index) {
//           var array = index ? largeArray : smallArray,
//               wrapped = _(array).filter(isEven);

//           assert.strictEqual(wrapped[methodName](), func(lodashStable.filter(array, isEven)));
//         });
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   });

//   _.each(['find', 'findIndex', 'findLast', 'findLastIndex'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should provide correct `predicate` arguments for arrays', function(assert) {
//       assert.expect(1);

//       var args,
//           array = ['a'];

//       func(array, function() {
//         args || (args = slice.call(arguments));
//       });

//       assert.deepEqual(args, ['a', 0, array]);
//     });
//   });

//   _.each(['find', 'findKey', 'findLast', 'findLastKey'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should work with an object for `collection`', function(assert) {
//       assert.expect(1);

//       var actual = func({ 'a': 1, 'b': 2, 'c': 3 }, function(n) {
//         return n < 3;
//       });

//       var expected = ({
//         'find': 1,
//         'findKey': 'a',
//         'findLast': 2,
//         'findLastKey': 'b'
//       })[methodName];

//       assert.strictEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should provide correct `predicate` arguments for objects', function(assert) {
//       assert.expect(1);

//       var args,
//           object = { 'a': 1 };

//       func(object, function() {
//         args || (args = slice.call(arguments));
//       });

//       assert.deepEqual(args, [1, 'a', object]);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.find and lodash.findLast');

//   lodashStable.each(['find', 'findLast'], function(methodName) {
//     var isFind = methodName == 'find';

//     QUnit.test('`_.' + methodName + '` should support shortcut fusion', function(assert) {
//       assert.expect(3);

//       if (!isNpm) {
//         var findCount = 0,
//             mapCount = 0,
//             array = lodashStable.range(1, LARGE_ARRAY_SIZE + 1),
//             iteratee = function(value) { mapCount++; return square(value); },
//             predicate = function(value) { findCount++; return isEven(value); },
//             actual = _(array).map(iteratee)[methodName](predicate);

//         assert.strictEqual(findCount, isFind ? 2 : 1);
//         assert.strictEqual(mapCount, isFind ? 2 : 1);
//         assert.strictEqual(actual, isFind ? 4 : square(LARGE_ARRAY_SIZE));
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.find and lodash.includes');

//   lodashStable.each(['includes', 'find'], function(methodName) {
//     var func = _[methodName],
//         isIncludes = methodName == 'includes',
//         resolve = methodName == 'find' ? lodashStable.curry(lodashStable.eq) : identity;

//     lodashStable.each({
//       'an `arguments` object': args,
//       'an array': [1, 2, 3]
//     },
//     function(collection, key) {
//       var values = lodashStable.toArray(collection);

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and a positive `fromIndex`', function(assert) {
//         assert.expect(1);

//         var expected = [
//           isIncludes || values[2],
//           isIncludes ? false : undefined
//         ];

//         var actual = [
//           func(collection, resolve(values[2]), 2),
//           func(collection, resolve(values[1]), 2)
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and a `fromIndex` >= `length`', function(assert) {
//         assert.expect(1);

//         var indexes = [4, 6, Math.pow(2, 32), Infinity];

//         var expected = lodashStable.map(indexes, function() {
//           var result = isIncludes ? false : undefined;
//           return [result, result, result];
//         });

//         var actual = lodashStable.map(indexes, function(fromIndex) {
//           return [
//             func(collection, resolve(1), fromIndex),
//             func(collection, resolve(undefined), fromIndex),
//             func(collection, resolve(''), fromIndex)
//           ];
//         });

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and treat falsey `fromIndex` values as `0`', function(assert) {
//         assert.expect(1);

//         var expected = lodashStable.map(falsey, lodashStable.constant(isIncludes || values[0]));

//         var actual = lodashStable.map(falsey, function(fromIndex) {
//           return func(collection, resolve(values[0]), fromIndex);
//         });

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and coerce `fromIndex` to an integer', function(assert) {
//         assert.expect(1);

//         var expected = [
//           isIncludes || values[0],
//           isIncludes || values[0],
//           isIncludes ? false : undefined
//         ];

//         var actual = [
//           func(collection, resolve(values[0]), 0.1),
//           func(collection, resolve(values[0]), NaN),
//           func(collection, resolve(values[0]), '1')
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and a negative `fromIndex`', function(assert) {
//         assert.expect(1);

//         var expected = [
//           isIncludes || values[2],
//           isIncludes ? false : undefined
//         ];

//         var actual = [
//           func(collection, resolve(values[2]), -1),
//           func(collection, resolve(values[1]), -1)
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('`_.' + methodName + '` should work with ' + key + ' and a negative `fromIndex` <= `-length`', function(assert) {
//         assert.expect(1);

//         var indexes = [-4, -6, -Infinity],
//             expected = lodashStable.map(indexes, lodashStable.constant(isIncludes || values[0]));

//         var actual = lodashStable.map(indexes, function(fromIndex) {
//           return func(collection, resolve(values[0]), fromIndex);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.findIndex and lodash.indexOf');

//   lodashStable.each(['findIndex', 'indexOf'], function(methodName) {
//     var array = [1, 2, 3, 1, 2, 3],
//         func = _[methodName],
//         resolve = methodName == 'findIndex' ? lodashStable.curry(lodashStable.eq) : identity;

//     QUnit.test('`_.' + methodName + '` should return the index of the first matched value', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(array, resolve(3)), 2);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a positive `fromIndex`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(array, resolve(1), 2), 3);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a `fromIndex` >= `length`', function(assert) {
//       assert.expect(1);

//       var values = [6, 8, Math.pow(2, 32), Infinity],
//           expected = lodashStable.map(values, lodashStable.constant([-1, -1, -1]));

//       var actual = lodashStable.map(values, function(fromIndex) {
//         return [
//           func(array, resolve(undefined), fromIndex),
//           func(array, resolve(1), fromIndex),
//           func(array, resolve(''), fromIndex)
//         ];
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a negative `fromIndex`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(array, resolve(2), -3), 4);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a negative `fromIndex` <= `-length`', function(assert) {
//       assert.expect(1);

//       var values = [-6, -8, -Infinity],
//           expected = lodashStable.map(values, stubZero);

//       var actual = lodashStable.map(values, function(fromIndex) {
//         return func(array, resolve(1), fromIndex);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should treat falsey `fromIndex` values as `0`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubZero);

//       var actual = lodashStable.map(falsey, function(fromIndex) {
//         return func(array, resolve(1), fromIndex);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should coerce `fromIndex` to an integer', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(array, resolve(2), 1.2), 1);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.findLast');

//   (function() {
//     var resolve = lodashStable.curry(lodashStable.eq);

//     lodashStable.each({
//       'an `arguments` object': args,
//       'an array': [1, 2, 3]
//     },
//     function(collection, key) {
//       var values = lodashStable.toArray(collection);

//       QUnit.test('should work with ' + key + ' and a positive `fromIndex`', function(assert) {
//         assert.expect(1);

//         var expected = [
//           values[1],
//           undefined
//         ];

//         var actual = [
//           _.findLast(collection, resolve(values[1]), 1),
//           _.findLast(collection, resolve(values[2]), 1)
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('should work with ' + key + ' and a `fromIndex` >= `length`', function(assert) {
//         assert.expect(1);

//         var indexes = [4, 6, Math.pow(2, 32), Infinity];

//         var expected = lodashStable.map(indexes, lodashStable.constant([values[0], undefined, undefined]));

//         var actual = lodashStable.map(indexes, function(fromIndex) {
//           return [
//             _.findLast(collection, resolve(1), fromIndex),
//             _.findLast(collection, resolve(undefined), fromIndex),
//             _.findLast(collection, resolve(''), fromIndex)
//           ];
//         });

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('should work with ' + key + ' and treat falsey `fromIndex` values correctly', function(assert) {
//         assert.expect(1);

//         var expected = lodashStable.map(falsey, function(value) {
//           return value === undefined ? values[3] : undefined;
//         });

//         var actual = lodashStable.map(falsey, function(fromIndex) {
//           return _.findLast(collection, resolve(values[3]), fromIndex);
//         });

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('should work with ' + key + ' and coerce `fromIndex` to an integer', function(assert) {
//         assert.expect(1);

//         var expected = [
//           values[0],
//           values[0],
//           undefined
//         ];

//         var actual = [
//           _.findLast(collection, resolve(values[0]), 0.1),
//           _.findLast(collection, resolve(values[0]), NaN),
//           _.findLast(collection, resolve(values[2]), '1')
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('should work with ' + key + ' and a negative `fromIndex`', function(assert) {
//         assert.expect(1);

//         var expected = [
//           values[1],
//           undefined
//         ];

//         var actual = [
//           _.findLast(collection, resolve(values[1]), -2),
//           _.findLast(collection, resolve(values[2]), -2)
//         ];

//         assert.deepEqual(actual, expected);
//       });

//       QUnit.test('should work with ' + key + ' and a negative `fromIndex` <= `-length`', function(assert) {
//         assert.expect(1);

//         var indexes = [-4, -6, -Infinity],
//             expected = lodashStable.map(indexes, lodashStable.constant(values[0]));

//         var actual = lodashStable.map(indexes, function(fromIndex) {
//           return _.findLast(collection, resolve(values[0]), fromIndex);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.flip');

//   (function() {
//     function fn() {
//       return slice.call(arguments);
//     }

//     QUnit.test('should flip arguments provided to `func`', function(assert) {
//       assert.expect(1);

//       var flipped = _.flip(fn);
//       assert.deepEqual(flipped('a', 'b', 'c', 'd'), ['d', 'c', 'b', 'a']);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.flatMapDepth');

//   (function() {
//     var array = [1, [2, [3, [4]], 5]];

//     QUnit.test('should use a default `depth` of `1`', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.flatMapDepth(array, identity), [1, 2, [3, [4]], 5]);
//     });

//     QUnit.test('should use `_.identity` when `iteratee` is nullish', function(assert) {
//       assert.expect(1);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, lodashStable.constant([1, 2, [3, [4]], 5]));

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.flatMapDepth(array, value) : _.flatMapDepth(array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should treat a `depth` of < `1` as a shallow clone', function(assert) {
//       assert.expect(2);

//       lodashStable.each([-1, 0], function(depth) {
//         assert.deepEqual(_.flatMapDepth(array, identity, depth), [1, [2, [3, [4]], 5]]);
//       });
//     });

//     QUnit.test('should coerce `depth` to an integer', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.flatMapDepth(array, identity, 2.2), [1, 2, 3, [4], 5]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('flatMap methods');

//   lodashStable.each(['flatMap', 'flatMapDeep', 'flatMapDepth'], function(methodName) {
//     var func = _[methodName],
//         array = [1, 2, 3, 4];

//     function duplicate(n) {
//       return [n, n];
//     }

//     QUnit.test('`_.' + methodName + '` should map values in `array` to a new flattened array', function(assert) {
//       assert.expect(1);

//       var actual = func(array, duplicate),
//           expected = lodashStable.flatten(lodashStable.map(array, duplicate));

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       var objects = [{ 'a': [1, 2] }, { 'a': [3, 4] }];
//       assert.deepEqual(func(objects, 'a'), array);
//     });

//     QUnit.test('`_.' + methodName + '` should iterate over own string keyed properties of objects', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = [1, 2];
//       }
//       Foo.prototype.b = [3, 4];

//       var actual = func(new Foo, identity);
//       assert.deepEqual(actual, [1, 2]);
//     });

//     QUnit.test('`_.' + methodName + '` should use `_.identity` when `iteratee` is nullish', function(assert) {
//       assert.expect(2);

//       var array = [[1, 2], [3, 4]],
//           object = { 'a': [1, 2], 'b': [3, 4] },
//           values = [, null, undefined],
//           expected = lodashStable.map(values, lodashStable.constant([1, 2, 3, 4]));

//       lodashStable.each([array, object], function(collection) {
//         var actual = lodashStable.map(values, function(value, index) {
//           return index ? func(collection, value) : func(collection);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should accept a falsey `collection`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubArray);

//       var actual = lodashStable.map(falsey, function(collection, index) {
//         try {
//           return index ? func(collection) : func();
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should treat number values for `collection` as empty', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(func(1), []);
//     });

//     QUnit.test('`_.' + methodName + '` should work with objects with non-number length properties', function(assert) {
//       assert.expect(1);

//       var object = { 'length': [1, 2] };
//       assert.deepEqual(func(object, identity), [1, 2]);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.flattenDepth');

//   (function() {
//     var array = [1, [2, [3, [4]], 5]];

//     QUnit.test('should use a default `depth` of `1`', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.flattenDepth(array), [1, 2, [3, [4]], 5]);
//     });

//     QUnit.test('should treat a `depth` of < `1` as a shallow clone', function(assert) {
//       assert.expect(2);

//       lodashStable.each([-1, 0], function(depth) {
//         assert.deepEqual(_.flattenDepth(array, depth), [1, [2, [3, [4]], 5]]);
//       });
//     });

//     QUnit.test('should coerce `depth` to an integer', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.flattenDepth(array, 2.2), [1, 2, 3, [4], 5]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('flatten methods');

//   (function() {
//     var array = [1, [2, [3, [4]], 5]],
//         methodNames = ['flatten', 'flattenDeep', 'flattenDepth'];

//     QUnit.test('should flatten `arguments` objects', function(assert) {
//       assert.expect(3);

//       var array = [args, [args]];

//       assert.deepEqual(_.flatten(array), [1, 2, 3, args]);
//       assert.deepEqual(_.flattenDeep(array), [1, 2, 3, 1, 2, 3]);
//       assert.deepEqual(_.flattenDepth(array, 2), [1, 2, 3, 1, 2, 3]);
//     });

//     QUnit.test('should treat sparse arrays as dense', function(assert) {
//       assert.expect(6);

//       var array = [[1, 2, 3], Array(3)],
//           expected = [1, 2, 3];

//       expected.push(undefined, undefined, undefined);

//       lodashStable.each(methodNames, function(methodName) {
//         var actual = _[methodName](array);
//         assert.deepEqual(actual, expected);
//         assert.ok('4' in actual);
//       });
//     });

//     QUnit.test('should flatten objects with a truthy `Symbol.isConcatSpreadable` value', function(assert) {
//       assert.expect(1);

//       if (Symbol && Symbol.isConcatSpreadable) {
//         var object = { '0': 'a', 'length': 1 },
//             array = [object],
//             expected = lodashStable.map(methodNames, lodashStable.constant(['a']));

//         object[Symbol.isConcatSpreadable] = true;

//         var actual = lodashStable.map(methodNames, function(methodName) {
//           return _[methodName](array);
//         });

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should work with extremely large arrays', function(assert) {
//       assert.expect(3);

//       lodashStable.times(3, function(index) {
//         var expected = Array(5e5);
//         try {
//           var func = _.flatten;
//           if (index == 1) {
//             func = _.flattenDeep;
//           } else if (index == 2) {
//             func = _.flattenDepth;
//           }
//           assert.deepEqual(func([expected]), expected);
//         } catch (e) {
//           assert.ok(false, e.message);
//         }
//       });
//     });

//     QUnit.test('should work with empty arrays', function(assert) {
//       assert.expect(3);

//       var array = [[], [[]], [[], [[[]]]]];

//       assert.deepEqual(_.flatten(array), [[], [], [[[]]]]);
//       assert.deepEqual(_.flattenDeep(array), []);
//       assert.deepEqual(_.flattenDepth(array, 2), [[[]]]);
//     });

//     QUnit.test('should support flattening of nested arrays', function(assert) {
//       assert.expect(3);

//       assert.deepEqual(_.flatten(array), [1, 2, [3, [4]], 5]);
//       assert.deepEqual(_.flattenDeep(array), [1, 2, 3, 4, 5]);
//       assert.deepEqual(_.flattenDepth(array, 2), [1, 2, 3, [4], 5]);
//     });

//     QUnit.test('should return an empty array for non array-like objects', function(assert) {
//       assert.expect(3);

//       var expected = [],
//           nonArray = { '0': 'a' };

//       assert.deepEqual(_.flatten(nonArray), expected);
//       assert.deepEqual(_.flattenDeep(nonArray), expected);
//       assert.deepEqual(_.flattenDepth(nonArray, 2), expected);
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(6);

//       if (!isNpm) {
//         var wrapped = _(array),
//             actual = wrapped.flatten();

//         assert.ok(actual instanceof _);
//         assert.deepEqual(actual.value(), [1, 2, [3, [4]], 5]);

//         actual = wrapped.flattenDeep();

//         assert.ok(actual instanceof _);
//         assert.deepEqual(actual.value(), [1, 2, 3, 4, 5]);

//         actual = wrapped.flattenDepth(2);

//         assert.ok(actual instanceof _);
//         assert.deepEqual(actual.value(), [1, 2, 3, [4], 5]);
//       }
//       else {
//         skipAssert(assert, 6);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('flow methods');

//   lodashStable.each(['flow', 'flowRight'], function(methodName) {
//     var func = _[methodName],
//         isFlow = methodName == 'flow';

//     QUnit.test('`_.' + methodName + '` should supply each function with the return value of the previous', function(assert) {
//       assert.expect(1);

//       var fixed = function(n) { return n.toFixed(1); },
//           combined = isFlow ? func(add, square, fixed) : func(fixed, square, add);

//       assert.strictEqual(combined(1, 2), '9.0');
//     });

//     QUnit.test('`_.' + methodName + '` should return a new function', function(assert) {
//       assert.expect(1);

//       assert.notStrictEqual(func(noop), noop);
//     });

//     QUnit.test('`_.' + methodName + '` should return an identity function when no arguments are given', function(assert) {
//       assert.expect(6);

//       _.times(2, function(index) {
//         try {
//           var combined = index ? func([]) : func();
//           assert.strictEqual(combined('a'), 'a');
//         } catch (e) {
//           assert.ok(false, e.message);
//         }
//         assert.strictEqual(combined.length, 0);
//         assert.notStrictEqual(combined, identity);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should work with a curried function and `_.head`', function(assert) {
//       assert.expect(1);

//       var curried = _.curry(identity);

//       var combined = isFlow
//         ? func(_.head, curried)
//         : func(curried, _.head);

//       assert.strictEqual(combined([1]), 1);
//     });

//     QUnit.test('`_.' + methodName + '` should support shortcut fusion', function(assert) {
//       assert.expect(6);

//       var filterCount,
//           mapCount,
//           array = lodashStable.range(LARGE_ARRAY_SIZE),
//           iteratee = function(value) { mapCount++; return square(value); },
//           predicate = function(value) { filterCount++; return isEven(value); };

//       lodashStable.times(2, function(index) {
//         var filter1 = _.filter,
//             filter2 = _.curry(_.rearg(_.ary(_.filter, 2), 1, 0), 2),
//             filter3 = (_.filter = index ? filter2 : filter1, filter2(predicate));

//         var map1 = _.map,
//             map2 = _.curry(_.rearg(_.ary(_.map, 2), 1, 0), 2),
//             map3 = (_.map = index ? map2 : map1, map2(iteratee));

//         var take1 = _.take,
//             take2 = _.curry(_.rearg(_.ary(_.take, 2), 1, 0), 2),
//             take3 = (_.take = index ? take2 : take1, take2(2));

//         var combined = isFlow
//           ? func(map3, filter3, _.compact, take3)
//           : func(take3, _.compact, filter3, map3);

//         filterCount = mapCount = 0;
//         assert.deepEqual(combined(array), [4, 16]);

//         if (!isNpm && WeakMap && WeakMap.name) {
//           assert.strictEqual(filterCount, 5, 'filterCount');
//           assert.strictEqual(mapCount, 5, 'mapCount');
//         }
//         else {
//           skipAssert(assert, 2);
//         }
//         _.filter = filter1;
//         _.map = map1;
//         _.take = take1;
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should work with curried functions with placeholders', function(assert) {
//       assert.expect(1);

//       var curried = _.curry(_.ary(_.map, 2), 2),
//           getProp = curried(curried.placeholder, 'a'),
//           objects = [{ 'a': 1 }, { 'a': 2 }, { 'a': 1 }];

//       var combined = isFlow
//         ? func(getProp, _.uniq)
//         : func(_.uniq, getProp);

//       assert.deepEqual(combined(objects), [1, 2]);
//     });

//     QUnit.test('`_.' + methodName + '` should return a wrapped value when chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var wrapped = _(noop)[methodName]();
//         assert.ok(wrapped instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.forEach');

//   (function() {
//     QUnit.test('should be aliased', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.each, _.forEach);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.forEachRight');

//   (function() {
//     QUnit.test('should be aliased', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.eachRight, _.forEachRight);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('forIn methods');

//   lodashStable.each(['forIn', 'forInRight'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` iterates over inherited string keyed properties', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.b = 2;

//       var keys = [];
//       func(new Foo, function(value, key) { keys.push(key); });
//       assert.deepEqual(keys.sort(), ['a', 'b']);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('forOwn methods');

//   lodashStable.each(['forOwn', 'forOwnRight'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should iterate over `length` properties', function(assert) {
//       assert.expect(1);

//       var object = { '0': 'zero', '1': 'one', 'length': 2 },
//           props = [];

//       func(object, function(value, prop) { props.push(prop); });
//       assert.deepEqual(props.sort(), ['0', '1', 'length']);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('iteration methods');

//   (function() {
//     var methods = [
//       '_baseEach',
//       'countBy',
//       'every',
//       'filter',
//       'find',
//       'findIndex',
//       'findKey',
//       'findLast',
//       'findLastIndex',
//       'findLastKey',
//       'forEach',
//       'forEachRight',
//       'forIn',
//       'forInRight',
//       'forOwn',
//       'forOwnRight',
//       'groupBy',
//       'keyBy',
//       'map',
//       'mapKeys',
//       'mapValues',
//       'maxBy',
//       'minBy',
//       'omitBy',
//       'partition',
//       'pickBy',
//       'reject',
//       'some'
//     ];

//     var arrayMethods = [
//       'findIndex',
//       'findLastIndex',
//       'maxBy',
//       'minBy'
//     ];

//     var collectionMethods = [
//       '_baseEach',
//       'countBy',
//       'every',
//       'filter',
//       'find',
//       'findLast',
//       'forEach',
//       'forEachRight',
//       'groupBy',
//       'keyBy',
//       'map',
//       'partition',
//       'reduce',
//       'reduceRight',
//       'reject',
//       'some'
//     ];

//     var forInMethods = [
//       'forIn',
//       'forInRight',
//       'omitBy',
//       'pickBy'
//     ];

//     var iterationMethods = [
//       '_baseEach',
//       'forEach',
//       'forEachRight',
//       'forIn',
//       'forInRight',
//       'forOwn',
//       'forOwnRight'
//     ];

//     var objectMethods = [
//       'findKey',
//       'findLastKey',
//       'forIn',
//       'forInRight',
//       'forOwn',
//       'forOwnRight',
//       'mapKeys',
//       'mapValues',
//       'omitBy',
//       'pickBy'
//     ];

//     var rightMethods = [
//       'findLast',
//       'findLastIndex',
//       'findLastKey',
//       'forEachRight',
//       'forInRight',
//       'forOwnRight'
//     ];

//     var unwrappedMethods = [
//       'each',
//       'eachRight',
//       'every',
//       'find',
//       'findIndex',
//       'findKey',
//       'findLast',
//       'findLastIndex',
//       'findLastKey',
//       'forEach',
//       'forEachRight',
//       'forIn',
//       'forInRight',
//       'forOwn',
//       'forOwnRight',
//       'max',
//       'maxBy',
//       'min',
//       'minBy',
//       'some'
//     ];

//     lodashStable.each(methods, function(methodName) {
//       var array = [1, 2, 3],
//           func = _[methodName],
//           isBy = /(^partition|By)$/.test(methodName),
//           isFind = /^find/.test(methodName),
//           isOmitPick = /^(?:omit|pick)By$/.test(methodName),
//           isSome = methodName == 'some';

//       QUnit.test('`_.' + methodName + '` should provide correct iteratee arguments', function(assert) {
//         assert.expect(1);

//         if (func) {
//           var args,
//               expected = [1, 0, array];

//           func(array, function() {
//             args || (args = slice.call(arguments));
//           });

//           if (lodashStable.includes(rightMethods, methodName)) {
//             expected[0] = 3;
//             expected[1] = 2;
//           }
//           if (lodashStable.includes(objectMethods, methodName)) {
//             expected[1] += '';
//           }
//           if (isBy) {
//             expected.length = isOmitPick ? 2 : 1;
//           }
//           assert.deepEqual(args, expected);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should treat sparse arrays as dense', function(assert) {
//         assert.expect(1);

//         if (func) {
//           var array = [1];
//           array[2] = 3;

//           var expected = lodashStable.includes(objectMethods, methodName)
//             ? [[1, '0', array], [undefined, '1', array], [3, '2', array]]
//             : [[1,  0, array],  [undefined,  1,  array], [3,  2,  array]];

//           if (isBy) {
//             expected = lodashStable.map(expected, function(args) {
//               return args.slice(0, isOmitPick ? 2 : 1);
//             });
//           }
//           else if (lodashStable.includes(objectMethods, methodName)) {
//             expected = lodashStable.map(expected, function(args) {
//               args[1] += '';
//               return args;
//             });
//           }
//           if (lodashStable.includes(rightMethods, methodName)) {
//             expected.reverse();
//           }
//           var argsList = [];
//           func(array, function() {
//             argsList.push(slice.call(arguments));
//             return !(isFind || isSome);
//           });

//           assert.deepEqual(argsList, expected);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(lodashStable.difference(methods, objectMethods), function(methodName) {
//       var array = [1, 2, 3],
//           func = _[methodName],
//           isEvery = methodName == 'every';

//       array.a = 1;

//       QUnit.test('`_.' + methodName + '` should not iterate custom properties on arrays', function(assert) {
//         assert.expect(1);

//         if (func) {
//           var keys = [];
//           func(array, function(value, key) {
//             keys.push(key);
//             return isEvery;
//           });

//           assert.notOk(lodashStable.includes(keys, 'a'));
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(lodashStable.difference(methods, unwrappedMethods), function(methodName) {
//       var array = [1, 2, 3],
//           isBaseEach = methodName == '_baseEach';

//       QUnit.test('`_.' + methodName + '` should return a wrapped value when implicitly chaining', function(assert) {
//         assert.expect(1);

//         if (!(isBaseEach || isNpm)) {
//           var wrapped = _(array)[methodName](noop);
//           assert.ok(wrapped instanceof _);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(unwrappedMethods, function(methodName) {
//       var array = [1, 2, 3];

//       QUnit.test('`_.' + methodName + '` should return an unwrapped value when implicitly chaining', function(assert) {
//         assert.expect(1);

//         if (!isNpm) {
//           var actual = _(array)[methodName](noop);
//           assert.notOk(actual instanceof _);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });

//       QUnit.test('`_.' + methodName + '` should return a wrapped value when explicitly chaining', function(assert) {
//         assert.expect(2);

//         if (!isNpm) {
//           var wrapped = _(array).chain(),
//               actual = wrapped[methodName](noop);

//           assert.ok(actual instanceof _);
//           assert.notStrictEqual(actual, wrapped);
//         }
//         else {
//           skipAssert(assert, 2);
//         }
//       });
//     });

//     lodashStable.each(lodashStable.difference(methods, arrayMethods, forInMethods), function(methodName) {
//       var func = _[methodName];

//       QUnit.test('`_.' + methodName + '` iterates over own string keyed properties of objects', function(assert) {
//         assert.expect(1);

//         function Foo() {
//           this.a = 1;
//         }
//         Foo.prototype.b = 2;

//         if (func) {
//           var values = [];
//           func(new Foo, function(value) { values.push(value); });
//           assert.deepEqual(values, [1]);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(iterationMethods, function(methodName) {
//       var array = [1, 2, 3],
//           func = _[methodName];

//       QUnit.test('`_.' + methodName + '` should return the collection', function(assert) {
//         assert.expect(1);

//         if (func) {
//           assert.strictEqual(func(array, Boolean), array);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(collectionMethods, function(methodName) {
//       var func = _[methodName];

//       QUnit.test('`_.' + methodName + '` should use `isArrayLike` to determine whether a value is array-like', function(assert) {
//         assert.expect(3);

//         if (func) {
//           var isIteratedAsObject = function(object) {
//             var result = false;
//             func(object, function() { result = true; }, 0);
//             return result;
//           };

//           var values = [-1, '1', 1.1, Object(1), MAX_SAFE_INTEGER + 1],
//               expected = lodashStable.map(values, stubTrue);

//           var actual = lodashStable.map(values, function(length) {
//             return isIteratedAsObject({ 'length': length });
//           });

//           var Foo = function(a) {};
//           Foo.a = 1;

//           assert.deepEqual(actual, expected);
//           assert.ok(isIteratedAsObject(Foo));
//           assert.notOk(isIteratedAsObject({ 'length': 0 }));
//         }
//         else {
//           skipAssert(assert, 3);
//         }
//       });
//     });

//     lodashStable.each(methods, function(methodName) {
//       var func = _[methodName],
//           isFind = /^find/.test(methodName),
//           isSome = methodName == 'some',
//           isReduce = /^reduce/.test(methodName);

//       QUnit.test('`_.' + methodName + '` should ignore changes to `length`', function(assert) {
//         assert.expect(1);

//         if (func) {
//           var count = 0,
//               array = [1];

//           func(array, function() {
//             if (++count == 1) {
//               array.push(2);
//             }
//             return !(isFind || isSome);
//           }, isReduce ? array : null);

//           assert.strictEqual(count, 1);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each(lodashStable.difference(lodashStable.union(methods, collectionMethods), arrayMethods), function(methodName) {
//       var func = _[methodName],
//           isFind = /^find/.test(methodName),
//           isSome = methodName == 'some',
//           isReduce = /^reduce/.test(methodName);

//       QUnit.test('`_.' + methodName + '` should ignore added `object` properties', function(assert) {
//         assert.expect(1);

//         if (func) {
//           var count = 0,
//               object = { 'a': 1 };

//           func(object, function() {
//             if (++count == 1) {
//               object.b = 2;
//             }
//             return !(isFind || isSome);
//           }, isReduce ? object : null);

//           assert.strictEqual(count, 1);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('object assignments');

//   lodashStable.each(['assign', 'assignIn', 'defaults', 'defaultsDeep', 'merge'], function(methodName) {
//     var func = _[methodName],
//         isAssign = methodName == 'assign',
//         isDefaults = /^defaults/.test(methodName);

//     QUnit.test('`_.' + methodName + '` should coerce primitives to objects', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(primitives, function(value) {
//         var object = Object(value);
//         object.a = 1;
//         return object;
//       });

//       var actual = lodashStable.map(primitives, function(value) {
//         return func(value, { 'a': 1 });
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should assign own ' + (isAssign ? '' : 'and inherited ') + 'string keyed source properties', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.b = 2;

//       var expected = isAssign ? { 'a': 1 } : { 'a': 1, 'b': 2 };
//       assert.deepEqual(func({}, new Foo), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should not skip a trailing function source', function(assert) {
//       assert.expect(1);

//       function fn() {}
//       fn.b = 2;

//       assert.deepEqual(func({}, { 'a': 1 }, fn), { 'a': 1, 'b': 2 });
//     });

//     QUnit.test('`_.' + methodName + '` should not error on nullish sources', function(assert) {
//       assert.expect(1);

//       try {
//         assert.deepEqual(func({ 'a': 1 }, undefined, { 'b': 2 }, null), { 'a': 1, 'b': 2 });
//       } catch (e) {
//         assert.ok(false, e.message);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should create an object when `object` is nullish', function(assert) {
//       assert.expect(2);

//       var source = { 'a': 1 },
//           values = [null, undefined],
//           expected = lodashStable.map(values, stubTrue);

//       var actual = lodashStable.map(values, function(value) {
//         var object = func(value, source);
//         return object !== source && lodashStable.isEqual(object, source);
//       });

//       assert.deepEqual(actual, expected);

//       actual = lodashStable.map(values, function(value) {
//         return lodashStable.isEqual(func(value), {});
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work as an iteratee for methods like `_.reduce`', function(assert) {
//       assert.expect(2);

//       var array = [{ 'a': 1 }, { 'b': 2 }, { 'c': 3 }],
//           expected = { 'a': isDefaults ? 0 : 1, 'b': 2, 'c': 3 };

//       function fn() {};
//       fn.a = array[0];
//       fn.b = array[1];
//       fn.c = array[2];

//       assert.deepEqual(lodashStable.reduce(array, func, { 'a': 0 }), expected);
//       assert.deepEqual(lodashStable.reduce(fn, func, { 'a': 0 }), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should not return the existing wrapped value when chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var wrapped = _({ 'a': 1 }),
//             actual = wrapped[methodName]({ 'b': 2 });

//         assert.notStrictEqual(actual, wrapped);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   });

//   lodashStable.each(['assign', 'assignIn', 'merge'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should not treat `object` as `source`', function(assert) {
//       assert.expect(1);

//       function Foo() {}
//       Foo.prototype.a = 1;

//       var actual = func(new Foo, { 'b': 2 });
//       assert.notOk(_.has(actual, 'a'));
//     });
//   });

//   lodashStable.each(['assign', 'assignIn', 'assignInWith', 'assignWith', 'defaults', 'defaultsDeep', 'merge', 'mergeWith'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should not assign values that are the same as their destinations', function(assert) {
//       assert.expect(4);

//       lodashStable.each(['a', ['a'], { 'a': 1 }, NaN], function(value) {
//         var object = {},
//             pass = true;

//         defineProperty(object, 'a', {
//           'configurable': true,
//           'enumerable': true,
//           'get': lodashStable.constant(value),
//           'set': function() { pass = false; }
//         });

//         func(object, { 'a': value });
//         assert.ok(pass);
//       });
//     });
//   });

//   lodashStable.each(['assignWith', 'assignInWith', 'mergeWith'], function(methodName) {
//     var func = _[methodName],
//         isMergeWith = methodName == 'mergeWith';

//     QUnit.test('`_.' + methodName + '` should provide correct `customizer` arguments', function(assert) {
//       assert.expect(3);

//       var args,
//           object = { 'a': 1 },
//           source = { 'a': 2 },
//           expected = lodashStable.map([1, 2, 'a', object, source], lodashStable.cloneDeep);

//       func(object, source, function() {
//         args || (args = lodashStable.map(slice.call(arguments, 0, 5), lodashStable.cloneDeep));
//       });

//       assert.deepEqual(args, expected, 'primitive values');

//       var argsList = [],
//           objectValue = [1, 2],
//           sourceValue = { 'b': 2 };

//       object = { 'a': objectValue };
//       source = { 'a': sourceValue };
//       expected = [lodashStable.map([objectValue, sourceValue, 'a', object, source], lodashStable.cloneDeep)];

//       if (isMergeWith) {
//         expected.push(lodashStable.map([undefined, 2, 'b', objectValue, sourceValue], lodashStable.cloneDeep));
//       }
//       func(object, source, function() {
//         argsList.push(lodashStable.map(slice.call(arguments, 0, 5), lodashStable.cloneDeep));
//       });

//       assert.deepEqual(argsList, expected, 'object values');

//       args = undefined;
//       object = { 'a': 1 };
//       source = { 'b': 2 };
//       expected = lodashStable.map([undefined, 2, 'b', object, source], lodashStable.cloneDeep);

//       func(object, source, function() {
//         args || (args = lodashStable.map(slice.call(arguments, 0, 5), lodashStable.cloneDeep));
//       });

//       assert.deepEqual(args, expected, 'undefined properties');
//     });

//     QUnit.test('`_.' + methodName + '` should not treat the second argument as a `customizer` callback', function(assert) {
//       assert.expect(2);

//       function callback() {}
//       callback.b = 2;

//       var actual = func({ 'a': 1 }, callback);
//       assert.deepEqual(actual, { 'a': 1, 'b': 2 });

//       actual = func({ 'a': 1 }, callback, { 'c': 3 });
//       assert.deepEqual(actual, { 'a': 1, 'b': 2, 'c': 3 });
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('exit early');

//   lodashStable.each(['_baseEach', 'forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'transform'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` can exit early when iterating arrays', function(assert) {
//       assert.expect(1);

//       if (func) {
//         var array = [1, 2, 3],
//             values = [];

//         func(array, function(value, other) {
//           values.push(lodashStable.isArray(value) ? other : value);
//           return false;
//         });

//         assert.deepEqual(values, [lodashStable.endsWith(methodName, 'Right') ? 3 : 1]);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` can exit early when iterating objects', function(assert) {
//       assert.expect(1);

//       if (func) {
//         var object = { 'a': 1, 'b': 2, 'c': 3 },
//             values = [];

//         func(object, function(value, other) {
//           values.push(lodashStable.isArray(value) ? other : value);
//           return false;
//         });

//         assert.strictEqual(values.length, 1);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('`__proto__` property bugs');

//   (function() {
//     QUnit.test('should work with the "__proto__" key in internal data objects', function(assert) {
//       assert.expect(4);

//       var stringLiteral = '__proto__',
//           stringObject = Object(stringLiteral),
//           expected = [stringLiteral, stringObject];

//       var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, function(count) {
//         return isEven(count) ? stringLiteral : stringObject;
//       });

//       assert.deepEqual(_.difference(largeArray, largeArray), []);
//       assert.deepEqual(_.intersection(largeArray, largeArray), expected);
//       assert.deepEqual(_.uniq(largeArray), expected);
//       assert.deepEqual(_.without.apply(_, [largeArray].concat(largeArray)), []);
//     });

//     QUnit.test('should treat "__proto__" as a regular key in assignments', function(assert) {
//       assert.expect(2);

//       var methods = [
//         'assign',
//         'assignIn',
//         'defaults',
//         'defaultsDeep',
//         'merge'
//       ];

//       var source = create(null);
//       source.__proto__ = [];

//       var expected = lodashStable.map(methods, stubFalse);

//       var actual = lodashStable.map(methods, function(methodName) {
//         var result = _[methodName]({}, source);
//         return result instanceof Array;
//       });

//       assert.deepEqual(actual, expected);

//       actual = _.groupBy([{ 'a': '__proto__' }], 'a');
//       assert.notOk(actual instanceof Array);
//     });

//     QUnit.test('should not merge "__proto__" properties', function(assert) {
//       assert.expect(1);

//       if (JSON) {
//         _.merge({}, JSON.parse('{"__proto__":{"a":1}}'));

//         var actual = 'a' in objectProto;
//         delete objectProto.a;

//         assert.notOk(actual);
//       } else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should not indirectly merge builtin prototype properties', function(assert) {
//       assert.expect(2);

//       _.merge({}, { 'toString': { 'constructor': { 'prototype': { 'a': 1 } } } });

//       var actual = 'a' in funcProto;
//       delete funcProto.a;

//       assert.notOk(actual);

//       _.merge({}, { 'constructor': { 'prototype': { 'a': 1 } } });

//       actual = 'a' in objectProto;
//       delete objectProto.a;

//       assert.notOk(actual);
//     });

//     QUnit.test('should not indirectly merge `Object` properties', function(assert) {
//       assert.expect(1);

//       _.merge({}, { 'constructor': { 'a': 1 } });

//       var actual = 'a' in Object;
//       delete Object.a;

//       assert.notOk(actual);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.fromPairs');

//   (function() {
//     QUnit.test('should accept a two dimensional array', function(assert) {
//       assert.expect(1);

//       var array = [['a', 1], ['b', 2]],
//           object = { 'a': 1, 'b': 2 },
//           actual = _.fromPairs(array);

//       assert.deepEqual(actual, object);
//     });

//     QUnit.test('should accept a falsey `array`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubObject);

//       var actual = lodashStable.map(falsey, function(array, index) {
//         try {
//           return index ? _.fromPairs(array) : _.fromPairs();
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should not support deep paths', function(assert) {
//       assert.expect(1);

//       var actual = _.fromPairs([['a.b', 1]]);
//       assert.deepEqual(actual, { 'a.b': 1 });
//     });

//     QUnit.test('should support consuming the return value of `_.toPairs`', function(assert) {
//       assert.expect(1);

//       var object = { 'a.b': 1 };
//       assert.deepEqual(_.fromPairs(_.toPairs(object)), object);
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var array = lodashStable.times(LARGE_ARRAY_SIZE, function(index) {
//           return ['key' + index, index];
//         });

//         var actual = _(array).fromPairs().map(square).filter(isEven).take().value();

//         assert.deepEqual(actual, _.take(_.filter(_.map(_.fromPairs(array), square), isEven)));
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.functions');

//   (function() {
//     QUnit.test('should return the function names of an object', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 'a', 'b': identity, 'c': /x/, 'd': noop },
//           actual = _.functions(object).sort();

//       assert.deepEqual(actual, ['b', 'd']);
//     });

//     QUnit.test('should not include inherited functions', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.a = identity;
//         this.b = 'b';
//       }
//       Foo.prototype.c = noop;

//       assert.deepEqual(_.functions(new Foo), ['a']);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.groupBy');

//   (function() {
//     var array = [6.1, 4.2, 6.3];

//     QUnit.test('should transform keys by `iteratee`', function(assert) {
//       assert.expect(1);

//       var actual = _.groupBy(array, Math.floor);
//       assert.deepEqual(actual, { '4': [4.2], '6': [6.1, 6.3] });
//     });

//     QUnit.test('should use `_.identity` when `iteratee` is nullish', function(assert) {
//       assert.expect(1);

//       var array = [6, 4, 6],
//           values = [, null, undefined],
//           expected = lodashStable.map(values, lodashStable.constant({ '4': [4], '6':  [6, 6] }));

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.groupBy(array, value) : _.groupBy(array);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with `_.property` shorthands', function(assert) {
//       assert.expect(1);

//       var actual = _.groupBy(['one', 'two', 'three'], 'length');
//       assert.deepEqual(actual, { '3': ['one', 'two'], '5': ['three'] });
//     });

//     QUnit.test('should only add values to own, not inherited, properties', function(assert) {
//       assert.expect(2);

//       var actual = _.groupBy(array, function(n) {
//         return Math.floor(n) > 4 ? 'hasOwnProperty' : 'constructor';
//       });

//       assert.deepEqual(actual.constructor, [4.2]);
//       assert.deepEqual(actual.hasOwnProperty, [6.1, 6.3]);
//     });

//     QUnit.test('should work with a number for `iteratee`', function(assert) {
//       assert.expect(2);

//       var array = [
//         [1, 'a'],
//         [2, 'a'],
//         [2, 'b']
//       ];

//       assert.deepEqual(_.groupBy(array, 0), { '1': [[1, 'a']], '2': [[2, 'a'], [2, 'b']] });
//       assert.deepEqual(_.groupBy(array, 1), { 'a': [[1, 'a'], [2, 'a']], 'b': [[2, 'b']] });
//     });

//     QUnit.test('should work with an object for `collection`', function(assert) {
//       assert.expect(1);

//       var actual = _.groupBy({ 'a': 6.1, 'b': 4.2, 'c': 6.3 }, Math.floor);
//       assert.deepEqual(actual, { '4': [4.2], '6': [6.1, 6.3] });
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var array = lodashStable.range(LARGE_ARRAY_SIZE).concat(
//           lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 2), LARGE_ARRAY_SIZE),
//           lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 1.5), LARGE_ARRAY_SIZE)
//         );

//         var iteratee = function(value) { value.push(value[0]); return value; },
//             predicate = function(value) { return isEven(value[0]); },
//             actual = _(array).groupBy().map(iteratee).filter(predicate).take().value();

//         assert.deepEqual(actual, _.take(_.filter(lodashStable.map(_.groupBy(array), iteratee), predicate)));
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.gt');

//   (function() {
//     QUnit.test('should return `true` if `value` > `other`', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.gt(3, 1), true);
//       assert.strictEqual(_.gt('def', 'abc'), true);
//     });

//     QUnit.test('should return `false` if `value` is <= `other`', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(_.gt(1, 3), false);
//       assert.strictEqual(_.gt(3, 3), false);
//       assert.strictEqual(_.gt('abc', 'def'), false);
//       assert.strictEqual(_.gt('def', 'def'), false);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.gte');

//   (function() {
//     QUnit.test('should return `true` if `value` >= `other`', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(_.gte(3, 1), true);
//       assert.strictEqual(_.gte(3, 3), true);
//       assert.strictEqual(_.gte('def', 'abc'), true);
//       assert.strictEqual(_.gte('def', 'def'), true);
//     });

//     QUnit.test('should return `false` if `value` is less than `other`', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.gte(1, 3), false);
//       assert.strictEqual(_.gte('abc', 'def'), false);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('has methods');

//   lodashStable.each(['has', 'hasIn'], function(methodName) {
//     var func = _[methodName],
//         isHas = methodName == 'has',
//         sparseArgs = toArgs([1]),
//         sparseArray = Array(1),
//         sparseString = Object('a');

//     delete sparseArgs[0];
//     delete sparseString[0];

//     QUnit.test('`_.' + methodName + '` should check for own properties', function(assert) {
//       assert.expect(2);

//       var object = { 'a': 1 };

//       lodashStable.each(['a', ['a']], function(path) {
//         assert.strictEqual(func(object, path), true);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should not use the `hasOwnProperty` method of `object`', function(assert) {
//       assert.expect(1);

//       var object = { 'hasOwnProperty': null, 'a': 1 };
//       assert.strictEqual(func(object, 'a'), true);
//     });

//     QUnit.test('`_.' + methodName + '` should support deep paths', function(assert) {
//       assert.expect(4);

//       var object = { 'a': { 'b': 2 } };

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         assert.strictEqual(func(object, path), true);
//       });

//       lodashStable.each(['a.a', ['a', 'a']], function(path) {
//         assert.strictEqual(func(object, path), false);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should coerce `path` to a string', function(assert) {
//       assert.expect(2);

//       function fn() {}
//       fn.toString = lodashStable.constant('fn');

//       var object = { 'null': 1 , 'undefined': 2, 'fn': 3, '[object Object]': 4 },
//           paths = [null, undefined, fn, {}],
//           expected = lodashStable.map(paths, stubTrue);

//       lodashStable.times(2, function(index) {
//         var actual = lodashStable.map(paths, function(path) {
//           return func(object, index ? [path] : path);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should work with `arguments` objects', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(func(args, 1), true);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a non-string `path`', function(assert) {
//       assert.expect(2);

//       var array = [1, 2, 3];

//       lodashStable.each([1, [1]], function(path) {
//         assert.strictEqual(func(array, path), true);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should preserve the sign of `0`', function(assert) {
//       assert.expect(1);

//       var object = { '-0': 'a', '0': 'b' },
//           props = [-0, Object(-0), 0, Object(0)],
//           expected = lodashStable.map(props, stubTrue);

//       var actual = lodashStable.map(props, function(key) {
//         return func(object, key);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a symbol `path`', function(assert) {
//       assert.expect(2);

//       function Foo() {}

//       if (Symbol) {
//         Foo.prototype[symbol] = 1;

//         var symbol2 = Symbol('b');
//         defineProperty(Foo.prototype, symbol2, {
//           'configurable': true,
//           'enumerable': false,
//           'writable': true,
//           'value': 2
//         });

//         var object = isHas ? Foo.prototype : new Foo;
//         assert.strictEqual(func(object, symbol), true);
//         assert.strictEqual(func(object, symbol2), true);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('`_.' + methodName + '` should check for a key over a path', function(assert) {
//       assert.expect(2);

//       var object = { 'a.b': 1 };

//       lodashStable.each(['a.b', ['a.b']], function(path) {
//         assert.strictEqual(func(object, path), true);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `true` for indexes of sparse values', function(assert) {
//       assert.expect(1);

//       var values = [sparseArgs, sparseArray, sparseString],
//           expected = lodashStable.map(values, stubTrue);

//       var actual = lodashStable.map(values, function(value) {
//         return func(value, 0);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should return `true` for indexes of sparse values with deep paths', function(assert) {
//       assert.expect(1);

//       var values = [sparseArgs, sparseArray, sparseString],
//           expected = lodashStable.map(values, lodashStable.constant([true, true]));

//       var actual = lodashStable.map(values, function(value) {
//         return lodashStable.map(['a[0]', ['a', '0']], function(path) {
//           return func({ 'a': value }, path);
//         });
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should return `' + (isHas ? 'false' : 'true') + '` for inherited properties', function(assert) {
//       assert.expect(2);

//       function Foo() {}
//       Foo.prototype.a = 1;

//       lodashStable.each(['a', ['a']], function(path) {
//         assert.strictEqual(func(new Foo, path), !isHas);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `' + (isHas ? 'false' : 'true') + '` for nested inherited properties', function(assert) {
//       assert.expect(2);

//       function Foo() {}
//       Foo.prototype.a = { 'b': 1 };

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         assert.strictEqual(func(new Foo, path), !isHas);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `false` when `object` is nullish', function(assert) {
//       assert.expect(2);

//       var values = [null, undefined],
//           expected = lodashStable.map(values, stubFalse);

//       lodashStable.each(['constructor', ['constructor']], function(path) {
//         var actual = lodashStable.map(values, function(value) {
//           return func(value, path);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `false` for deep paths when `object` is nullish', function(assert) {
//       assert.expect(2);

//       var values = [null, undefined],
//           expected = lodashStable.map(values, stubFalse);

//       lodashStable.each(['constructor.prototype.valueOf', ['constructor', 'prototype', 'valueOf']], function(path) {
//         var actual = lodashStable.map(values, function(value) {
//           return func(value, path);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `false` for nullish values of nested objects', function(assert) {
//       assert.expect(2);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, stubFalse);

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         var actual = lodashStable.map(values, function(value, index) {
//           var object = index ? { 'a': value } : {};
//           return func(object, path);
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('`_.' + methodName + '` should return `false` over sparse values of deep paths', function(assert) {
//       assert.expect(1);

//       var values = [sparseArgs, sparseArray, sparseString],
//           expected = lodashStable.map(values, lodashStable.constant([false, false]));

//       var actual = lodashStable.map(values, function(value) {
//         return lodashStable.map(['a[0].b', ['a', '0', 'b']], function(path) {
//           return func({ 'a': value }, path);
//         });
//       });

//       assert.deepEqual(actual, expected);
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.head');

//   (function() {
//     var array = [1, 2, 3, 4];

//     QUnit.test('should return the first element', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.head(array), 1);
//     });

//     QUnit.test('should return `undefined` when querying empty arrays', function(assert) {
//       assert.expect(1);

//       arrayProto[0] = 1;
//       assert.strictEqual(_.head([]), undefined);
//       arrayProto.length = 0;
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
//           actual = lodashStable.map(array, _.head);

//       assert.deepEqual(actual, [1, 4, 7]);
//     });

//     QUnit.test('should be aliased', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.first, _.head);
//     });

//     QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _(array);
//         assert.strictEqual(wrapped.head(), 1);
//         assert.strictEqual(wrapped.first(), 1);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _(array).chain();
//         assert.ok(wrapped.head() instanceof _);
//         assert.ok(wrapped.first() instanceof _);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should not execute immediately when explicitly chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _(array).chain();
//         assert.strictEqual(wrapped.head().__wrapped__, array);
//         assert.strictEqual(wrapped.first().__wrapped__, array);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(4);

//       if (!isNpm) {
//         var largeArray = lodashStable.range(LARGE_ARRAY_SIZE),
//             smallArray = array;

//         lodashStable.each(['head', 'first'], function(methodName) {
//           lodashStable.times(2, function(index) {
//             var array = index ? largeArray : smallArray,
//                 actual = _(array).filter(isEven)[methodName]();

//             assert.strictEqual(actual, _[methodName](_.filter(array, isEven)));
//           });
//         });
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.identity');

//   (function() {
//     QUnit.test('should return the first argument given', function(assert) {
//       assert.expect(1);

//       var object = { 'name': 'fred' };
//       assert.strictEqual(_.identity(object), object);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.includes');

//   (function() {
//     lodashStable.each({
//       'an `arguments` object': arguments,
//       'an array': [1, 2, 3, 4],
//       'an object': { 'a': 1, 'b': 2, 'c': 3, 'd': 4 },
//       'a string': '1234'
//     },
//     function(collection, key) {
//       QUnit.test('should work with ' + key + ' and  return `true` for  matched values', function(assert) {
//         assert.expect(1);

//         assert.strictEqual(_.includes(collection, 3), true);
//       });

//       QUnit.test('should work with ' + key + ' and  return `false` for unmatched values', function(assert) {
//         assert.expect(1);

//         assert.strictEqual(_.includes(collection, 5), false);
//       });

//       QUnit.test('should work with ' + key + ' and floor `position` values', function(assert) {
//         assert.expect(1);

//         assert.strictEqual(_.includes(collection, 2, 1.2), true);
//       });

//       QUnit.test('should work with ' + key + ' and return an unwrapped value implicitly when chaining', function(assert) {
//         assert.expect(1);

//         if (!isNpm) {
//           assert.strictEqual(_(collection).includes(3), true);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });

//       QUnit.test('should work with ' + key + ' and return a wrapped value when explicitly chaining', function(assert) {
//         assert.expect(1);

//         if (!isNpm) {
//           assert.ok(_(collection).chain().includes(3) instanceof _);
//         }
//         else {
//           skipAssert(assert);
//         }
//       });
//     });

//     lodashStable.each({
//       'literal': 'abc',
//       'object': Object('abc')
//     },
//     function(collection, key) {
//       QUnit.test('should work with a string ' + key + ' for `collection`', function(assert) {
//         assert.expect(2);

//         assert.strictEqual(_.includes(collection, 'bc'), true);
//         assert.strictEqual(_.includes(collection, 'd'), false);
//       });
//     });

//     QUnit.test('should return `false` for empty collections', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(empties, stubFalse);

//       var actual = lodashStable.map(empties, function(value) {
//         try {
//           return _.includes(value);
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should work with a string and a `fromIndex` >= `length`', function(assert) {
//       assert.expect(1);

//       var string = '1234',
//           length = string.length,
//           indexes = [4, 6, Math.pow(2, 32), Infinity];

//       var expected = lodashStable.map(indexes, function(index) {
//         return [false, false, index == length];
//       });

//       var actual = lodashStable.map(indexes, function(fromIndex) {
//         return [
//           _.includes(string, 1, fromIndex),
//           _.includes(string, undefined, fromIndex),
//           _.includes(string, '', fromIndex)
//         ];
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should match `NaN`', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.includes([1, NaN, 3], NaN), true);
//     });

//     QUnit.test('should match `-0` as `0`', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.includes([-0], 0), true);
//       assert.strictEqual(_.includes([0], -0), true);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.every`', function(assert) {
//       assert.expect(1);

//       var array = [2, 3, 1],
//           values = [1, 2, 3];

//       assert.ok(lodashStable.every(values, lodashStable.partial(_.includes, array)));
//     });
//   }(1, 2, 3, 4));

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.initial');

//   (function() {
//     var array = [1, 2, 3];

//     QUnit.test('should accept a falsey `array`', function(assert) {
//       assert.expect(1);

//       var expected = lodashStable.map(falsey, stubArray);

//       var actual = lodashStable.map(falsey, function(array, index) {
//         try {
//           return index ? _.initial(array) : _.initial();
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should exclude last element', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.initial(array), [1, 2]);
//     });

//     QUnit.test('should return an empty when querying empty arrays', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.initial([]), []);
//     });

//     QUnit.test('should work as an iteratee for methods like `_.map`', function(assert) {
//       assert.expect(1);

//       var array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
//           actual = lodashStable.map(array, _.initial);

//       assert.deepEqual(actual, [[1, 2], [4, 5], [7, 8]]);
//     });

//     QUnit.test('should work in a lazy sequence', function(assert) {
//       assert.expect(4);

//       if (!isNpm) {
//         var array = lodashStable.range(LARGE_ARRAY_SIZE),
//             values = [];

//         var actual = _(array).initial().filter(function(value) {
//           values.push(value);
//           return false;
//         })
//         .value();

//         assert.deepEqual(actual, []);
//         assert.deepEqual(values, _.initial(array));

//         values = [];

//         actual = _(array).filter(function(value) {
//           values.push(value);
//           return isEven(value);
//         })
//         .initial()
//         .value();

//         assert.deepEqual(actual, _.initial(lodashStable.filter(array, isEven)));
//         assert.deepEqual(values, array);
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.inRange');

//   (function() {
//     QUnit.test('should work with an `end`', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.inRange(3, 5), true);
//       assert.strictEqual(_.inRange(5, 5), false);
//       assert.strictEqual(_.inRange(6, 5), false);
//     });

//     QUnit.test('should work with a `start` and `end`', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(_.inRange(1, 1, 5), true);
//       assert.strictEqual(_.inRange(3, 1, 5), true);
//       assert.strictEqual(_.inRange(0, 1, 5), false);
//       assert.strictEqual(_.inRange(5, 1, 5), false);
//     });

//     QUnit.test('should treat falsey `start` as `0`', function(assert) {
//       assert.expect(13);

//       lodashStable.each(falsey, function(value, index) {
//         if (index) {
//           assert.strictEqual(_.inRange(0, value), false);
//           assert.strictEqual(_.inRange(0, value, 1), true);
//         } else {
//           assert.strictEqual(_.inRange(0), false);
//         }
//       });
//     });

//     QUnit.test('should swap `start` and `end` when `start` > `end`', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.inRange(2, 5, 1), true);
//       assert.strictEqual(_.inRange(-3, -2, -6), true);
//     });

//     QUnit.test('should work with a floating point `n` value', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(_.inRange(0.5, 5), true);
//       assert.strictEqual(_.inRange(1.2, 1, 5), true);
//       assert.strictEqual(_.inRange(5.2, 5), false);
//       assert.strictEqual(_.inRange(0.5, 1, 5), false);
//     });

//     QUnit.test('should coerce arguments to finite numbers', function(assert) {
//       assert.expect(1);

//       var actual = [
//         _.inRange(0, '1'),
//         _.inRange(0, '0', 1),
//         _.inRange(0, 0, '1'),
//         _.inRange(0, NaN, 1),
//         _.inRange(-1, -1, NaN)
//       ];

//       assert.deepEqual(actual, lodashStable.map(actual, stubTrue));
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('intersection methods');

//   lodashStable.each(['intersection', 'intersectionBy', 'intersectionWith'], function(methodName) {
//     var func = _[methodName];

//     QUnit.test('`_.' + methodName + '` should return the intersection of two arrays', function(assert) {
//       assert.expect(1);

//       var actual = func([2, 1], [2, 3]);
//       assert.deepEqual(actual, [2]);
//     });

//     QUnit.test('`_.' + methodName + '` should return the intersection of multiple arrays', function(assert) {
//       assert.expect(1);

//       var actual = func([2, 1, 2, 3], [3, 4], [3, 2]);
//       assert.deepEqual(actual, [3]);
//     });

//     QUnit.test('`_.' + methodName + '` should return an array of unique values', function(assert) {
//       assert.expect(1);

//       var actual = func([1, 1, 3, 2, 2], [5, 2, 2, 1, 4], [2, 1, 1]);
//       assert.deepEqual(actual, [1, 2]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with a single array', function(assert) {
//       assert.expect(1);

//       var actual = func([1, 1, 3, 2, 2]);
//       assert.deepEqual(actual, [1, 3, 2]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with `arguments` objects', function(assert) {
//       assert.expect(2);

//       var array = [0, 1, null, 3],
//           expected = [1, 3];

//       assert.deepEqual(func(array, args), expected);
//       assert.deepEqual(func(args, array), expected);
//     });

//     QUnit.test('`_.' + methodName + '` should treat `-0` as `0`', function(assert) {
//       assert.expect(1);

//       var values = [-0, 0],
//           expected = lodashStable.map(values, lodashStable.constant(['0']));

//       var actual = lodashStable.map(values, function(value) {
//         return lodashStable.map(func(values, [value]), lodashStable.toString);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should match `NaN`', function(assert) {
//       assert.expect(1);

//       var actual = func([1, NaN, 3], [NaN, 5, NaN]);
//       assert.deepEqual(actual, [NaN]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of `-0` as `0`', function(assert) {
//       assert.expect(1);

//       var values = [-0, 0],
//           expected = lodashStable.map(values, lodashStable.constant(['0']));

//       var actual = lodashStable.map(values, function(value) {
//         var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, lodashStable.constant(value));
//         return lodashStable.map(func(values, largeArray), lodashStable.toString);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of `NaN`', function(assert) {
//       assert.expect(1);

//       var largeArray = lodashStable.times(LARGE_ARRAY_SIZE, stubNaN);
//       assert.deepEqual(func([1, NaN, 3], largeArray), [NaN]);
//     });

//     QUnit.test('`_.' + methodName + '` should work with large arrays of objects', function(assert) {
//       assert.expect(2);

//       var object = {},
//           largeArray = lodashStable.times(LARGE_ARRAY_SIZE, lodashStable.constant(object));

//       assert.deepEqual(func([object], largeArray), [object]);
//       assert.deepEqual(func(lodashStable.range(LARGE_ARRAY_SIZE), [1]), [1]);
//     });

//     QUnit.test('`_.' + methodName + '` should treat values that are not arrays or `arguments` objects as empty', function(assert) {
//       assert.expect(3);

//       var array = [0, 1, null, 3];
//       assert.deepEqual(func(array, 3, { '0': 1 }, null), []);
//       assert.deepEqual(func(null, array, null, [2, 3]), []);
//       assert.deepEqual(func(array, null, args, null), []);
//     });

//     QUnit.test('`_.' + methodName + '` should return a wrapped value when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _([1, 3, 2])[methodName]([5, 2, 1, 4]);
//         assert.ok(wrapped instanceof _);
//         assert.deepEqual(wrapped.value(), [1, 2]);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   });

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.intersectionBy');

//   (function() {
//     QUnit.test('should accept an `iteratee`', function(assert) {
//       assert.expect(2);

//       var actual = _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
//       assert.deepEqual(actual, [2.1]);

//       actual = _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
//       assert.deepEqual(actual, [{ 'x': 1 }]);
//     });

//     QUnit.test('should provide correct `iteratee` arguments', function(assert) {
//       assert.expect(1);

//       var args;

//       _.intersectionBy([2.1, 1.2], [2.3, 3.4], function() {
//         args || (args = slice.call(arguments));
//       });

//       assert.deepEqual(args, [2.3]);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.intersectionWith');

//   (function() {
//     QUnit.test('should work with a `comparator`', function(assert) {
//       assert.expect(1);

//       var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }],
//           others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }],
//           actual = _.intersectionWith(objects, others, lodashStable.isEqual);

//       assert.deepEqual(actual, [objects[0]]);
//     });

//     QUnit.test('should preserve the sign of `0`', function(assert) {
//       assert.expect(1);

//       var array = [-0],
//           largeArray = lodashStable.times(LARGE_ARRAY_SIZE, stubZero),
//           others = [[0], largeArray],
//           expected = lodashStable.map(others, lodashStable.constant(['-0']));

//       var actual = lodashStable.map(others, function(other) {
//         return lodashStable.map(_.intersectionWith(array, other, lodashStable.eq), lodashStable.toString);
//       });

//       assert.deepEqual(actual, expected);
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.invert');

//   (function() {
//     QUnit.test('should invert an object', function(assert) {
//       assert.expect(2);

//       var object = { 'a': 1, 'b': 2 },
//           actual = _.invert(object);

//       assert.deepEqual(actual, { '1': 'a', '2': 'b' });
//       assert.deepEqual(_.invert(actual), { 'a': '1', 'b': '2' });
//     });

//     QUnit.test('should work with values that shadow keys on `Object.prototype`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 'hasOwnProperty', 'b': 'constructor' };
//       assert.deepEqual(_.invert(object), { 'hasOwnProperty': 'a', 'constructor': 'b' });
//     });

//     QUnit.test('should work with an object that has a `length` property', function(assert) {
//       assert.expect(1);

//       var object = { '0': 'a', '1': 'b', 'length': 2 };
//       assert.deepEqual(_.invert(object), { 'a': '0', 'b': '1', '2': 'length' });
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var object = { 'a': 1, 'b': 2 },
//             wrapped = _(object).invert();

//         assert.ok(wrapped instanceof _);
//         assert.deepEqual(wrapped.value(), { '1': 'a', '2': 'b' });
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.invertBy');

//   (function() {
//     var object = { 'a': 1, 'b': 2, 'c': 1 };

//     QUnit.test('should transform keys by `iteratee`', function(assert) {
//       assert.expect(1);

//       var expected = { 'group1': ['a', 'c'], 'group2': ['b'] };

//       var actual = _.invertBy(object, function(value) {
//         return 'group' + value;
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should use `_.identity` when `iteratee` is nullish', function(assert) {
//       assert.expect(1);

//       var values = [, null, undefined],
//           expected = lodashStable.map(values, lodashStable.constant({ '1': ['a', 'c'], '2': ['b'] }));

//       var actual = lodashStable.map(values, function(value, index) {
//         return index ? _.invertBy(object, value) : _.invertBy(object);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should only add multiple values to own, not inherited, properties', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 'hasOwnProperty', 'b': 'constructor' },
//           expected = { 'hasOwnProperty': ['a'], 'constructor': ['b'] };

//       assert.ok(lodashStable.isEqual(_.invertBy(object), expected));
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var wrapped = _(object).invertBy();

//         assert.ok(wrapped instanceof _);
//         assert.deepEqual(wrapped.value(), { '1': ['a', 'c'], '2': ['b'] });
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.invoke');

//   (function() {
//     QUnit.test('should invoke a method on `object`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': lodashStable.constant('A') },
//           actual = _.invoke(object, 'a');

//       assert.strictEqual(actual, 'A');
//     });

//     QUnit.test('should support invoking with arguments', function(assert) {
//       assert.expect(1);

//       var object = { 'a': function(a, b) { return [a, b]; } },
//           actual = _.invoke(object, 'a', 1, 2);

//       assert.deepEqual(actual, [1, 2]);
//     });

//     QUnit.test('should not error on nullish elements', function(assert) {
//       assert.expect(1);

//       var values = [null, undefined],
//           expected = lodashStable.map(values, noop);

//       var actual = lodashStable.map(values, function(value) {
//         try {
//           return _.invoke(value, 'a.b', 1, 2);
//         } catch (e) {}
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should preserve the sign of `0`', function(assert) {
//       assert.expect(1);

//       var object = { '-0': stubA, '0': stubB },
//           props = [-0, Object(-0), 0, Object(0)];

//       var actual = lodashStable.map(props, function(key) {
//         return _.invoke(object, key);
//       });

//       assert.deepEqual(actual, ['a', 'a', 'b', 'b']);
//     });

//     QUnit.test('should support deep paths', function(assert) {
//       assert.expect(2);

//       var object = { 'a': { 'b': function(a, b) { return [a, b]; } } };

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         var actual = _.invoke(object, path, 1, 2);
//         assert.deepEqual(actual, [1, 2]);
//       });
//     });

//     QUnit.test('should invoke deep property methods with the correct `this` binding', function(assert) {
//       assert.expect(2);

//       var object = { 'a': { 'b': function() { return this.c; }, 'c': 1 } };

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         assert.deepEqual(_.invoke(object, path), 1);
//       });
//     });

//     QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var object = { 'a': stubOne };
//         assert.strictEqual(_(object).invoke('a'), 1);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         var object = { 'a': stubOne };
//         assert.ok(_(object).chain().invoke('a') instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.invokeMap');

//   (function() {
//     QUnit.test('should invoke a methods on each element of `collection`', function(assert) {
//       assert.expect(1);

//       var array = ['a', 'b', 'c'],
//           actual = _.invokeMap(array, 'toUpperCase');

//       assert.deepEqual(actual, ['A', 'B', 'C']);
//     });

//     QUnit.test('should support invoking with arguments', function(assert) {
//       assert.expect(1);

//       var array = [function() { return slice.call(arguments); }],
//           actual = _.invokeMap(array, 'call', null, 'a', 'b', 'c');

//       assert.deepEqual(actual, [['a', 'b', 'c']]);
//     });

//     QUnit.test('should work with a function for `methodName`', function(assert) {
//       assert.expect(1);

//       var array = ['a', 'b', 'c'];

//       var actual = _.invokeMap(array, function(left, right) {
//         return left + this.toUpperCase() + right;
//       }, '(', ')');

//       assert.deepEqual(actual, ['(A)', '(B)', '(C)']);
//     });

//     QUnit.test('should work with an object for `collection`', function(assert) {
//       assert.expect(1);

//       var object = { 'a': 1, 'b': 2, 'c': 3 },
//           actual = _.invokeMap(object, 'toFixed', 1);

//       assert.deepEqual(actual, ['1.0', '2.0', '3.0']);
//     });

//     QUnit.test('should treat number values for `collection` as empty', function(assert) {
//       assert.expect(1);

//       assert.deepEqual(_.invokeMap(1), []);
//     });

//     QUnit.test('should not error on nullish elements', function(assert) {
//       assert.expect(1);

//       var array = ['a', null, undefined, 'd'];

//       try {
//         var actual = _.invokeMap(array, 'toUpperCase');
//       } catch (e) {}

//       assert.deepEqual(actual, ['A', undefined, undefined, 'D']);
//     });

//     QUnit.test('should not error on elements with missing properties', function(assert) {
//       assert.expect(1);

//       var objects = lodashStable.map([null, undefined, stubOne], function(value) {
//         return { 'a': value };
//       });

//       var expected = lodashStable.map(objects, function(object) {
//         return object.a ? object.a() : undefined;
//       });

//       try {
//         var actual = _.invokeMap(objects, 'a');
//       } catch (e) {}

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should invoke deep property methods with the correct `this` binding', function(assert) {
//       assert.expect(2);

//       var object = { 'a': { 'b': function() { return this.c; }, 'c': 1 } };

//       lodashStable.each(['a.b', ['a', 'b']], function(path) {
//         assert.deepEqual(_.invokeMap([object], path), [1]);
//       });
//     });

//     QUnit.test('should return a wrapped value when chaining', function(assert) {
//       assert.expect(4);

//       if (!isNpm) {
//         var array = ['a', 'b', 'c'],
//             wrapped = _(array),
//             actual = wrapped.invokeMap('toUpperCase');

//         assert.ok(actual instanceof _);
//         assert.deepEqual(actual.valueOf(), ['A', 'B', 'C']);

//         actual = wrapped.invokeMap(function(left, right) {
//           return left + this.toUpperCase() + right;
//         }, '(', ')');

//         assert.ok(actual instanceof _);
//         assert.deepEqual(actual.valueOf(), ['(A)', '(B)', '(C)']);
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should support shortcut fusion', function(assert) {
//       assert.expect(2);

//       if (!isNpm) {
//         var count = 0,
//             method = function() { count++; return this.index; };

//         var array = lodashStable.times(LARGE_ARRAY_SIZE, function(index) {
//           return { 'index': index, 'method': method };
//         });

//         var actual = _(array).invokeMap('method').take(1).value();

//         assert.strictEqual(count, 1);
//         assert.deepEqual(actual, [0]);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isArguments');

//   (function() {
//     QUnit.test('should return `true` for `arguments` objects', function(assert) {
//       assert.expect(2);

//       assert.strictEqual(_.isArguments(args), true);
//       assert.strictEqual(_.isArguments(strictArgs), true);
//     });

//     QUnit.test('should return `false` for non `arguments` objects', function(assert) {
//       assert.expect(12);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isArguments(value) : _.isArguments();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isArguments([1, 2, 3]), false);
//       assert.strictEqual(_.isArguments(true), false);
//       assert.strictEqual(_.isArguments(new Date), false);
//       assert.strictEqual(_.isArguments(new Error), false);
//       assert.strictEqual(_.isArguments(_), false);
//       assert.strictEqual(_.isArguments(slice), false);
//       assert.strictEqual(_.isArguments({ '0': 1, 'callee': noop, 'length': 1 }), false);
//       assert.strictEqual(_.isArguments(1), false);
//       assert.strictEqual(_.isArguments(/x/), false);
//       assert.strictEqual(_.isArguments('a'), false);
//       assert.strictEqual(_.isArguments(symbol), false);
//     });

//     QUnit.test('should work with an `arguments` object from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.arguments) {
//         assert.strictEqual(_.isArguments(realm.arguments), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isArray');

//   (function() {
//     QUnit.test('should return `true` for arrays', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.isArray([1, 2, 3]), true);
//     });

//     QUnit.test('should return `false` for non-arrays', function(assert) {
//       assert.expect(12);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isArray(value) : _.isArray();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isArray(args), false);
//       assert.strictEqual(_.isArray(true), false);
//       assert.strictEqual(_.isArray(new Date), false);
//       assert.strictEqual(_.isArray(new Error), false);
//       assert.strictEqual(_.isArray(_), false);
//       assert.strictEqual(_.isArray(slice), false);
//       assert.strictEqual(_.isArray({ '0': 1, 'length': 1 }), false);
//       assert.strictEqual(_.isArray(1), false);
//       assert.strictEqual(_.isArray(/x/), false);
//       assert.strictEqual(_.isArray('a'), false);
//       assert.strictEqual(_.isArray(symbol), false);
//     });

//     QUnit.test('should work with an array from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.array) {
//         assert.strictEqual(_.isArray(realm.array), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isArrayBuffer');

//   (function() {
//     QUnit.test('should return `true` for array buffers', function(assert) {
//       assert.expect(1);

//       if (ArrayBuffer) {
//         assert.strictEqual(_.isArrayBuffer(arrayBuffer), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return `false` for non array buffers', function(assert) {
//       assert.expect(13);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isArrayBuffer(value) : _.isArrayBuffer();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isArrayBuffer(args), false);
//       assert.strictEqual(_.isArrayBuffer([1]), false);
//       assert.strictEqual(_.isArrayBuffer(true), false);
//       assert.strictEqual(_.isArrayBuffer(new Date), false);
//       assert.strictEqual(_.isArrayBuffer(new Error), false);
//       assert.strictEqual(_.isArrayBuffer(_), false);
//       assert.strictEqual(_.isArrayBuffer(slice), false);
//       assert.strictEqual(_.isArrayBuffer({ 'a': 1 }), false);
//       assert.strictEqual(_.isArrayBuffer(1), false);
//       assert.strictEqual(_.isArrayBuffer(/x/), false);
//       assert.strictEqual(_.isArrayBuffer('a'), false);
//       assert.strictEqual(_.isArrayBuffer(symbol), false);
//     });

//     QUnit.test('should work with array buffers from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.arrayBuffer) {
//         assert.strictEqual(_.isArrayBuffer(realm.arrayBuffer), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isArrayLike');

//   (function() {
//     QUnit.test('should return `true` for array-like values', function(assert) {
//       assert.expect(1);

//       var values = [args, [1, 2, 3], { '0': 'a', 'length': 1 }, 'a'],
//           expected = lodashStable.map(values, stubTrue),
//           actual = lodashStable.map(values, _.isArrayLike);

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return `false` for non-arrays', function(assert) {
//       assert.expect(12);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === '';
//       });

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isArrayLike(value) : _.isArrayLike();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isArrayLike(true), false);
//       assert.strictEqual(_.isArrayLike(new Date), false);
//       assert.strictEqual(_.isArrayLike(new Error), false);
//       assert.strictEqual(_.isArrayLike(_), false);
//       assert.strictEqual(_.isArrayLike(asyncFunc), false);
//       assert.strictEqual(_.isArrayLike(genFunc), false);
//       assert.strictEqual(_.isArrayLike(slice), false);
//       assert.strictEqual(_.isArrayLike({ 'a': 1 }), false);
//       assert.strictEqual(_.isArrayLike(1), false);
//       assert.strictEqual(_.isArrayLike(/x/), false);
//       assert.strictEqual(_.isArrayLike(symbol), false);
//     });

//     QUnit.test('should work with an array from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.object) {
//         var values = [realm.arguments, realm.array, realm.string],
//             expected = lodashStable.map(values, stubTrue),
//             actual = lodashStable.map(values, _.isArrayLike);

//         assert.deepEqual(actual, expected);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isBoolean');

//   (function() {
//     QUnit.test('should return `true` for booleans', function(assert) {
//       assert.expect(4);

//       assert.strictEqual(_.isBoolean(true), true);
//       assert.strictEqual(_.isBoolean(false), true);
//       assert.strictEqual(_.isBoolean(Object(true)), true);
//       assert.strictEqual(_.isBoolean(Object(false)), true);
//     });

//     QUnit.test('should return `false` for non-booleans', function(assert) {
//       assert.expect(12);

//       var expected = lodashStable.map(falsey, function(value) {
//         return value === false;
//       });

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isBoolean(value) : _.isBoolean();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isBoolean(args), false);
//       assert.strictEqual(_.isBoolean([1, 2, 3]), false);
//       assert.strictEqual(_.isBoolean(new Date), false);
//       assert.strictEqual(_.isBoolean(new Error), false);
//       assert.strictEqual(_.isBoolean(_), false);
//       assert.strictEqual(_.isBoolean(slice), false);
//       assert.strictEqual(_.isBoolean({ 'a': 1 }), false);
//       assert.strictEqual(_.isBoolean(1), false);
//       assert.strictEqual(_.isBoolean(/x/), false);
//       assert.strictEqual(_.isBoolean('a'), false);
//       assert.strictEqual(_.isBoolean(symbol), false);
//     });

//     QUnit.test('should work with a boolean from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.boolean) {
//         assert.strictEqual(_.isBoolean(realm.boolean), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isBuffer');

//   (function() {
//     QUnit.test('should return `true` for buffers', function(assert) {
//       assert.expect(1);

//       if (Buffer) {
//         assert.strictEqual(_.isBuffer(new Buffer(2)), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return `false` for non-buffers', function(assert) {
//       assert.expect(13);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isBuffer(value) : _.isBuffer();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isBuffer(args), false);
//       assert.strictEqual(_.isBuffer([1]), false);
//       assert.strictEqual(_.isBuffer(true), false);
//       assert.strictEqual(_.isBuffer(new Date), false);
//       assert.strictEqual(_.isBuffer(new Error), false);
//       assert.strictEqual(_.isBuffer(_), false);
//       assert.strictEqual(_.isBuffer(slice), false);
//       assert.strictEqual(_.isBuffer({ 'a': 1 }), false);
//       assert.strictEqual(_.isBuffer(1), false);
//       assert.strictEqual(_.isBuffer(/x/), false);
//       assert.strictEqual(_.isBuffer('a'), false);
//       assert.strictEqual(_.isBuffer(symbol), false);
//     });

//     QUnit.test('should return `false` if `Buffer` is not defined', function(assert) {
//       assert.expect(1);

//       if (!isStrict && Buffer && lodashBizarro) {
//         assert.strictEqual(lodashBizarro.isBuffer(new Buffer(2)), false);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isDate');

//   (function() {
//     QUnit.test('should return `true` for dates', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.isDate(new Date), true);
//     });

//     QUnit.test('should return `false` for non-dates', function(assert) {
//       assert.expect(12);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isDate(value) : _.isDate();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isDate(args), false);
//       assert.strictEqual(_.isDate([1, 2, 3]), false);
//       assert.strictEqual(_.isDate(true), false);
//       assert.strictEqual(_.isDate(new Error), false);
//       assert.strictEqual(_.isDate(_), false);
//       assert.strictEqual(_.isDate(slice), false);
//       assert.strictEqual(_.isDate({ 'a': 1 }), false);
//       assert.strictEqual(_.isDate(1), false);
//       assert.strictEqual(_.isDate(/x/), false);
//       assert.strictEqual(_.isDate('a'), false);
//       assert.strictEqual(_.isDate(symbol), false);
//     });

//     QUnit.test('should work with a date object from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.date) {
//         assert.strictEqual(_.isDate(realm.date), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isElement');

//   (function() {
//     QUnit.test('should return `true` for elements', function(assert) {
//       assert.expect(1);

//       if (document) {
//         assert.strictEqual(_.isElement(body), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return `true` for non-plain objects', function(assert) {
//       assert.expect(1);

//       function Foo() {
//         this.nodeType = 1;
//       }

//       assert.strictEqual(_.isElement(new Foo), true);
//     });

//     QUnit.test('should return `false` for non DOM elements', function(assert) {
//       assert.expect(13);

//       var expected = lodashStable.map(falsey, stubFalse);

//       var actual = lodashStable.map(falsey, function(value, index) {
//         return index ? _.isElement(value) : _.isElement();
//       });

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isElement(args), false);
//       assert.strictEqual(_.isElement([1, 2, 3]), false);
//       assert.strictEqual(_.isElement(true), false);
//       assert.strictEqual(_.isElement(new Date), false);
//       assert.strictEqual(_.isElement(new Error), false);
//       assert.strictEqual(_.isElement(_), false);
//       assert.strictEqual(_.isElement(slice), false);
//       assert.strictEqual(_.isElement({ 'a': 1 }), false);
//       assert.strictEqual(_.isElement(1), false);
//       assert.strictEqual(_.isElement(/x/), false);
//       assert.strictEqual(_.isElement('a'), false);
//       assert.strictEqual(_.isElement(symbol), false);
//     });

//     QUnit.test('should return `false` for plain objects', function(assert) {
//       assert.expect(6);

//       assert.strictEqual(_.isElement({ 'nodeType': 1 }), false);
//       assert.strictEqual(_.isElement({ 'nodeType': Object(1) }), false);
//       assert.strictEqual(_.isElement({ 'nodeType': true }), false);
//       assert.strictEqual(_.isElement({ 'nodeType': [1] }), false);
//       assert.strictEqual(_.isElement({ 'nodeType': '1' }), false);
//       assert.strictEqual(_.isElement({ 'nodeType': '001' }), false);
//     });

//     QUnit.test('should work with a DOM element from another realm', function(assert) {
//       assert.expect(1);

//       if (realm.element) {
//         assert.strictEqual(_.isElement(realm.element), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());

//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isEmpty');

//   (function() {
//     QUnit.test('should return `true` for empty values', function(assert) {
//       assert.expect(10);

//       var expected = lodashStable.map(empties, stubTrue),
//           actual = lodashStable.map(empties, _.isEmpty);

//       assert.deepEqual(actual, expected);

//       assert.strictEqual(_.isEmpty(true), true);
//       assert.strictEqual(_.isEmpty(slice), true);
//       assert.strictEqual(_.isEmpty(1), true);
//       assert.strictEqual(_.isEmpty(NaN), true);
//       assert.strictEqual(_.isEmpty(/x/), true);
//       assert.strictEqual(_.isEmpty(symbol), true);
//       assert.strictEqual(_.isEmpty(), true);

//       if (Buffer) {
//         assert.strictEqual(_.isEmpty(new Buffer(0)), true);
//         assert.strictEqual(_.isEmpty(new Buffer(1)), false);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should return `false` for non-empty values', function(assert) {
//       assert.expect(3);

//       assert.strictEqual(_.isEmpty([0]), false);
//       assert.strictEqual(_.isEmpty({ 'a': 0 }), false);
//       assert.strictEqual(_.isEmpty('a'), false);
//     });

//     QUnit.test('should work with an object that has a `length` property', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.isEmpty({ 'length': 0 }), false);
//     });

//     QUnit.test('should work with `arguments` objects', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.isEmpty(args), false);
//     });

//     QUnit.test('should work with prototytpe objects', function(assert) {
//       assert.expect(2);

//       function Foo() {}
//       Foo.prototype = { 'constructor': Foo };

//       assert.strictEqual(_.isEmpty(Foo.prototype), true);

//       Foo.prototype.a = 1;
//       assert.strictEqual(_.isEmpty(Foo.prototype), false);
//     });

//     QUnit.test('should work with jQuery/MooTools DOM query collections', function(assert) {
//       assert.expect(1);

//       function Foo(elements) {
//         push.apply(this, elements);
//       }
//       Foo.prototype = { 'length': 0, 'splice': arrayProto.splice };

//       assert.strictEqual(_.isEmpty(new Foo([])), true);
//     });

//     QUnit.test('should work with maps', function(assert) {
//       assert.expect(4);

//       if (Map) {
//         lodashStable.each([new Map, realm.map], function(map) {
//           assert.strictEqual(_.isEmpty(map), true);
//           map.set('a', 1);
//           assert.strictEqual(_.isEmpty(map), false);
//           map.clear();
//         });
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should work with sets', function(assert) {
//       assert.expect(4);

//       if (Set) {
//         lodashStable.each([new Set, realm.set], function(set) {
//           assert.strictEqual(_.isEmpty(set), true);
//           set.add(1);
//           assert.strictEqual(_.isEmpty(set), false);
//           set.clear();
//         });
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should not treat objects with negative lengths as array-like', function(assert) {
//       assert.expect(1);

//       function Foo() {}
//       Foo.prototype.length = -1;

//       assert.strictEqual(_.isEmpty(new Foo), true);
//     });

//     QUnit.test('should not treat objects with lengths larger than `MAX_SAFE_INTEGER` as array-like', function(assert) {
//       assert.expect(1);

//       function Foo() {}
//       Foo.prototype.length = MAX_SAFE_INTEGER + 1;

//       assert.strictEqual(_.isEmpty(new Foo), true);
//     });

//     QUnit.test('should not treat objects with non-number lengths as array-like', function(assert) {
//       assert.expect(1);

//       assert.strictEqual(_.isEmpty({ 'length': '0' }), false);
//     });

//     QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.strictEqual(_({}).isEmpty(), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.ok(_({}).chain().isEmpty() instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());
















//   /*--------------------------------------------------------------------------*/

//   QUnit.module('lodash.isEqual');

//   (function() {
//     var symbol1 = Symbol ? Symbol('a') : true,
//         symbol2 = Symbol ? Symbol('b') : false;

//     QUnit.test('should compare primitives', function(assert) {
//       assert.expect(1);

//       var pairs = [
//         [1, 1, true], [1, Object(1), true], [1, '1', false], [1, 2, false],
//         [-0, -0, true], [0, 0, true], [0, Object(0), true], [Object(0), Object(0), true], [-0, 0, true], [0, '0', false], [0, null, false],
//         [NaN, NaN, true], [NaN, Object(NaN), true], [Object(NaN), Object(NaN), true], [NaN, 'a', false], [NaN, Infinity, false],
//         ['a', 'a', true], ['a', Object('a'), true], [Object('a'), Object('a'), true], ['a', 'b', false], ['a', ['a'], false],
//         [true, true, true], [true, Object(true), true], [Object(true), Object(true), true], [true, 1, false], [true, 'a', false],
//         [false, false, true], [false, Object(false), true], [Object(false), Object(false), true], [false, 0, false], [false, '', false],
//         [symbol1, symbol1, true], [symbol1, Object(symbol1), true], [Object(symbol1), Object(symbol1), true], [symbol1, symbol2, false],
//         [null, null, true], [null, undefined, false], [null, {}, false], [null, '', false],
//         [undefined, undefined, true], [undefined, null, false], [undefined, '', false]
//       ];

//       var expected = lodashStable.map(pairs, function(pair) {
//         return pair[2];
//       });

//       var actual = lodashStable.map(pairs, function(pair) {
//         return _.isEqual(pair[0], pair[1]);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should compare arrays', function(assert) {
//       assert.expect(6);

//       var array1 = [true, null, 1, 'a', undefined],
//           array2 = [true, null, 1, 'a', undefined];

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { 'e': 1 }];
//       array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { 'e': 1 }];

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = [1];
//       array1[2] = 3;

//       array2 = [1];
//       array2[1] = undefined;
//       array2[2] = 3;

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = [Object(1), false, Object('a'), /x/, new Date(2012, 4, 23), ['a', 'b', [Object('c')]], { 'a': 1 }];
//       array2 = [1, Object(false), 'a', /x/, new Date(2012, 4, 23), ['a', Object('b'), ['c']], { 'a': 1 }];

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = [1, 2, 3];
//       array2 = [3, 2, 1];

//       assert.strictEqual(_.isEqual(array1, array2), false);

//       array1 = [1, 2];
//       array2 = [1, 2, 3];

//       assert.strictEqual(_.isEqual(array1, array2), false);
//     });

//     QUnit.test('should treat arrays with identical values but different non-index properties as equal', function(assert) {
//       assert.expect(3);

//       var array1 = [1, 2, 3],
//           array2 = [1, 2, 3];

//       array1.every = array1.filter = array1.forEach =
//       array1.indexOf = array1.lastIndexOf = array1.map =
//       array1.some = array1.reduce = array1.reduceRight = null;

//       array2.concat = array2.join = array2.pop =
//       array2.reverse = array2.shift = array2.slice =
//       array2.sort = array2.splice = array2.unshift = null;

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = [1, 2, 3];
//       array1.a = 1;

//       array2 = [1, 2, 3];
//       array2.b = 1;

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1 = /c/.exec('abcde');
//       array2 = ['c'];

//       assert.strictEqual(_.isEqual(array1, array2), true);
//     });

//     QUnit.test('should compare sparse arrays', function(assert) {
//       assert.expect(3);

//       var array = Array(1);

//       assert.strictEqual(_.isEqual(array, Array(1)), true);
//       assert.strictEqual(_.isEqual(array, [undefined]), true);
//       assert.strictEqual(_.isEqual(array, Array(2)), false);
//     });

//     QUnit.test('should compare plain objects', function(assert) {
//       assert.expect(5);

//       var object1 = { 'a': true, 'b': null, 'c': 1, 'd': 'a', 'e': undefined },
//           object2 = { 'a': true, 'b': null, 'c': 1, 'd': 'a', 'e': undefined };

//       assert.strictEqual(_.isEqual(object1, object2), true);

//       object1 = { 'a': [1, 2, 3], 'b': new Date(2012, 4, 23), 'c': /x/, 'd': { 'e': 1 } };
//       object2 = { 'a': [1, 2, 3], 'b': new Date(2012, 4, 23), 'c': /x/, 'd': { 'e': 1 } };

//       assert.strictEqual(_.isEqual(object1, object2), true);

//       object1 = { 'a': 1, 'b': 2, 'c': 3 };
//       object2 = { 'a': 3, 'b': 2, 'c': 1 };

//       assert.strictEqual(_.isEqual(object1, object2), false);

//       object1 = { 'a': 1, 'b': 2, 'c': 3 };
//       object2 = { 'd': 1, 'e': 2, 'f': 3 };

//       assert.strictEqual(_.isEqual(object1, object2), false);

//       object1 = { 'a': 1, 'b': 2 };
//       object2 = { 'a': 1, 'b': 2, 'c': 3 };

//       assert.strictEqual(_.isEqual(object1, object2), false);
//     });

//     QUnit.test('should compare objects regardless of key order', function(assert) {
//       assert.expect(1);

//       var object1 = { 'a': 1, 'b': 2, 'c': 3 },
//           object2 = { 'c': 3, 'a': 1, 'b': 2 };

//       assert.strictEqual(_.isEqual(object1, object2), true);
//     });

//     QUnit.test('should compare nested objects', function(assert) {
//       assert.expect(1);

//       var object1 = {
//         'a': [1, 2, 3],
//         'b': true,
//         'c': Object(1),
//         'd': 'a',
//         'e': {
//           'f': ['a', Object('b'), 'c'],
//           'g': Object(false),
//           'h': new Date(2012, 4, 23),
//           'i': noop,
//           'j': 'a'
//         }
//       };

//       var object2 = {
//         'a': [1, Object(2), 3],
//         'b': Object(true),
//         'c': 1,
//         'd': Object('a'),
//         'e': {
//           'f': ['a', 'b', 'c'],
//           'g': false,
//           'h': new Date(2012, 4, 23),
//           'i': noop,
//           'j': 'a'
//         }
//       };

//       assert.strictEqual(_.isEqual(object1, object2), true);
//     });

//     QUnit.test('should compare object instances', function(assert) {
//       assert.expect(4);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.a = 1;

//       function Bar() {
//         this.a = 1;
//       }
//       Bar.prototype.a = 2;

//       assert.strictEqual(_.isEqual(new Foo, new Foo), true);
//       assert.strictEqual(_.isEqual(new Foo, new Bar), false);
//       assert.strictEqual(_.isEqual({ 'a': 1 }, new Foo), false);
//       assert.strictEqual(_.isEqual({ 'a': 2 }, new Bar), false);
//     });

//     QUnit.test('should compare objects with constructor properties', function(assert) {
//       assert.expect(5);

//       assert.strictEqual(_.isEqual({ 'constructor': 1 },   { 'constructor': 1 }), true);
//       assert.strictEqual(_.isEqual({ 'constructor': 1 },   { 'constructor': '1' }), false);
//       assert.strictEqual(_.isEqual({ 'constructor': [1] }, { 'constructor': [1] }), true);
//       assert.strictEqual(_.isEqual({ 'constructor': [1] }, { 'constructor': ['1'] }), false);
//       assert.strictEqual(_.isEqual({ 'constructor': Object }, {}), false);
//     });

//     QUnit.test('should compare arrays with circular references', function(assert) {
//       assert.expect(4);

//       var array1 = [],
//           array2 = [];

//       array1.push(array1);
//       array2.push(array2);

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1.push('b');
//       array2.push('b');

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1.push('c');
//       array2.push('d');

//       assert.strictEqual(_.isEqual(array1, array2), false);

//       array1 = ['a', 'b', 'c'];
//       array1[1] = array1;
//       array2 = ['a', ['a', 'b', 'c'], 'c'];

//       assert.strictEqual(_.isEqual(array1, array2), false);
//     });

//     QUnit.test('should have transitive equivalence for circular references of arrays', function(assert) {
//       assert.expect(3);

//       var array1 = [],
//           array2 = [array1],
//           array3 = [array2];

//       array1[0] = array1;

//       assert.strictEqual(_.isEqual(array1, array2), true);
//       assert.strictEqual(_.isEqual(array2, array3), true);
//       assert.strictEqual(_.isEqual(array1, array3), true);
//     });

//     QUnit.test('should compare objects with circular references', function(assert) {
//       assert.expect(4);

//       var object1 = {},
//           object2 = {};

//       object1.a = object1;
//       object2.a = object2;

//       assert.strictEqual(_.isEqual(object1, object2), true);

//       object1.b = 0;
//       object2.b = Object(0);

//       assert.strictEqual(_.isEqual(object1, object2), true);

//       object1.c = Object(1);
//       object2.c = Object(2);

//       assert.strictEqual(_.isEqual(object1, object2), false);

//       object1 = { 'a': 1, 'b': 2, 'c': 3 };
//       object1.b = object1;
//       object2 = { 'a': 1, 'b': { 'a': 1, 'b': 2, 'c': 3 }, 'c': 3 };

//       assert.strictEqual(_.isEqual(object1, object2), false);
//     });

//     QUnit.test('should have transitive equivalence for circular references of objects', function(assert) {
//       assert.expect(3);

//       var object1 = {},
//           object2 = { 'a': object1 },
//           object3 = { 'a': object2 };

//       object1.a = object1;

//       assert.strictEqual(_.isEqual(object1, object2), true);
//       assert.strictEqual(_.isEqual(object2, object3), true);
//       assert.strictEqual(_.isEqual(object1, object3), true);
//     });

//     QUnit.test('should compare objects with multiple circular references', function(assert) {
//       assert.expect(3);

//       var array1 = [{}],
//           array2 = [{}];

//       (array1[0].a = array1).push(array1);
//       (array2[0].a = array2).push(array2);

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1[0].b = 0;
//       array2[0].b = Object(0);

//       assert.strictEqual(_.isEqual(array1, array2), true);

//       array1[0].c = Object(1);
//       array2[0].c = Object(2);

//       assert.strictEqual(_.isEqual(array1, array2), false);
//     });

//     QUnit.test('should compare objects with complex circular references', function(assert) {
//       assert.expect(1);

//       var object1 = {
//         'foo': { 'b': { 'c': { 'd': {} } } },
//         'bar': { 'a': 2 }
//       };

//       var object2 = {
//         'foo': { 'b': { 'c': { 'd': {} } } },
//         'bar': { 'a': 2 }
//       };

//       object1.foo.b.c.d = object1;
//       object1.bar.b = object1.foo.b;

//       object2.foo.b.c.d = object2;
//       object2.bar.b = object2.foo.b;

//       assert.strictEqual(_.isEqual(object1, object2), true);
//     });

//     QUnit.test('should compare objects with shared property values', function(assert) {
//       assert.expect(1);

//       var object1 = {
//         'a': [1, 2]
//       };

//       var object2 = {
//         'a': [1, 2],
//         'b': [1, 2]
//       };

//       object1.b = object1.a;

//       assert.strictEqual(_.isEqual(object1, object2), true);
//     });

//     QUnit.test('should treat objects created by `Object.create(null)` like plain objects', function(assert) {
//       assert.expect(2);

//       function Foo() {
//         this.a = 1;
//       }
//       Foo.prototype.constructor = null;

//       var object1 = create(null);
//       object1.a = 1;

//       var object2 = { 'a': 1 };

//       assert.strictEqual(_.isEqual(object1, object2), true);
//       assert.strictEqual(_.isEqual(new Foo, object2), false);
//     });

//     QUnit.test('should avoid common type coercions', function(assert) {
//       assert.expect(9);

//       assert.strictEqual(_.isEqual(true, Object(false)), false);
//       assert.strictEqual(_.isEqual(Object(false), Object(0)), false);
//       assert.strictEqual(_.isEqual(false, Object('')), false);
//       assert.strictEqual(_.isEqual(Object(36), Object('36')), false);
//       assert.strictEqual(_.isEqual(0, ''), false);
//       assert.strictEqual(_.isEqual(1, true), false);
//       assert.strictEqual(_.isEqual(1337756400000, new Date(2012, 4, 23)), false);
//       assert.strictEqual(_.isEqual('36', 36), false);
//       assert.strictEqual(_.isEqual(36, '36'), false);
//     });

//     QUnit.test('should compare `arguments` objects', function(assert) {
//       assert.expect(2);

//       var args1 = (function() { return arguments; }()),
//           args2 = (function() { return arguments; }()),
//           args3 = (function() { return arguments; }(1, 2));

//       assert.strictEqual(_.isEqual(args1, args2), true);
//       assert.strictEqual(_.isEqual(args1, args3), false);
//     });

//     QUnit.test('should treat `arguments` objects like `Object` objects', function(assert) {
//       assert.expect(4);

//       var object = { '0': 1, '1': 2, '2': 3 };

//       function Foo() {}
//       Foo.prototype = object;

//       assert.strictEqual(_.isEqual(args, object), true);
//       assert.strictEqual(_.isEqual(object, args), true);
//       assert.strictEqual(_.isEqual(args, new Foo), false);
//       assert.strictEqual(_.isEqual(new Foo, args), false);
//     });

//     QUnit.test('should compare array buffers', function(assert) {
//       assert.expect(2);

//       if (ArrayBuffer) {
//         var buffer = new Int8Array([-1]).buffer;

//         assert.strictEqual(_.isEqual(buffer, new Uint8Array([255]).buffer), true);
//         assert.strictEqual(_.isEqual(buffer, new ArrayBuffer(1)), false);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should compare array views', function(assert) {
//       assert.expect(2);

//       lodashStable.times(2, function(index) {
//         var ns = index ? realm : root;

//         var pairs = lodashStable.map(arrayViews, function(type, viewIndex) {
//           var otherType = arrayViews[(viewIndex + 1) % arrayViews.length],
//               CtorA = ns[type] || function(n) { this.n = n; },
//               CtorB = ns[otherType] || function(n) { this.n = n; },
//               bufferA = ns[type] ? new ns.ArrayBuffer(8) : 8,
//               bufferB = ns[otherType] ? new ns.ArrayBuffer(8) : 8,
//               bufferC = ns[otherType] ? new ns.ArrayBuffer(16) : 16;

//           return [new CtorA(bufferA), new CtorA(bufferA), new CtorB(bufferB), new CtorB(bufferC)];
//         });

//         var expected = lodashStable.map(pairs, lodashStable.constant([true, false, false]));

//         var actual = lodashStable.map(pairs, function(pair) {
//           return [_.isEqual(pair[0], pair[1]), _.isEqual(pair[0], pair[2]), _.isEqual(pair[2], pair[3])];
//         });

//         assert.deepEqual(actual, expected);
//       });
//     });

//     QUnit.test('should compare buffers', function(assert) {
//       assert.expect(3);

//       if (Buffer) {
//         var buffer = new Buffer([1]);

//         assert.strictEqual(_.isEqual(buffer, new Buffer([1])), true);
//         assert.strictEqual(_.isEqual(buffer, new Buffer([2])), false);
//         assert.strictEqual(_.isEqual(buffer, new Uint8Array([1])), false);
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });

//     QUnit.test('should compare date objects', function(assert) {
//       assert.expect(4);

//       var date = new Date(2012, 4, 23);

//       assert.strictEqual(_.isEqual(date, new Date(2012, 4, 23)), true);
//       assert.strictEqual(_.isEqual(new Date('a'), new Date('b')), true);
//       assert.strictEqual(_.isEqual(date, new Date(2013, 3, 25)), false);
//       assert.strictEqual(_.isEqual(date, { 'getTime': lodashStable.constant(+date) }), false);
//     });

//     QUnit.test('should compare error objects', function(assert) {
//       assert.expect(1);

//       var pairs = lodashStable.map([
//         'Error',
//         'EvalError',
//         'RangeError',
//         'ReferenceError',
//         'SyntaxError',
//         'TypeError',
//         'URIError'
//       ], function(type, index, errorTypes) {
//         var otherType = errorTypes[++index % errorTypes.length],
//             CtorA = root[type],
//             CtorB = root[otherType];

//         return [new CtorA('a'), new CtorA('a'), new CtorB('a'), new CtorB('b')];
//       });

//       var expected = lodashStable.map(pairs, lodashStable.constant([true, false, false]));

//       var actual = lodashStable.map(pairs, function(pair) {
//         return [_.isEqual(pair[0], pair[1]), _.isEqual(pair[0], pair[2]), _.isEqual(pair[2], pair[3])];
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should compare functions', function(assert) {
//       assert.expect(2);

//       function a() { return 1 + 2; }
//       function b() { return 1 + 2; }

//       assert.strictEqual(_.isEqual(a, a), true);
//       assert.strictEqual(_.isEqual(a, b), false);
//     });

//     QUnit.test('should compare maps', function(assert) {
//       assert.expect(8);

//       if (Map) {
//         lodashStable.each([[map, new Map], [map, realm.map]], function(maps) {
//           var map1 = maps[0],
//               map2 = maps[1];

//           map1.set('a', 1);
//           map2.set('b', 2);
//           assert.strictEqual(_.isEqual(map1, map2), false);

//           map1.set('b', 2);
//           map2.set('a', 1);
//           assert.strictEqual(_.isEqual(map1, map2), true);

//           map1.delete('a');
//           map1.set('a', 1);
//           assert.strictEqual(_.isEqual(map1, map2), true);

//           map2.delete('a');
//           assert.strictEqual(_.isEqual(map1, map2), false);

//           map1.clear();
//           map2.clear();
//         });
//       }
//       else {
//         skipAssert(assert, 8);
//       }
//     });

//     QUnit.test('should compare maps with circular references', function(assert) {
//       assert.expect(2);

//       if (Map) {
//         var map1 = new Map,
//             map2 = new Map;

//         map1.set('a', map1);
//         map2.set('a', map2);
//         assert.strictEqual(_.isEqual(map1, map2), true);

//         map1.set('b', 1);
//         map2.set('b', 2);
//         assert.strictEqual(_.isEqual(map1, map2), false);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should compare promises by reference', function(assert) {
//       assert.expect(4);

//       if (promise) {
//         lodashStable.each([[promise, Promise.resolve(1)], [promise, realm.promise]], function(promises) {
//           var promise1 = promises[0],
//               promise2 = promises[1];

//           assert.strictEqual(_.isEqual(promise1, promise2), false);
//           assert.strictEqual(_.isEqual(promise1, promise1), true);
//         });
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should compare regexes', function(assert) {
//       assert.expect(5);

//       assert.strictEqual(_.isEqual(/x/gim, /x/gim), true);
//       assert.strictEqual(_.isEqual(/x/gim, /x/mgi), true);
//       assert.strictEqual(_.isEqual(/x/gi, /x/g), false);
//       assert.strictEqual(_.isEqual(/x/, /y/), false);
//       assert.strictEqual(_.isEqual(/x/g, { 'global': true, 'ignoreCase': false, 'multiline': false, 'source': 'x' }), false);
//     });

//     QUnit.test('should compare sets', function(assert) {
//       assert.expect(8);

//       if (Set) {
//         lodashStable.each([[set, new Set], [set, realm.set]], function(sets) {
//           var set1 = sets[0],
//               set2 = sets[1];

//           set1.add(1);
//           set2.add(2);
//           assert.strictEqual(_.isEqual(set1, set2), false);

//           set1.add(2);
//           set2.add(1);
//           assert.strictEqual(_.isEqual(set1, set2), true);

//           set1.delete(1);
//           set1.add(1);
//           assert.strictEqual(_.isEqual(set1, set2), true);

//           set2.delete(1);
//           assert.strictEqual(_.isEqual(set1, set2), false);

//           set1.clear();
//           set2.clear();
//         });
//       }
//       else {
//         skipAssert(assert, 8);
//       }
//     });

//     QUnit.test('should compare sets with circular references', function(assert) {
//       assert.expect(2);

//       if (Set) {
//         var set1 = new Set,
//             set2 = new Set;

//         set1.add(set1);
//         set2.add(set2);
//         assert.strictEqual(_.isEqual(set1, set2), true);

//         set1.add(1);
//         set2.add(2);
//         assert.strictEqual(_.isEqual(set1, set2), false);
//       }
//       else {
//         skipAssert(assert, 2);
//       }
//     });

//     QUnit.test('should compare symbol properties', function(assert) {
//       assert.expect(3);

//       if (Symbol) {
//         var object1 = { 'a': 1 },
//             object2 = { 'a': 1 };

//         object1[symbol1] = { 'a': { 'b': 2 } };
//         object2[symbol1] = { 'a': { 'b': 2 } };

//         defineProperty(object2, symbol2, {
//           'configurable': true,
//           'enumerable': false,
//           'writable': true,
//           'value': 2
//         });

//         assert.strictEqual(_.isEqual(object1, object2), true);

//         object2[symbol1] = { 'a': 1 };
//         assert.strictEqual(_.isEqual(object1, object2), false);

//         delete object2[symbol1];
//         object2[Symbol('a')] = { 'a': { 'b': 2 } };
//         assert.strictEqual(_.isEqual(object1, object2), false);
//       }
//       else {
//         skipAssert(assert, 3);
//       }
//     });

//     QUnit.test('should compare wrapped values', function(assert) {
//       assert.expect(32);

//       var stamp = +new Date;

//       var values = [
//         [[1, 2], [1, 2], [1, 2, 3]],
//         [true, true, false],
//         [new Date(stamp), new Date(stamp), new Date(stamp - 100)],
//         [{ 'a': 1, 'b': 2 }, { 'a': 1, 'b': 2 }, { 'a': 1, 'b': 1 }],
//         [1, 1, 2],
//         [NaN, NaN, Infinity],
//         [/x/, /x/, /x/i],
//         ['a', 'a', 'A']
//       ];

//       lodashStable.each(values, function(vals) {
//         if (!isNpm) {
//           var wrapped1 = _(vals[0]),
//               wrapped2 = _(vals[1]),
//               actual = wrapped1.isEqual(wrapped2);

//           assert.strictEqual(actual, true);
//           assert.strictEqual(_.isEqual(_(actual), _(true)), true);

//           wrapped1 = _(vals[0]);
//           wrapped2 = _(vals[2]);

//           actual = wrapped1.isEqual(wrapped2);
//           assert.strictEqual(actual, false);
//           assert.strictEqual(_.isEqual(_(actual), _(false)), true);
//         }
//         else {
//           skipAssert(assert, 4);
//         }
//       });
//     });

//     QUnit.test('should compare wrapped and non-wrapped values', function(assert) {
//       assert.expect(4);

//       if (!isNpm) {
//         var object1 = _({ 'a': 1, 'b': 2 }),
//             object2 = { 'a': 1, 'b': 2 };

//         assert.strictEqual(object1.isEqual(object2), true);
//         assert.strictEqual(_.isEqual(object1, object2), true);

//         object1 = _({ 'a': 1, 'b': 2 });
//         object2 = { 'a': 1, 'b': 1 };

//         assert.strictEqual(object1.isEqual(object2), false);
//         assert.strictEqual(_.isEqual(object1, object2), false);
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should work as an iteratee for `_.every`', function(assert) {
//       assert.expect(1);

//       var actual = lodashStable.every([1, 1, 1], lodashStable.partial(_.isEqual, 1));
//       assert.ok(actual);
//     });

//     QUnit.test('should not error on DOM elements', function(assert) {
//       assert.expect(1);

//       if (document) {
//         var element1 = document.createElement('div'),
//             element2 = element1.cloneNode(true);

//         try {
//           assert.strictEqual(_.isEqual(element1, element2), false);
//         } catch (e) {
//           assert.ok(false, e.message);
//         }
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return `true` for like-objects from different documents', function(assert) {
//       assert.expect(4);

//       if (realm.object) {
//         assert.strictEqual(_.isEqual([1], realm.array), true);
//         assert.strictEqual(_.isEqual([2], realm.array), false);
//         assert.strictEqual(_.isEqual({ 'a': 1 }, realm.object), true);
//         assert.strictEqual(_.isEqual({ 'a': 2 }, realm.object), false);
//       }
//       else {
//         skipAssert(assert, 4);
//       }
//     });

//     QUnit.test('should return `false` for objects with custom `toString` methods', function(assert) {
//       assert.expect(1);

//       var primitive,
//           object = { 'toString': function() { return primitive; } },
//           values = [true, null, 1, 'a', undefined],
//           expected = lodashStable.map(values, stubFalse);

//       var actual = lodashStable.map(values, function(value) {
//         primitive = value;
//         return _.isEqual(object, value);
//       });

//       assert.deepEqual(actual, expected);
//     });

//     QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.strictEqual(_('a').isEqual('a'), true);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });

//     QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
//       assert.expect(1);

//       if (!isNpm) {
//         assert.ok(_('a').chain().isEqual('a') instanceof _);
//       }
//       else {
//         skipAssert(assert);
//       }
//     });
//   }());



