import ObjectUtils from "@/ObjectUtils";
import { assert } from "chai";
import { JSDOM } from "jsdom";
import _ from "lodash";
import { describe, it } from "mocha";

interface RootType extends Window {

	ArrayBuffer?: any;

	Buffer?: any;

	Map?: any;

	Promise?: any;

	Proxy?: any;

	Set?: any;

	Symbol?: any;

	Uint8Array?: any;

}

const noop = function() {
	// Intentionally do nothing
};

const LARGE_ARRAY_SIZE = 200;
const intermediateRoot: unknown = (typeof global === "object" && global) || this;
const root: RootType = intermediateRoot as RootType;
const mockWindow = new JSDOM("<html></html>").window;
const args = toArgs([1, 2, 3]);
const defineProperty = Object.defineProperty;
const document = mockWindow.document;
const body = root.document ? root.document.body : undefined;
const create = Object.create;
const getSymbols = Object.getOwnPropertySymbols;
const ArrayBuffer = root.ArrayBuffer;
const Buffer = root.Buffer;
const Map = root.Map;
const Promise = root.Promise;
const Proxy = root.Proxy;
const Set = root.Set;
const Symbol = root.Symbol;
const Uint8Array = root.Uint8Array;
const arrayBuffer = ArrayBuffer ? new ArrayBuffer(2) : undefined;
const map = Map ? new Map() : undefined;
const promise = Promise ? Promise.resolve(1) : undefined;
const set = Set ? new Set() : undefined;
const symbol = Symbol ? Symbol("a") : undefined;
const stubTrue = function() { return true; };
const stubFalse = function() { return false; };

const errors = [
	new Error(),
	new EvalError(),
	new RangeError(),
	new ReferenceError(),
	new SyntaxError(),
	new TypeError(),
	new URIError()
];

const typedArrays = [
	"Float32Array",
	"Float64Array",
	"Int8Array",
	"Int16Array",
	"Int32Array",
	"Uint8Array",
	"Uint8ClampedArray",
	"Uint16Array",
	"Uint32Array"
];

const arrayViews = typedArrays.concat("DataView");

setProperty(root, "setTimeout", setTimeout);

try {
	defineProperty(global, "root", {
		configurable: false,
		enumerable: false,
		get: function() { throw new ReferenceError(); }
	});
} catch (e) {
	// Intentionally do nothing
}

const asyncFunc = _.attempt(function() {
	return Function("return async () => {}");
});

const genFunc = _.attempt(function() {
	return Function("return function*(){}");
});

function CustomError(message: string) {
	this.name = "CustomError";
	this.message = message;
}

CustomError.prototype = _.create(Error.prototype, {
	constructor: CustomError
});

function setProperty(object: any, key: string, value: any) {
	try {
		defineProperty(object, key, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} catch (e) {
		object[key] = value;
	}
	return object;
}

function toArgs(array: any) {
	return (function() { return arguments; }.apply(undefined, array));
}

describe("ObjectUtils clone methods", () => {

	function Foo() {
		this.a = 1;
	}
	Foo.prototype.b = 1;
	Foo.c = function() {
		// Intentionally do nothing
	};

	const testMap = new Map();
	testMap.set("a", 1);
	testMap.set("b", 2);

	const testSet = new Set();
	testSet.add(1);
	testSet.add(2);

	const objects = {
		"Foo instances": new Foo(),
		"array-like objects": { 0: "a", length: 1 },
		"arrays": ["a", ""],
		"boolean objects": Object(false),
		"booleans": false,
		"date objects": new Date(),
		"maps": map,
		"null values": null,
		"number objects": Object(0),
		"numbers": 0,
		"objects": { a: 0, b: 1, c: 2 },
		"objects from another document": {},
		"objects with object values": { a: /a/, b: ["B"], c: { C: 1 } },
		"regexes": /a/gim,
		"sets": set,
		"string objects": Object("a"),
		"strings:": "a",
		"undefined values": undefined
	};

	objects.arrays.length = 3;

	const uncloneable = {
		"DOM elements": body,
		"async functions": asyncFunc,
		"functions": Foo,
		"generator functions": genFunc,
		"the `Proxy` constructor": Proxy
	};

	_.each(errors, function(error) {
		uncloneable[error.name + "s"] = error;
	});

	it("`_.clone` should perform a shallow clone", () => {
		const array = [{ a: 0 }, { b: 1 }];
		const actual = _.clone(array);

		assert.deepEqual(actual, array);
		assert.ok(actual !== array && actual[0] === array[0]);
	});

	it("`ObjectUtils.clone` should deep clone objects with circular references", () => {
		const object: any = {
			bar: {},
			foo: { b: { c: { d: {} } } }
		};

		object.foo.b.c.d = object;
		object.bar.b = object.foo.b;

		const actual = ObjectUtils.clone(object);
		assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object);
	});

	it("`ObjectUtils.clone` should deep clone objects with lots of circular references", () => {
		const cyclical = {};
		_.times(LARGE_ARRAY_SIZE + 1, function(index) {
			cyclical["v" + index] = [index ? cyclical["v" + (index - 1)] : cyclical];
		});

		const clone = ObjectUtils.clone(cyclical);
		const actual = clone["v" + LARGE_ARRAY_SIZE][0];

		assert.strictEqual(actual, clone["v" + (LARGE_ARRAY_SIZE - 1)]);
		assert.notStrictEqual(actual, cyclical["v" + (LARGE_ARRAY_SIZE - 1)]);
	});

	_.forOwn(objects, function(object, kind) {
		it("`ObjectUtils.clone` should clone " + kind, () => {
			const actual = ObjectUtils.clone(object);
			assert.ok(ObjectUtils.equals(actual, object));

			if (_.isObject(object)) {
				assert.notStrictEqual(actual, object);
			} else {
				assert.strictEqual(actual, object);
			}
		});
	});

	it("`ObjectUtils.clone` should clone array buffers", () => {
		const actual = ObjectUtils.clone(arrayBuffer);
		assert.strictEqual(actual.byteLength, arrayBuffer.byteLength);
		assert.notStrictEqual(actual, arrayBuffer);
	});

	it("`ObjectUtils.clone` should clone buffers", () => {
		const buffer = new Buffer.from([1, 2]);
		const actual = ObjectUtils.clone(buffer);

		assert.strictEqual(actual.byteLength, buffer.byteLength);
		assert.strictEqual(actual.inspect(), buffer.inspect());
		assert.notStrictEqual(actual, buffer);

		buffer[0] = 2;
		assert.strictEqual(actual[0], 2);
	});

	it("`ObjectUtils.clone` should clone `index` and `input` array properties", () => {
		const array = /c/.exec("abcde");
		const actual = ObjectUtils.clone(array);

		assert.strictEqual(actual.index, 2);
		assert.strictEqual(actual.input, "abcde");
	});

	it("`ObjectUtils.clone` should clone `lastIndex` regexp property", () => {
		const regexp = /c/g;
		regexp.exec("abcde");

		assert.strictEqual(ObjectUtils.clone(regexp).lastIndex, 3);
	});

	it("`ObjectUtils.clone` should clone expando properties", () => {
		const values = _.map([false, true, 1, "a"], function(value) {
			const object = Object(value);
			object.a = 1;
			return object;
		});

		const expected = _.map(values, stubTrue);

		const actual = _.map(values, function(value) {
			return ObjectUtils.clone(value).a === 1;
		});

		assert.deepEqual(actual, expected);
	});

	it("`ObjectUtils.clone` should clone prototype objects", () => {
		const actual = ObjectUtils.clone(Foo.prototype);

		assert.notOk(actual instanceof Foo);
		assert.deepEqual(actual, { b: 1 });
	});

	it("`ObjectUtils.clone` should set the `[[Prototype]]` of a clone", () => {
		assert.ok(ObjectUtils.clone(new Foo()) instanceof Foo);
	});

	it("`ObjectUtils.clone` should set the `[[Prototype]]` of a clone even when the `constructor` is incorrect", () => {
		Foo.prototype.constructor = Object;
		assert.ok(ObjectUtils.clone(new Foo()) instanceof Foo);
		Foo.prototype.constructor = Foo;
	});

	it("`ObjectUtils.clone` should ensure `value` constructor is a function before using its `[[Prototype]]`", () => {
		Foo.prototype.constructor = null;
		assert.notOk(ObjectUtils.clone(new Foo()) instanceof Foo);
		Foo.prototype.constructor = Foo;
	});

	it("`ObjectUtils.clone` should clone properties that shadow those on `Object.prototype`", () => {
		const object = {
			constructor: Object.prototype.constructor,
			hasOwnProperty: Object.prototype.hasOwnProperty,
			isPrototypeOf: Object.prototype.isPrototypeOf,
			propertyIsEnumerable: Object.prototype.propertyIsEnumerable,
			toLocaleString: Object.prototype.toLocaleString,
			toString: Object.prototype.toString,
			valueOf: Object.prototype.valueOf
		};

		const actual = ObjectUtils.clone(object);

		assert.deepEqual(actual, object);
		assert.notStrictEqual(actual, object);
	});

	it("`ObjectUtils.clone` should clone symbol properties", () => {
		function ThisFoo() {
			this[symbol] = { c: 1 };
		}

		const symbol2 = Symbol("b");
		Foo.prototype[symbol2] = 2;

		const symbol3 = Symbol("c");
		defineProperty(ThisFoo.prototype, symbol3, {
			configurable: true,
			enumerable: false,
			value: 3,
			writable: true
		});

		const object = { a: { b: new ThisFoo() } };
		object[symbol] = { b: 1 };

		const actual = ObjectUtils.clone(object);
		assert.notStrictEqual(actual[symbol], object[symbol]);
		assert.notStrictEqual(actual.a, object.a);

		assert.deepEqual(actual[symbol], object[symbol]);
		assert.deepEqual(getSymbols(actual.a.b), [symbol]);
		assert.deepEqual(actual.a.b[symbol], object.a.b[symbol]);
		assert.deepEqual(actual.a.b[symbol2], object.a.b[symbol2]);
		assert.deepEqual(actual.a.b[symbol3], object.a.b[symbol3]);
	});

	it("`ObjectUtils.clone` should clone symbol objects", () => {
		assert.strictEqual(ObjectUtils.clone(symbol), symbol);

		const object = Object(symbol);
		const actual = ObjectUtils.clone(object);

		assert.strictEqual(typeof actual, "object");
		assert.strictEqual(typeof actual.valueOf(), "symbol");
		assert.notStrictEqual(actual, object);
	});

	it("`ObjectUtils.clone` should not clone symbol primitives", () => {
		assert.strictEqual(ObjectUtils.clone(symbol), symbol);
	});

	it("`ObjectUtils.clone` should not error on DOM elements", () => {
		const element = document.createElement("div");

		try {
			assert.deepEqual(ObjectUtils.clone(element), {} as HTMLDivElement);
		} catch (e) {
			assert.ok(false, e.message);
		}
	});

	it("`ObjectUtils.clone` should create an object from the same realm as `value`", () => {
		const props = [];

		const ldTemp: any = _;

		const testObjs = _.transform(ldTemp, function(result, value, key: any) {
			if (_.startsWith(key, "_") && _.isObject(value) &&
				!_.isArguments(value) && !_.isElement(value) &&
				!_.isFunction(value)) {
				props.push(_.capitalize(_.camelCase(key)));
				result.push(value);
			}
		}, []);

		const expected = _.map(testObjs, stubTrue);

		const actual = _.map(testObjs, function(object) {
			const Ctor = object.constructor;
			const result = ObjectUtils.clone(object);

			return result !== object && ((result instanceof Ctor) || !(new Ctor() instanceof Ctor));
		});

		assert.deepEqual(actual, expected, props.join(", "));
	});

	it("`ObjectUtils.clone` should perform a deep clone when used as an iteratee for methods like `_.map`", () => {
		const expected = [{ a: [0] }, { b: [1] }];
		const actual = _.map(expected, ObjectUtils.clone);

		assert.deepEqual(actual, expected);
		assert.ok(actual[0] !== expected[0] && actual[0].a !== expected[0].a && actual[1].b !== expected[1].b);
	});

	_.each(arrayViews, function(type) {
		it("`ObjectUtils.clone` should clone " + type + " values", () => {
			const Ctor: any = root[type];

			_.times(2, function(index) {
				if (Ctor) {
					const buffer = new ArrayBuffer(24);
					const view = index ? new Ctor(buffer, 8, 1) : new Ctor(buffer);
					const actual = ObjectUtils.clone(view);

					assert.deepEqual(actual, view);
					assert.notStrictEqual(actual, view);
					assert.strictEqual(actual.buffer === view.buffer, false);
					assert.strictEqual(actual.byteOffset, view.byteOffset);
					assert.strictEqual(actual.length, view.length);
				}
			});
		});
	});

	_.forOwn(uncloneable, function(value, key) {
		it("`ObjectUtils.clone` should not clone " + key, () => {
			if (value) {
				const object = { a: value, b: { c: value } };
				const actual = ObjectUtils.clone(object);
				const expected = value === Foo ? { c: Foo.c } : {};

				assert.deepEqual(actual, object);
				assert.notStrictEqual(actual, object);
				assert.deepEqual(ObjectUtils.clone(value), expected);
			}
		});
	});

});


describe("ObjectUtils lodash.isEqual", () => {

	const symbol1 = Symbol ? Symbol("a") : true;
	const symbol2 = Symbol ? Symbol("b") : false;

	it("should compare primitives", () => {
		const pairs = [
			[1, 1, true], [1, Object(1), true], [1, "1", false], [1, 2, false],
			[-0, -0, true], [0, 0, true], [0, Object(0), true], [Object(0), Object(0), true], [-0, 0, true], [0, "0", false], [0, null, false],
			[NaN, NaN, true], [NaN, Object(NaN), true], [Object(NaN), Object(NaN), true], [NaN, "a", false], [NaN, Infinity, false],
			["a", "a", true], ["a", Object("a"), true], [Object("a"), Object("a"), true], ["a", "b", false], ["a", ["a"], false],
			[true, true, true], [true, Object(true), true], [Object(true), Object(true), true], [true, 1, false], [true, "a", false],
			[false, false, true], [false, Object(false), true], [Object(false), Object(false), true], [false, 0, false], [false, "", false],
			[symbol1, symbol1, true], [symbol1, Object(symbol1), true], [Object(symbol1), Object(symbol1), true], [symbol1, symbol2, false],
			[null, null, true], [null, undefined, false], [null, {}, false], [null, "", false],
			[undefined, undefined, true], [undefined, null, false], [undefined, "", false]
		];

		const expected = _.map(pairs, function(pair) {
			return pair[2];
		});

		const actual = _.map(pairs, function(pair) {
			return ObjectUtils.equals(pair[0], pair[1]);
		});

		assert.deepEqual(actual, expected);
	});

	it("should compare arrays", () => {
		let array1: any = [true, null, 1, "a", undefined];
		let array2: any = [true, null, 1, "a", undefined];

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];
		array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = [1];
		array1[2] = 3;

		array2 = [1];
		array2[1] = undefined;
		array2[2] = 3;

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = [Object(1), false, Object("a"), /x/, new Date(2012, 4, 23), ["a", "b", [Object("c")]], { a: 1 }];
		array2 = [1, Object(false), "a", /x/, new Date(2012, 4, 23), ["a", Object("b"), ["c"]], { a: 1 }];

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = [1, 2, 3];
		array2 = [3, 2, 1];

		assert.strictEqual(ObjectUtils.equals(array1, array2), false);

		array1 = [1, 2];
		array2 = [1, 2, 3];

		assert.strictEqual(ObjectUtils.equals(array1, array2), false);
	});

	it("should treat arrays with identical values but different non-index properties as equal", () => {
		let array1: any = [1, 2, 3];
		let array2: any = [1, 2, 3];

		array1.every = array1.filter = array1.forEach =
			array1.indexOf = array1.lastIndexOf = array1.map =
			array1.some = array1.reduce = array1.reduceRight = null;

		array2.concat = array2.join = array2.pop =
			array2.reverse = array2.shift = array2.slice =
			array2.sort = array2.splice = array2.unshift = null;

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = [1, 2, 3];
		array1.a = 1;

		array2 = [1, 2, 3];
		array2.b = 1;

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1 = /c/.exec("abcde");
		array2 = ["c"];

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);
	});

	it("should compare sparse arrays", () => {
		const array = Array(1);

		assert.strictEqual(ObjectUtils.equals(array, Array(1)), true);
		assert.strictEqual(ObjectUtils.equals(array, [undefined]), true);
		assert.strictEqual(ObjectUtils.equals(array, Array(2)), false);
	});

	it("should compare plain objects", () => {
		let object1: any = { a: true, b: null, c: 1, d: "a", e: undefined };
		let object2: any = { a: true, b: null, c: 1, d: "a", e: undefined };

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);

		object1 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };
		object2 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);

		object1 = { a: 1, b: 2, c: 3 };
		object2 = { a: 3, b: 2, c: 1 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), false);

		object1 = { a: 1, b: 2, c: 3 };
		object2 = { d: 1, e: 2, f: 3 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), false);

		object1 = { a: 1, b: 2 };
		object2 = { a: 1, b: 2, c: 3 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), false);
	});

	it("should compare objects regardless of key order", () => {
		const object1 = { a: 1, b: 2, c: 3 };
		const object2 = { c: 3, a: 1, b: 2 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
	});

	it("should compare nested objects", () => {
		const object1 = {
			a: [1, 2, 3],
			b: true,
			c: Object(1),
			d: "a",
			e: {
				f: ["a", Object("b"), "c"],
				g: Object(false),
				h: new Date(2012, 4, 23),
				i: noop,
				j: "a"
			}
		};

		const object2 = {
			a: [1, Object(2), 3],
			b: Object(true),
			c: 1,
			d: Object("a"),
			e: {
				f: ["a", "b", "c"],
				g: false,
				h: new Date(2012, 4, 23),
				i: noop,
				j: "a"
			}
		};

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
	});

	it("should compare object instances", () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.a = 1;

		function Bar() {
			this.a = 1;
		}
		Bar.prototype.a = 2;

		assert.strictEqual(ObjectUtils.equals(new Foo(), new Foo()), true);
		assert.strictEqual(ObjectUtils.equals(new Foo(), new Bar()), false);
		assert.strictEqual(ObjectUtils.equals({ a: 1 }, new Foo()), false);
		assert.strictEqual(ObjectUtils.equals({ a: 2 }, new Bar()), false);
	});

	it("should compare objects with constructor properties", () => {
		assert.strictEqual(ObjectUtils.equals({ constructor: 1 }, { constructor: 1 }), true);
		assert.strictEqual(ObjectUtils.equals({ constructor: 1 }, { constructor: "1" }), false);
		assert.strictEqual(ObjectUtils.equals({ constructor: [1] }, { constructor: [1] }), true);
		assert.strictEqual(ObjectUtils.equals({ constructor: [1] }, { constructor: ["1"] }), false);
		assert.strictEqual(ObjectUtils.equals({ constructor: Object }, {}), false);
	});

	it("should compare arrays with circular references", () => {
		let array1 = [];
		let array2 = [];

		array1.push(array1);
		array2.push(array2);

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1.push("b");
		array2.push("b");

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1.push("c");
		array2.push("d");

		assert.strictEqual(ObjectUtils.equals(array1, array2), false);

		array1 = ["a", "b", "c"];
		array1[1] = array1;
		array2 = ["a", ["a", "b", "c"], "c"];

		assert.strictEqual(ObjectUtils.equals(array1, array2), false);
	});

	it("should have transitive equivalence for circular references of arrays", () => {
		const array1 = [];
		const array2 = [array1];
		const array3 = [array2];

		array1[0] = array1;

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);
		assert.strictEqual(ObjectUtils.equals(array2, array3), true);
		assert.strictEqual(ObjectUtils.equals(array1, array3), true);
	});

	it("should compare objects with circular references", () => {
		let object1: any = {};
		let object2: any = {};

		object1.a = object1;
		object2.a = object2;

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);

		object1.b = 0;
		object2.b = Object(0);

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);

		object1.c = Object(1);
		object2.c = Object(2);

		assert.strictEqual(ObjectUtils.equals(object1, object2), false);

		object1 = { a: 1, b: 2, c: 3 };
		object1.b = object1;
		object2 = { a: 1, b: { a: 1, b: 2, c: 3 }, c: 3 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), false);
	});

	it("should have transitive equivalence for circular references of objects", () => {
		const object1: any = {};
		const object2: any = { a: object1 };
		const object3: any = { a: object2 };

		object1.a = object1;

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
		assert.strictEqual(ObjectUtils.equals(object2, object3), true);
		assert.strictEqual(ObjectUtils.equals(object1, object3), true);
	});

	it("should compare objects with multiple circular references", () => {
		const array1: any = [{}];
		const array2: any = [{}];

		(array1[0].a = array1).push(array1);
		(array2[0].a = array2).push(array2);

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1[0].b = 0;
		array2[0].b = Object(0);

		assert.strictEqual(ObjectUtils.equals(array1, array2), true);

		array1[0].c = Object(1);
		array2[0].c = Object(2);

		assert.strictEqual(ObjectUtils.equals(array1, array2), false);
	});

	it("should compare objects with complex circular references", () => {
		const object1: any = {
			bar: { a: 2 },
			foo: { b: { c: { d: {} } } }
		};

		const object2: any = {
			bar: { a: 2 },
			foo: { b: { c: { d: {} } } }
		};

		object1.foo.b.c.d = object1;
		object1.bar.b = object1.foo.b;

		object2.foo.b.c.d = object2;
		object2.bar.b = object2.foo.b;

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
	});

	it("should compare objects with shared property values", () => {
		const object1: any = {
			a: [1, 2]
		};

		const object2: any = {
			a: [1, 2],
			b: [1, 2]
		};

		object1.b = object1.a;

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
	});

	it("should treat objects created by `Object.create(null)` like plain objects", () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.constructor = null;

		const object1 = create(null);
		object1.a = 1;

		const object2 = { a: 1 };

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);
		assert.strictEqual(ObjectUtils.equals(new Foo(), object2), false);
	});

	it("should avoid common type coercions", () => {
		assert.strictEqual(ObjectUtils.equals(true, Object(false)), false);
		assert.strictEqual(ObjectUtils.equals(Object(false), Object(0)), false);
		assert.strictEqual(ObjectUtils.equals(false, Object("")), false);
		assert.strictEqual(ObjectUtils.equals(Object(36), Object("36")), false);
		assert.strictEqual(ObjectUtils.equals(0, ""), false);
		assert.strictEqual(ObjectUtils.equals(1, true), false);
		assert.strictEqual(ObjectUtils.equals(1337756400000, new Date(2012, 4, 23)), false);
		assert.strictEqual(ObjectUtils.equals("36", 36), false);
		assert.strictEqual(ObjectUtils.equals(36, "36"), false);
	});

	it("should compare `arguments` objects", () => {
		const args1 = (function() { return arguments; }());
		const args2 = (function() { return arguments; }());
		const args3 = (function(...testArgs: any) {
			if (testArgs || true) { return arguments; }
		}(1, 2));

		assert.strictEqual(ObjectUtils.equals(args1, args2), true);
		assert.strictEqual(ObjectUtils.equals(args1, args3), false);
	});

	it("should treat `arguments` objects like `Object` objects", () => {
		const object = { 0: 1, 1: 2, 2: 3 };

		function Foo() { /* block intentionally empty */ }
		Foo.prototype = object;

		assert.strictEqual(ObjectUtils.equals(args, object), true);
		assert.strictEqual(ObjectUtils.equals(object, args), true);
		assert.strictEqual(ObjectUtils.equals(args, new Foo()), false);
		assert.strictEqual(ObjectUtils.equals(new Foo(), args), false);
	});

	it("should compare array buffers", () => {
		const buffer = new Int8Array([-1]).buffer;

		assert.strictEqual(ObjectUtils.equals(buffer, new Uint8Array([255]).buffer), true);
		assert.strictEqual(ObjectUtils.equals(buffer, new ArrayBuffer(1)), false);
	});

	it("should compare array views", () => {
		const ns: RootType = root;

		const pairs = _.map(arrayViews, function(type, viewIndex) {
			const otherType = arrayViews[(viewIndex + 1) % arrayViews.length];
			const CtorA: any = ns[type] || function(n: any) { this.n = n; };
			const CtorB: any = ns[otherType] || function(n: any) { this.n = n; };
			const bufferA = ns[type] ? new ns.ArrayBuffer(8) : 8;
			const bufferB = ns[otherType] ? new ns.ArrayBuffer(8) : 8;
			const bufferC = ns[otherType] ? new ns.ArrayBuffer(16) : 16;

			return [new CtorA(bufferA), new CtorA(bufferA), new CtorB(bufferB), new CtorB(bufferC)];
		});

		const expected = _.map(pairs, _.constant([true, false, false]));

		const actual = _.map(pairs, function(pair) {
			return [ObjectUtils.equals(pair[0], pair[1]), ObjectUtils.equals(pair[0], pair[2]), ObjectUtils.equals(pair[2], pair[3])];
		});

		assert.deepEqual(actual, expected);
	});

	it("should compare buffers", () => {
		const buffer = new Buffer.from([1]);

		assert.strictEqual(ObjectUtils.equals(buffer, new Buffer.from([1])), true);
		assert.strictEqual(ObjectUtils.equals(buffer, new Buffer.from([2])), false);
		assert.strictEqual(ObjectUtils.equals(buffer, new Uint8Array([1])), false);
	});

	it("should compare date objects", () => {
		const date = new Date(2012, 4, 23);

		assert.strictEqual(ObjectUtils.equals(date, new Date(2012, 4, 23)), true);
		assert.strictEqual(ObjectUtils.equals(new Date("a"), new Date("b")), true);
		assert.strictEqual(ObjectUtils.equals(date, new Date(2013, 3, 25)), false);
		assert.strictEqual(ObjectUtils.equals(date, { getTime: _.constant(+date) }), false);
	});

	it("should compare error objects", () => {
		const pairs = _.map([
			"Error",
			"EvalError",
			"RangeError",
			"ReferenceError",
			"SyntaxError",
			"TypeError",
			"URIError"
		], function(type, index, errorTypes) {
			const otherType = errorTypes[++index % errorTypes.length];
			const CtorA: any = root[type];
			const CtorB: any = root[otherType];

			return [new CtorA("a"), new CtorA("a"), new CtorB("a"), new CtorB("b")];
		});

		const expected = _.map(pairs, _.constant([true, false, false]));

		const actual = _.map(pairs, function(pair) {
			return [ObjectUtils.equals(pair[0], pair[1]), ObjectUtils.equals(pair[0], pair[2]), ObjectUtils.equals(pair[2], pair[3])];
		});

		assert.deepEqual(actual, expected);
	});

	it("should compare functions", () => {
		function a() { return 1 + 2; }
		function b() { return 1 + 2; }

		assert.strictEqual(ObjectUtils.equals(a, a), true);
		assert.strictEqual(ObjectUtils.equals(a, b), false);
	});

	it("should compare maps", () => {
		const map1 = map;
		const map2 = new Map();

		map1.set("a", 1);
		map2.set("b", 2);
		assert.strictEqual(ObjectUtils.equals(map1, map2), false);

		map1.set("b", 2);
		map2.set("a", 1);
		assert.strictEqual(ObjectUtils.equals(map1, map2), true);

		map1.delete("a");
		map1.set("a", 1);
		assert.strictEqual(ObjectUtils.equals(map1, map2), true);

		map2.delete("a");
		assert.strictEqual(ObjectUtils.equals(map1, map2), false);

		map1.clear();
		map2.clear();
	});

	it("should compare maps with circular references", () => {
		const map1 = new Map();
		const map2 = new Map();

		map1.set("a", map1);
		map2.set("a", map2);
		assert.strictEqual(ObjectUtils.equals(map1, map2), true);

		map1.set("b", 1);
		map2.set("b", 2);
		assert.strictEqual(ObjectUtils.equals(map1, map2), false);
	});

	it("should compare promises by reference", () => {
		const promise1 = promise;
		const promise2 = Promise.resolve(1);

		assert.strictEqual(ObjectUtils.equals(promise1, promise2), false);
		assert.strictEqual(ObjectUtils.equals(promise1, promise1), true);
	});

	it("should compare regexes", () => {
		assert.strictEqual(ObjectUtils.equals(/x/gim, /x/gim), true);
		assert.strictEqual(ObjectUtils.equals(/x/gim, /x/mgi), true);
		assert.strictEqual(ObjectUtils.equals(/x/gi, /x/g), false);
		assert.strictEqual(ObjectUtils.equals(/x/, /y/), false);
		assert.strictEqual(ObjectUtils.equals(/x/g, { global: true, ignoreCase: false, multiline: false, source: "x" }), false);
	});

	it("should compare sets", () => {
		const set1 = set;
		const set2 = new Set();

		set1.add(1);
		set2.add(2);
		assert.strictEqual(ObjectUtils.equals(set1, set2), false);

		set1.add(2);
		set2.add(1);
		assert.strictEqual(ObjectUtils.equals(set1, set2), true);

		set1.delete(1);
		set1.add(1);
		assert.strictEqual(ObjectUtils.equals(set1, set2), true);

		set2.delete(1);
		assert.strictEqual(ObjectUtils.equals(set1, set2), false);

		set1.clear();
		set2.clear();
	});

	it("should compare sets with circular references", () => {
		const set1 = new Set();
		const set2 = new Set();

		set1.add(set1);
		set2.add(set2);
		assert.strictEqual(ObjectUtils.equals(set1, set2), true);

		set1.add(1);
		set2.add(2);
		assert.strictEqual(ObjectUtils.equals(set1, set2), false);
	});

	// ----------------------------------------------------------------------------------------------------------------------------

	it("should compare symbol properties", () => {
		const object1 = { a: 1 };
		const object2 = { a: 1 };

		object1[symbol1] = { a: { b: 2 } };
		object2[symbol1] = { a: { b: 2 } };

		defineProperty(object2, symbol2, {
			configurable: true,
			enumerable: false,
			value: 2,
			writable: true
		});

		assert.strictEqual(ObjectUtils.equals(object1, object2), true);

		object2[symbol1] = { a: 1 };
		assert.isFalse(ObjectUtils.equals(object1, object2));

		delete object2[symbol1];
		object2[Symbol("a")] = { a: { b: 2 } };
		assert.strictEqual(ObjectUtils.equals(object1, object2), false);
	});

	it("should not error on DOM elements", () => {
		const element1 = document.createElement("div");
		const element2 = element1.cloneNode(true);

		try {
			assert.strictEqual(ObjectUtils.equals(element1, element2), false);
		} catch (e) {
			assert.ok(false, e.message);
		}
	});

	it("should return `false` for objects with custom `toString` methods", () => {
		const object = { toString: function() { return primitive; } };
		const values = [true, null, 1, "a", undefined];
		const expected = _.map(values, stubFalse);

		let primitive: any;

		const actual = _.map(values, function(value) {
			primitive = value;
			return ObjectUtils.equals(object, value);
		});

		assert.deepEqual(actual, expected);
	});

});
