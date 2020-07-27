import { JSDOM } from "jsdom";
import _ from "lodash";
import { clone, equals, isDefined, requireType, requireObjectType, setStrictTypeChecksEnabled, merge, overlay } from "@/Utils";
import { STRING_TYPE } from "@/Constants";

function cloneDefaulted(input: any): any {
	return clone(100, input);
}

function equalsDefaulted(first: any, second: any): boolean {
	return equals(100, first, second);
}

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

(function() {

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

	test("`clone` should deep clone objects with circular references", () => {
		const object: any = {
			bar: {},
			foo: { b: { c: { d: {} } } }
		};

		object.foo.b.c.d = object;
		object.bar.b = object.foo.b;

		const actual = cloneDefaulted(object);
		expect(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object).toBeTruthy();
	});

	test("`clone` should deep clone objects with lots of circular references", () => {
		const cyclical = {};
		_.times(LARGE_ARRAY_SIZE + 1, function(index) {
			cyclical["v" + index] = [index ? cyclical["v" + (index - 1)] : cyclical];
		});

		const cloned = cloneDefaulted(cyclical);
		const actual = cloned["v" + LARGE_ARRAY_SIZE][0];

		expect(actual).toStrictEqual(cloned["v" + (LARGE_ARRAY_SIZE - 1)]);
		expect(actual !== cyclical["v" + (LARGE_ARRAY_SIZE - 1)]).toBeTruthy();
	});

	_.forOwn(objects, function(object, kind) {
		test("`clone` should clone " + kind, () => {
			const actual = cloneDefaulted(object);
			expect(equalsDefaulted(actual, object)).toBeTruthy();

			if (_.isObject(object)) {
				expect(actual !== object).toBeTruthy();
			} else {
				expect(actual).toStrictEqual(object);
			}
		});
	});

	test("`clone` should clone array buffers", () => {
		const actual = cloneDefaulted(arrayBuffer);
		expect(actual.byteLength).toStrictEqual(arrayBuffer.byteLength);
		expect(actual !== arrayBuffer).toBeTruthy();
	});

	test("`clone` should clone buffers", () => {
		const buffer = new Buffer.from([1, 2]);
		const actual = cloneDefaulted(buffer);

		expect(actual.byteLength).toStrictEqual(buffer.byteLength);
		expect(actual.inspect()).toStrictEqual(buffer.inspect());
		expect(actual !== buffer).toBeTruthy();

		buffer[0] = 2;
		expect(actual[0]).toStrictEqual(2);
	});

	test("`clone` should clone `index` and `input` array properties", () => {
		const array = /c/.exec("abcde");
		const actual = cloneDefaulted(array);

		expect(actual.index).toStrictEqual(2);
		expect(actual.input).toStrictEqual("abcde");
	});

	test("`clone` should clone `lastIndex` regexp property", () => {
		const regexp = /c/g;
		regexp.exec("abcde");

		expect(cloneDefaulted(regexp).lastIndex).toStrictEqual(3);
	});

	test("`clone` should clone expando properties", () => {
		const values = _.map([false, true, 1, "a"], function(value) {
			const object = Object(value);
			object.a = 1;
			return object;
		});

		const expected = _.map(values, stubTrue);

		const actual = _.map(values, function(value) {
			return cloneDefaulted(value).a === 1;
		});

		expect(actual).toEqual(expected);
	});

	test("`clone` should clone prototype objects", () => {
		const actual = cloneDefaulted(Foo.prototype);

		expect(actual instanceof Foo).toBeFalsy();
		expect(actual).toEqual({ b: 1 });
	});

	test("`clone` should set the `[[Prototype]]` of a clone", () => {
		expect(cloneDefaulted(new Foo()) instanceof Foo).toBeTruthy();
	});

	test("`clone` should set the `[[Prototype]]` of a clone even when the `constructor` is incorrect", () => {
		Foo.prototype.constructor = Object;
		expect(cloneDefaulted(new Foo()) instanceof Foo).toBeTruthy();
		Foo.prototype.constructor = Foo;
	});

	test("`clone` should ensure `value` constructor is a function before using its `[[Prototype]]`", () => {
		Foo.prototype.constructor = null;
		expect(cloneDefaulted(new Foo()) instanceof Foo).toBeFalsy();
		Foo.prototype.constructor = Foo;
	});

	test("`clone` should clone properties that shadow those on `Object.prototype`", () => {
		const object = {
			constructor: Object.prototype.constructor,
			hasOwnProperty: Object.prototype.hasOwnProperty,
			isPrototypeOf: Object.prototype.isPrototypeOf,
			propertyIsEnumerable: Object.prototype.propertyIsEnumerable,
			toLocaleString: Object.prototype.toLocaleString,
			toString: Object.prototype.toString,
			valueOf: Object.prototype.valueOf
		};

		const actual = cloneDefaulted(object);

		expect(actual).toEqual(object);
		expect(actual !== object).toBeTruthy();
	});

	test("`clone` should clone symbol properties", () => {
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

		const actual = cloneDefaulted(object);
		expect(actual[symbol] !== object[symbol]).toBeTruthy();
		expect(actual.a !== object.a).toBeTruthy();

		expect(actual[symbol]).toEqual(object[symbol]);
		expect(getSymbols(actual.a.b)).toEqual([symbol]);
		expect(actual.a.b[symbol]).toEqual(object.a.b[symbol]);
		expect(actual.a.b[symbol2]).toEqual(object.a.b[symbol2]);
		expect(actual.a.b[symbol3]).toEqual(object.a.b[symbol3]);
	});

	test("`clone` should clone symbol objects", () => {
		expect(cloneDefaulted(symbol)).toStrictEqual(symbol);

		const object = Object(symbol);
		const actual = cloneDefaulted(object);

		expect(typeof actual).toStrictEqual("object");
		expect(typeof actual.valueOf()).toStrictEqual("symbol");
		expect(actual !== object).toBeTruthy();
	});

	test("`clone` should not clone symbol primitives", () => {
		expect(cloneDefaulted(symbol)).toStrictEqual(symbol);
	});

	test("`clone` should not error on DOM elements", () => {
		const element = document.createElement("div");
		expect(cloneDefaulted(element)).toEqual({} as HTMLDivElement);
	});

	test("`clone` should create an object from the same realm as `value`", () => {
		const props: any = [];

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
			const result = cloneDefaulted(object);

			return result !== object && ((result instanceof Ctor) || !(new Ctor() instanceof Ctor));
		});

		expect(actual).toEqual(expected);
	});

	test("`clone` should perform a deep clone when used as an iteratee for methods like `_.map`", () => {
		const expected = [{ a: [0] }, { b: [1] }];
		const actual = _.map(expected, (input: any) => cloneDefaulted(input));

		expect(actual).toEqual(expected);
		expect(actual[0] !== expected[0] && actual[0].a !== expected[0].a && actual[1].b !== expected[1].b).toBeTruthy();
	});

	_.each(arrayViews, function(type) {
		test("`clone` should clone " + type + " values", () => {
			const Ctor: any = root[type];

			_.times(2, function(index) {
				if (Ctor) {
					const buffer = new ArrayBuffer(24);
					const view = index ? new Ctor(buffer, 8, 1) : new Ctor(buffer);
					const actual = cloneDefaulted(view);

					expect(actual).toEqual(view);
					expect(actual !== view).toBeTruthy();
					expect(actual.buffer === view.buffer).toStrictEqual(false);
					expect(actual.byteOffset).toStrictEqual(view.byteOffset);
					expect(actual.length).toStrictEqual(view.length);
				}
			});
		});
	});

	_.forOwn(uncloneable, function(value, key) {
		test("`clone` should not clone " + key, () => {
			if (value) {
				const object = { a: value, b: { c: value } };
				const actual = cloneDefaulted(object);
				const expected = value === Foo ? { c: Foo.c } : {};

				expect(actual).toEqual(object);
				expect(actual !== object).toBeTruthy();
				expect(cloneDefaulted(value)).toEqual(expected);
			}
		});
	});

})();

(function() {

	const symbol1 = Symbol ? Symbol("a") : true;
	const symbol2 = Symbol ? Symbol("b") : false;

	test("should compare primitives", () => {
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
			return equalsDefaulted(pair[0], pair[1]);
		});

		expect(actual).toEqual(expected);
	});

	test("should compare arrays", () => {
		let array1: any = [true, null, 1, "a", undefined];
		let array2: any = [true, null, 1, "a", undefined];

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];
		array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = [1];
		array1[2] = 3;

		array2 = [1];
		array2[1] = undefined;
		array2[2] = 3;

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = [Object(1), false, Object("a"), /x/, new Date(2012, 4, 23), ["a", "b", [Object("c")]], { a: 1 }];
		array2 = [1, Object(false), "a", /x/, new Date(2012, 4, 23), ["a", Object("b"), ["c"]], { a: 1 }];

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = [1, 2, 3];
		array2 = [3, 2, 1];

		expect(equalsDefaulted(array1, array2)).toEqual(false);

		array1 = [1, 2];
		array2 = [1, 2, 3];

		expect(equalsDefaulted(array1, array2)).toEqual(false);
	});

	test("should treat arrays with identical values but different non-index properties as equal", () => {
		let array1: any = [1, 2, 3];
		let array2: any = [1, 2, 3];

		array1.every = array1.filter = array1.forEach =
			array1.indexOf = array1.lastIndexOf = array1.map =
			array1.some = array1.reduce = array1.reduceRight = null;

		array2.concat = array2.join = array2.pop =
			array2.reverse = array2.shift = array2.slice =
			array2.sort = array2.splice = array2.unshift = null;

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = [1, 2, 3];
		array1.a = 1;

		array2 = [1, 2, 3];
		array2.b = 1;

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1 = /c/.exec("abcde");
		array2 = ["c"];

		expect(equalsDefaulted(array1, array2)).toEqual(true);
	});

	test("should compare sparse arrays", () => {
		const array = Array(1);

		expect(equalsDefaulted(array, Array(1))).toEqual(true);
		expect(equalsDefaulted(array, [undefined])).toEqual(true);
		expect(equalsDefaulted(array, Array(2))).toEqual(false);
	});

	test("should compare plain objects", () => {
		let object1: any = { a: true, b: null, c: 1, d: "a", e: undefined };
		let object2: any = { a: true, b: null, c: 1, d: "a", e: undefined };

		expect(equalsDefaulted(object1, object2)).toEqual(true);

		object1 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };
		object2 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };

		expect(equalsDefaulted(object1, object2)).toEqual(true);

		object1 = { a: 1, b: 2, c: 3 };
		object2 = { a: 3, b: 2, c: 1 };

		expect(equalsDefaulted(object1, object2)).toEqual(false);

		object1 = { a: 1, b: 2, c: 3 };
		object2 = { d: 1, e: 2, f: 3 };

		expect(equalsDefaulted(object1, object2)).toEqual(false);

		object1 = { a: 1, b: 2 };
		object2 = { a: 1, b: 2, c: 3 };

		expect(equalsDefaulted(object1, object2)).toEqual(false);
	});

	test("should compare objects regardless of key order", () => {
		const object1 = { a: 1, b: 2, c: 3 };
		const object2 = { c: 3, a: 1, b: 2 };

		expect(equalsDefaulted(object1, object2)).toEqual(true);
	});

	test("should compare nested objects", () => {
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

		expect(equalsDefaulted(object1, object2)).toEqual(true);
	});

	test("should compare object instances", () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.a = 1;

		function Bar() {
			this.a = 1;
		}
		Bar.prototype.a = 2;

		expect(equalsDefaulted(new Foo(), new Foo())).toEqual(true);
		expect(equalsDefaulted(new Foo(), new Bar())).toEqual(false);
		expect(equalsDefaulted({ a: 1 }, new Foo())).toEqual(false);
		expect(equalsDefaulted({ a: 2 }, new Bar())).toEqual(false);
	});

	test("should compare objects with constructor properties", () => {
		expect(equalsDefaulted({ constructor: 1 }, { constructor: 1 })).toEqual(true);
		expect(equalsDefaulted({ constructor: 1 }, { constructor: "1" })).toEqual(false);
		expect(equalsDefaulted({ constructor: [1] }, { constructor: [1] })).toEqual(true);
		expect(equalsDefaulted({ constructor: [1] }, { constructor: ["1"] })).toEqual(false);
		expect(equalsDefaulted({ constructor: Object }, {})).toEqual(false);
	});

	test("should compare arrays with circular references", () => {
		let array1: any = [];
		let array2: any = [];

		array1.push(array1);
		array2.push(array2);

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1.push("b");
		array2.push("b");

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1.push("c");
		array2.push("d");

		expect(equalsDefaulted(array1, array2)).toEqual(false);

		array1 = ["a", "b", "c"];
		array1[1] = array1;
		array2 = ["a", ["a", "b", "c"], "c"];

		expect(equalsDefaulted(array1, array2)).toEqual(false);
	});

	test("should have transitive equivalence for circular references of arrays", () => {
		const array1: any = [];
		const array2: any = [array1];
		const array3: any = [array2];

		array1[0] = array1;

		expect(equalsDefaulted(array1, array2)).toEqual(true);
		expect(equalsDefaulted(array2, array3)).toEqual(true);
		expect(equalsDefaulted(array1, array3)).toEqual(true);
	});

	test("should compare objects with circular references", () => {
		let object1: any = {};
		let object2: any = {};

		object1.a = object1;
		object2.a = object2;

		expect(equalsDefaulted(object1, object2)).toEqual(true);

		object1.b = 0;
		object2.b = Object(0);

		expect(equalsDefaulted(object1, object2)).toEqual(true);

		object1.c = Object(1);
		object2.c = Object(2);

		expect(equalsDefaulted(object1, object2)).toEqual(false);

		object1 = { a: 1, b: 2, c: 3 };
		object1.b = object1;
		object2 = { a: 1, b: { a: 1, b: 2, c: 3 }, c: 3 };

		expect(equalsDefaulted(object1, object2)).toEqual(false);
	});

	test("should have transitive equivalence for circular references of objects", () => {
		const object1: any = {};
		const object2: any = { a: object1 };
		const object3: any = { a: object2 };

		object1.a = object1;

		expect(equalsDefaulted(object1, object2)).toEqual(true);
		expect(equalsDefaulted(object2, object3)).toEqual(true);
		expect(equalsDefaulted(object1, object3)).toEqual(true);
	});

	test("should compare objects with multiple circular references", () => {
		const array1: any = [{}];
		const array2: any = [{}];

		(array1[0].a = array1).push(array1);
		(array2[0].a = array2).push(array2);

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1[0].b = 0;
		array2[0].b = Object(0);

		expect(equalsDefaulted(array1, array2)).toEqual(true);

		array1[0].c = Object(1);
		array2[0].c = Object(2);

		expect(equalsDefaulted(array1, array2)).toEqual(false);
	});

	test("should compare objects with complex circular references", () => {
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

		expect(equalsDefaulted(object1, object2)).toEqual(true);
	});

	test("should compare objects with shared property values", () => {
		const object1: any = {
			a: [1, 2]
		};

		const object2: any = {
			a: [1, 2],
			b: [1, 2]
		};

		object1.b = object1.a;

		expect(equalsDefaulted(object1, object2)).toEqual(true);
	});

	test("should treat objects created by `Object.create(null)` like plain objects", () => {
		function Foo() {
			this.a = 1;
		}
		Foo.prototype.constructor = null;

		const object1: any = create(null);
		object1.a = 1;

		const object2: any = { a: 1 };

		expect(equalsDefaulted(object1, object2)).toEqual(true);
		expect(equalsDefaulted(new Foo(), object2)).toEqual(false);
	});

	test("should avoid common type coercions", () => {
		expect(equalsDefaulted(true, Object(false))).toEqual(false);
		expect(equalsDefaulted(Object(false), Object(0))).toEqual(false);
		expect(equalsDefaulted(false, Object(""))).toEqual(false);
		expect(equalsDefaulted(Object(36), Object("36"))).toEqual(false);
		expect(equalsDefaulted(0, "")).toEqual(false);
		expect(equalsDefaulted(1, true)).toEqual(false);
		expect(equalsDefaulted(1337756400000, new Date(2012, 4, 23))).toEqual(false);
		expect(equalsDefaulted("36", 36)).toEqual(false);
		expect(equalsDefaulted(36, "36")).toEqual(false);
	});

	test("should compare `arguments` objects", () => {
		const args1 = (function() { return arguments; }());
		const args2 = (function() { return arguments; }());
		const args3 = (function(...testArgs: any) {
			if (testArgs || true) { return arguments; }
		}(1, 2));

		expect(equalsDefaulted(args1, args2)).toEqual(true);
		expect(equalsDefaulted(args1, args3)).toEqual(false);
	});

	test("should treat `arguments` objects like `Object` objects", () => {
		const object = { 0: 1, 1: 2, 2: 3 };

		function Foo() { /* block intentionally empty */ }
		Foo.prototype = object;

		expect(equalsDefaulted(args, object)).toEqual(true);
		expect(equalsDefaulted(object, args)).toEqual(true);
		expect(equalsDefaulted(args, new Foo())).toEqual(false);
		expect(equalsDefaulted(new Foo(), args)).toEqual(false);
	});

	test("should compare array buffers", () => {
		const buffer = new Int8Array([-1]).buffer;

		expect(equalsDefaulted(buffer, new Uint8Array([255]).buffer)).toEqual(true);
		expect(equalsDefaulted(buffer, new ArrayBuffer(1))).toEqual(false);
	});

	test("should compare array views", () => {
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
			return [equalsDefaulted(pair[0], pair[1]), equalsDefaulted(pair[0], pair[2]), equalsDefaulted(pair[2], pair[3])];
		});

		expect(actual).toEqual(expected);
	});

	test("should compare buffers", () => {
		const buffer = new Buffer.from([1]);

		expect(equalsDefaulted(buffer, new Buffer.from([1]))).toEqual(true);
		expect(equalsDefaulted(buffer, new Buffer.from([2]))).toEqual(false);
		expect(equalsDefaulted(buffer, new Uint8Array([1]))).toEqual(false);
	});

	test("should compare date objects", () => {
		const date = new Date(2012, 4, 23);

		expect(equalsDefaulted(date, new Date(2012, 4, 23))).toEqual(true);
		expect(equalsDefaulted(new Date("a"), new Date("b"))).toEqual(true);
		expect(equalsDefaulted(date, new Date(2013, 3, 25))).toEqual(false);
		expect(equalsDefaulted(date, { getTime: _.constant(+date) })).toEqual(false);
	});

	test("should compare error objects", () => {
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
			return [equalsDefaulted(pair[0], pair[1]), equalsDefaulted(pair[0], pair[2]), equalsDefaulted(pair[2], pair[3])];
		});

		expect(actual).toEqual(expected);
	});

	test("should compare functions", () => {
		function a() { return 1 + 2; }
		function b() { return 1 + 2; }

		expect(equalsDefaulted(a, a)).toEqual(true);
		expect(equalsDefaulted(a, b)).toEqual(false);
	});

	test("should compare maps", () => {
		const map1 = map;
		const map2 = new Map();

		map1.set("a", 1);
		map2.set("b", 2);
		expect(equalsDefaulted(map1, map2)).toEqual(false);

		map1.set("b", 2);
		map2.set("a", 1);
		expect(equalsDefaulted(map1, map2)).toEqual(true);

		map1.delete("a");
		map1.set("a", 1);
		expect(equalsDefaulted(map1, map2)).toEqual(true);

		map2.delete("a");
		expect(equalsDefaulted(map1, map2)).toEqual(false);

		map1.clear();
		map2.clear();
	});

	test("should compare maps with circular references", () => {
		const map1 = new Map();
		const map2 = new Map();

		map1.set("a", map1);
		map2.set("a", map2);
		expect(equalsDefaulted(map1, map2)).toEqual(true);

		map1.set("b", 1);
		map2.set("b", 2);
		expect(equalsDefaulted(map1, map2)).toEqual(false);
	});

	test("should compare promises by reference", () => {
		const promise1 = promise;
		const promise2 = Promise.resolve(1);

		expect(equalsDefaulted(promise1, promise2)).toEqual(false);
		expect(equalsDefaulted(promise1, promise1)).toEqual(true);
	});

	test("should compare regexes", () => {
		expect(equalsDefaulted(/x/gim, /x/gim)).toEqual(true);
		expect(equalsDefaulted(/x/gim, /x/mgi)).toEqual(true);
		expect(equalsDefaulted(/x/gi, /x/g)).toEqual(false);
		expect(equalsDefaulted(/x/, /y/)).toEqual(false);
		expect(equalsDefaulted(/x/g, { global: true, ignoreCase: false, multiline: false, source: "x" })).toEqual(false);
	});

	test("should compare sets", () => {
		const set1 = set;
		const set2 = new Set();

		set1.add(1);
		set2.add(2);
		expect(equalsDefaulted(set1, set2)).toEqual(false);

		set1.add(2);
		set2.add(1);
		expect(equalsDefaulted(set1, set2)).toEqual(true);

		set1.delete(1);
		set1.add(1);
		expect(equalsDefaulted(set1, set2)).toEqual(true);

		set2.delete(1);
		expect(equalsDefaulted(set1, set2)).toEqual(false);

		set1.clear();
		set2.clear();
	});

	test("should compare sets with circular references", () => {
		const set1 = new Set();
		const set2 = new Set();

		set1.add(set1);
		set2.add(set2);
		expect(equalsDefaulted(set1, set2)).toEqual(true);

		set1.add(1);
		set2.add(2);
		expect(equalsDefaulted(set1, set2)).toEqual(false);
	});

	// ----------------------------------------------------------------------------------------------------------------------------

	test("should compare symbol properties", () => {
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

		expect(equalsDefaulted(object1, object2)).toEqual(true);

		object2[symbol1] = { a: 1 };
		expect(equalsDefaulted(object1, object2)).toEqual(false);

		delete object2[symbol1];
		object2[Symbol("a")] = { a: { b: 2 } };
		expect(equalsDefaulted(object1, object2)).toEqual(false);
	});

	test("should not error on DOM elements", () => {
		const element1 = document.createElement("div");
		const element2 = element1.cloneNode(true);

		expect(equalsDefaulted(element1, element2)).toEqual(false);
	});

	test("should return `false` for objects with custom `toString` methods", () => {
		const object = { toString: function() { return primitive; } };
		const values = [true, null, 1, "a", undefined];
		const expected = _.map(values, stubFalse);

		let primitive: any;

		const actual = _.map(values, function(value) {
			primitive = value;
			return equalsDefaulted(object, value);
		});

		expect(actual).toEqual(expected);
	});

	test("should return `false` for null values", () => {
		expect(isDefined(null)).toEqual(false);
	});

	test("should return `false` for null values", () => {
		expect(isDefined(undefined)).toEqual(false);
	});

	test("should return `true` for null values", () => {
		expect(isDefined({})).toEqual(true);
	});

	test("requireType should throw an exception for a null", () => {
		let thrown: Error = null;

		try {
			requireType(STRING_TYPE, null, "notAString");
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("NullValueError");
		expect(thrown.message).toEqual("notAString shall not be null");
	});

	test("requireType should throw an exception for a non-string type", () => {
		let thrown: Error = null;

		try {
			requireType(STRING_TYPE, {}, "notAString");
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("InvalidTypeError");
		expect(thrown.message).toEqual("notAString must be of type string but was object");
	});

	test("requireType should return the passed value if the value is a string", () => {
		expect(requireType(STRING_TYPE, "This is a string", "itsAString")).toEqual("This is a string");
	});

	class A {

		public doSomething(): string {
			return "doSomething";
		}

	}

	class B extends A {

		public doSomethingElse(): string {
			return "doSomethingElse";
		}

	}

	class C extends A {

		public doSomethingMore(): string {
			return "doSomethingMore";
		}

	}

	class D extends C {

		public doEvenMore(): string {
			return "doEvenMore";
		}

	}

	test("requireObjectType should throw error when type does not match when checks enabled", () => {
		setStrictTypeChecksEnabled(true);
		let thrown: Error = null;

		try {
			requireObjectType("Z", new C(), "aCObject");
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("InvalidTypeError");
		expect(thrown.message).toEqual("aCObject must be of type Z");
	});

	test("requireObjectType should throw error when type does not match when checks disabled", () => {
		setStrictTypeChecksEnabled(false);
		expect(requireObjectType("Z", new C(), "aCObject")).not.toBeNull();
	});

	test("requireObjectType should return the passed value if the value is of correct type", () => {
		setStrictTypeChecksEnabled(true);
		const result: C = requireObjectType("C", new C(), "aCObject");

		expect(result.doSomethingMore()).toEqual("doSomethingMore");
	});

	test("requireObjectType should return the passed value if the value is inherited from the correct type", () => {
		setStrictTypeChecksEnabled(true);
		const result: D = requireObjectType("C", new D(), "aDObject");

		expect(result.doEvenMore()).toEqual("doEvenMore");
	});

	test("requireObjectType should return the passed value if the value is multiple inherited from the correct type", () => {
		setStrictTypeChecksEnabled(true);
		const result: D = requireObjectType("A", new D(), "aDObject");

		expect(result.doEvenMore()).toEqual("doEvenMore");
	});

	test("merge - No overlap", () => {
		const result: any = merge([
			{
				"one": "1",
				"two": "2",
				"three": "3"
			},
			{
				"four": "4",
				"five": "5",
				"six": "6"
			},
			{
				"seven": "7",
				"eight": "8",
				"nine": "9"
			}
		]);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "3",
			"four": "4",
			"five": "5",
			"six": "6",
			"seven": "7",
			"eight": "8",
			"nine": "9"
		});
	});

	test("merge - Overlap", () => {
		const result: any = merge([
			{
				"one": "1",
				"two": "2",
				"three": "3"
			},
			{
				"three": "III",
				"four": "4",
				"five": "5",
			},
			{
				"five": "V",
				"six": "6",
				"seven": "7",
			}
		]);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "III",
			"four": "4",
			"five": "V",
			"six": "6",
			"seven": "7"
		});
	});

	test("merge - Overlap with customizer", () => {
		const result: any = merge(
			[
				{
					"one": "1",
					"two": "2",
					"three": "3"
				},
				{
					"three": "III",
					"four": "4",
					"five": "5",
				},
				{
					"five": "V",
					"six": "6",
					"seven": "7",
				}
			],
			{
				"five": (existing: any, source: any) => {
					return isDefined(existing) ? (existing + source) : source;
				}
			}
		);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "III",
			"four": "4",
			"five": "5V",
			"six": "6",
			"seven": "7"
		});
	});

	test("merge - Null sources", () => {
		let thrown: Error = null;

		try {
			merge(null);
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("NullValueError");
		expect(thrown.message).toEqual("sources shall not be null");
	});

	test("overlay - No overlap", () => {
		const result: any = overlay(
			{
				"one": "1",
				"two": "2",
				"three": "3"
			},
			[
				{
					"four": "4",
					"five": "5",
					"six": "6"
				},
				{
					"seven": "7",
					"eight": "8",
					"nine": "9"
				}
			]
		);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "3",
			"four": "4",
			"five": "5",
			"six": "6",
			"seven": "7",
			"eight": "8",
			"nine": "9"
		});
	});

	test("overlay - Overlap", () => {
		const result: any = overlay(
			{
				"one": "1",
				"two": "2",
				"three": "3"
			},
			[
				{
					"three": "III",
					"four": "4",
					"five": "5",
				},
				{
					"five": "V",
					"six": "6",
					"seven": "7"
				}
			]
		);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "III",
			"four": "4",
			"five": "V",
			"six": "6",
			"seven": "7"
		});
	});


	test("overlay - Overlap with customizer", () => {
		const result: any = overlay(
			{
				"one": "1",
				"two": "2",
				"three": "3"
			},
			[
				{
					"three": "III",
					"four": "4",
					"five": "5",
				},
				{
					"five": "V",
					"six": "6",
					"seven": "7"
				}
			],
			{
				"five": (existing: any, source: any) => {
					return isDefined(existing) ? (existing + source) : source;
				}
			}
		);

		expect(result).not.toBeNull();

		expect(result).toEqual({
			"one": "1",
			"two": "2",
			"three": "III",
			"four": "4",
			"five": "5V",
			"six": "6",
			"seven": "7"
		});
	});


	test("overlay - Null target", () => {
		let thrown: Error = null;

		try {
			overlay(null, []);
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("NullValueError");
		expect(thrown.message).toEqual("target shall not be null");
	});

	test("overlay - Null sources", () => {
		let thrown: Error = null;

		try {
			overlay({}, null);
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual("NullValueError");
		expect(thrown.message).toEqual("sources shall not be null");
	});

})();
