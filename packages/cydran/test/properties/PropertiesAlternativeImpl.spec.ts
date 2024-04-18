import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { MutableProperties } from 'properties/Property';
import SimpleMap from 'interface/SimpleMap';
import exp from "constants";

const STRING_VALUE = "This is a string";
const NUMBER_VALUE = 31337;
const NUMBER_VALUE_AS_STRING = "31337";
const OBJECT_VALUE = {};
const OBJECT_VALUE_AS_STRING = "[object Object]";

const p1: SimpleMap<any> = {
	"a.b.a": "a1",
	"a.b.b": "b1",
	"a.b.c": "c1",
	"xyz.abc.one": "one1",
	"xyz.abc.two": "two2",
	"xyz.cba.one": "1one",
	"xyz.cba.two": "2two",
	"xyz.wild.one": "wild1",
	"zyx": {a: 1, b: 2, c: 3}
};

const p2: SimpleMap<any> = {
	"a.b.b": "b2",
	"a.b.c": "c2",
	"a.b.d": "d2",
	"xyz.abc.three": "three3",
	"xyz.abc.four": "four4",
	"xyz.wild.two": "wild2"
};

const p3: SimpleMap<any> = {
	"a.b.a": "z1",
	"a.b.b": "b3",
	"a.b.d": "d3",
	"a.b.e": "e3",
	"xyz.abc.five": "five5",
	"xyz.cba.three": "3three",
	"xyz.wild.three": "wild3",
	"some.digits.number": 12.234,
	"some.digits.int": 27,
	"some.digits.bigint": 9007199254740996
};

describe("PropertiesAlternativeImpl", () => {

	let specimen: MutableProperties = null;

	beforeEach(() => {
		specimen = new PropertiesAlternativeImpl();
	});
	
	afterEach(() => {
		specimen = null;
	});
	
	test("PropertiesAlternativeImpl instantiates and available", () => {
		const properties: MutableProperties = new PropertiesAlternativeImpl();
		const namedResults: string[] = [];
		const generalResults: string[] = [];
		const namedCallback: (value: string) => void = (value: string) => namedResults.push(value);
		const generalCallback: (name: string, value: string) => void = (name: string, value: string) => generalResults.push(name + " - " + value);

		properties.addObserver(generalCallback);
		properties.addPropertyObserver("my-property", namedCallback);

		properties.set("my-property", "foo");
		properties.set("my-property", "bar");

		properties.removeObserver(generalCallback);
		properties.removePropertyObserver("my-property", namedCallback);

		properties.set("my-property", "bat");
		properties.set("my-property", "baz");

		expect(namedResults.length).toEqual(2);
		expect(namedResults[0]).toEqual("foo");
		expect(namedResults[1]).toEqual("bar");

		expect(generalResults.length).toEqual(2);
		expect(generalResults[0]).toEqual("my-property - foo");
		expect(generalResults[1]).toEqual("my-property - bar");
	});

	test("PropertiesAlternativeImpl property inheritance", () => {
		const parent: MutableProperties = new PropertiesAlternativeImpl();
		const child: MutableProperties = parent.extend();
		const grandChild: MutableProperties = child.extend();

		parent.set("alpha", "foo0");
		parent.set("beta", "bar0");
		parent.set("gamma", "bat0");
		child.set("alpha", "foo1");
		child.set("beta", "bar1");
		grandChild.set("alpha", "foo2");

		expect(parent.get("alpha")).toEqual("foo0");
		expect(parent.get("beta")).toEqual("bar0");
		expect(parent.get("gamma")).toEqual("bat0");
		expect(child.get("alpha")).toEqual("foo1");
		expect(child.get("beta")).toEqual("bar1");
		expect(child.get("gamma")).toEqual("bat0");
		expect(grandChild.get("alpha")).toEqual("foo2");
		expect(grandChild.get("beta")).toEqual("bar1");
		expect(grandChild.get("gamma")).toEqual("bat0");
	});

	//
	// Tests to create
	//

	// Properties::addObserver(callback: (key: string, value: any) => void);
	// - Valid callback invoked when any property changes
	// - Null callback rejected with error thrown

	// Properties::removeObserver(callback: (key: string, value: any) => void);
	// - Valid already registered callback removed
	// - Invalid not registered callback, but no action taken
	// - Null callback rejected with error thrown

	// Properties::addPropertyObserver(key: string, callback: (value: any) => void);
	// - Valid callback invoked when matching property changes
	// - Valid callback not invoked when other property changes
	// - Null callback rejected with error thrown

	// Properties::removePropertyObserver(key: string, callback: (value: any) => void);
	// - Valid already registered callback removed
	// - Invalid not registered callback, but no action taken
	// - Null callback rejected with error thrown

	// Properties::snapshot(): MutableProperties;
	// - New properties object created with flattened list of properties from source properties object

	// Properties::keys(): string[];
	// - Key names of current effective properties of properties object returned for populated properties object
	// - Empty array returned for empty properties object
	test("Keys are as expected", () => {
		// not implemented yet - need a good way to "load" props
	});

	// Properties::get<T>(key: string): T;
	// - Pinned value from parent - Parent value returned
	// - Pinned value from grandparent - Grandparent value returned
	// - Unpinned values, value in parent, not grandparent, not in local - Parent value returned
	// - Unpinned values, value in parent, and grandparent, not in local - Parent value returned
	// - Unpinned values, value not in parent, in grandparent, in local - Local value returned
	// - Unpinned values, value in parent, in grandparent, in local - Local value returned
	// - Null key passed, error thrown

	// Properties::includes(key: string): boolean;
	// - Value inherited from grandparent - returns true
	// - Value inherited from parent - returns true
	// - Value present locally - returns true
	// - No present in grandparent, parent or local - returns false
	// - Null key passed, error thrown

	// Properties::extend(): MutableProperties;
	// - Creates new child properties object subject to parent and ancestors

	// Properties::isDefined(key: string): boolean;
	// - Non-null value for key - return true
	// - Null value for key - return false
	// - Null key passed, error thrown

	// Properties::isTruthy(key: string): boolean;
	// - For "truthy" value for value - return true
	// - For non-"truthy" value for value - return value
	// - Null key passed, error thrown

	// Properties::isFalsy(key: string): boolean;
	// - For "falsy" value for value - return true
	// - For non-"falsy" value for value - return value
	// - Null key passed, error thrown

	// Properties::isLocked(key: string): boolean;
	// - For locally locked property, return true
	// - For locally not locked property, return false
	// - Null key passed, error thrown

	// Properties::isPinned(key: string): boolean;
	// - For locally pinned property, return true
	// - For parent pinned property, return true
	// - For grandparent pinned property, return true
	// - For locally not pinned property, return false
	// - For parent not pinned property, return false
	// - For grandparent not pinned property, return false
	// - Null key passed, error thrown

	// Properties::getAsString(key: string): string;
	// - For non-null value, return string converted version
	// - For null value, return null
	// - For unknown property, return null
	// - Null key passed, error thrown

	// MutableProperties::set(key: string, value: any): MutableProperties;
	// - If property locked locally, error thrown
	// - If property not locked locally, set value in local values
	// - Null key passed, error thrown

	// MutableProperties::load(values: any): MutableProperties;
	// - Attempt to local properties from object into property object
	// - If null values passed, error thrown

	// MutableProperties::remove(key: string): MutableProperties;
	// - If key present in properties object, remove value and key
	// - If key not present in properties object do nothing
	// - Null key passed, error thrown

	// MutableProperties::clear(): MutableProperties;
	// - Remove all local properties of the properties object

	// MutableProperties::lock(...keys: string[]): MutableProperties;
	// - Marks a local properties as locked
	// - If null value, or non-string passed, error thrown

	// MutableProperties::unlock(...keys: string[]): MutableProperties;
	// - Marks a local properties as unlocked
	// - If null value, or non-string passed, error thrown

	// MutableProperties::pin(...keys: string[]): MutableProperties;
	// - Marks a local properties as pinned
	// - If null value, or non-string passed, error thrown

	// MutableProperties::unpin(...keys: string[]): MutableProperties;
	// - Marks a local properties as unpinned
	// - If null value, or non-string passed, error thrown

	// MutableProperties::modify<T>(key: string, modifierFn: (value: T) => T): MutableProperties;
	// - If the property exists, value is passed through modifierFn and returned value stored as new value for key
	// - If property does not exist, error thrown
	// - Null key passed, error thrown
	// - Null modifierFn passed, error thrown

	// MutableProperties::mirror(source: Properties): MutableProperties;
	// - Observers setup such that changes on the source properties and set into the local properties object when changes happen
	// - Null properties passed, error thrown

	//  * Locks one or more properties.
	// lock(...keys: string[]): MutableProperties;

	//  * Unlocks one or more properties.
	// unlock(...keys: string[]): MutableProperties;

	//  * Locks one or more properties.
	// pin(...keys: string[]): MutableProperties;

	//  * Unlocks one or more properties.
	// unpin(...keys: string[]): MutableProperties;

	// mirror(source: Properties): MutableProperties;

	// addPropertyObserver(key: string, callback: (value: any) => void);

	// removePropertyObserver(key: string, callback: (value: any) => void);

	// addGroupedPropertyObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	// removeGroupedPropertyObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	// snapshot(): MutableProperties;

	//  * Meta information about the property
	// attributesOf(key: string): PropFlagVals;

	//  * Get a mutable inheriting child {@link Properties} object
	// extend(): MutableProperties;

	//  * Indicates whether a specific property is locked.
	// isLocked(key: string): boolean;

	//  * Indicates whether a specific property is pinned.
	// isPinned(key: string): boolean;

	//  * Get keys associated with a particular key family prefix; i.e. 'cydran.logging'
	// familyGroupKeysFrom(key: string, immuteToo: boolean): string[];

	test("addObserver - Callback is executed for all effective property mutations", () => {
		const results: string[] = [];
		const callback: (key: string, value: any) => void = (key: string, value: any) => results.push(key + " - " + value);

		specimen.addObserver(callback);

		specimen.set("alpha", "foo0");
		specimen.set("beta", "bar0");
		specimen.set("gamma", "bat0");
		specimen.set("alpha", "foo1");
		specimen.set("beta", "bar1");
		specimen.set("gamma", "bat1");

		expect(results.length).toEqual(6);
		expect(results[0]).toEqual("alpha - foo0");
		expect(results[1]).toEqual("beta - bar0");
		expect(results[2]).toEqual("gamma - bat0");
		expect(results[3]).toEqual("alpha - foo1");
		expect(results[4]).toEqual("beta - bar1");
		expect(results[5]).toEqual("gamma - bat1");
	});


	test("addObserver - Callback is executed for all effective property mutations that introduce different values for a property", () => {
		const results: string[] = [];
		const callback: (key: string, value: any) => void = (key: string, value: any) => results.push(key + " - " + value);

		specimen.addObserver(callback);

		specimen.set("alpha", "foo0");
		specimen.set("beta", "bar0");
		specimen.set("gamma", "bat0");
		specimen.set("alpha", "foo0");
		specimen.set("beta", "bar0");
		specimen.set("gamma", "bat0");

		expect(results.length).toEqual(3);
		expect(results[0]).toEqual("alpha - foo0");
		expect(results[1]).toEqual("beta - bar0");
		expect(results[2]).toEqual("gamma - bat0");
	});

	test("removeObserver - Callback is executed for only effective property mutations occurring when the callback is present", () => {
		const results: string[] = [];
		const callback: (key: string, value: any) => void = (key: string, value: any) => results.push(key + " - " + value);

		specimen.addObserver(callback);

		specimen.set("alpha", "foo0");
		specimen.set("beta", "bar0");
		specimen.set("gamma", "bat0");

		specimen.removeObserver(callback);

		specimen.set("alpha", "foo1");
		specimen.set("beta", "bar1");
		specimen.set("gamma", "bat1");

		expect(results.length).toEqual(3);
		expect(results[0]).toEqual("alpha - foo0");
		expect(results[1]).toEqual("beta - bar0");
		expect(results[2]).toEqual("gamma - bat0");
	});

	test("remove - Properties are removed from the provided object", () => {
		expect(specimen.keys()).toEqual([]);

		specimen.load({
			"included0": "a defined value",
			"included1": NUMBER_VALUE,
			"included2": OBJECT_VALUE,
			"included3":  null,
			"included4":  undefined
		});

		expect(specimen.keys()).toEqual(["included0", "included1", "included2", "included3", "included4"]);

		specimen.remove("included1");
		specimen.remove("included3");

		expect(specimen.keys()).toEqual(["included0", "included2", "included4"]);
	});

	test("load - Properties are loaded from the provided object", () => {
		expect(specimen.keys()).toEqual([]);

		specimen.load({
			"included0": "a defined value",
			"included1": NUMBER_VALUE,
			"included2": OBJECT_VALUE,
			"included3":  null,
			"included4":  undefined
		});

		expect(specimen.includes("included0")).toBeTruthy();
		expect(specimen.includes("included1")).toBeTruthy();
		expect(specimen.includes("included2")).toBeTruthy();
		expect(specimen.includes("included3")).toBeTruthy();
		expect(specimen.includes("included4")).toBeTruthy();
		expect(specimen.includes("included5")).toBeFalsy();
		expect(specimen.includes("included6")).toBeFalsy();

		expect(specimen.get("included0")).toBe("a defined value");
		expect(specimen.get("included1")).toBe(NUMBER_VALUE);
		expect(specimen.get("included2")).toBe(OBJECT_VALUE);
	});

	test("modify - Property is replaced by the transformed value", () => {
		specimen.set("foo", "bar");
		expect(specimen.includes("foo")).toBeTruthy();
		expect(specimen.get("foo")).toBe("bar");

		specimen.modify("foo", (value: string) => value.toUpperCase());

		expect(specimen.includes("foo")).toBeTruthy();
		expect(specimen.get("foo")).toBe("BAR");
	});

	test("set - Property is present after being set", () => {
		specimen.set("foo", "bar");
		expect(specimen.includes("foo")).toBeTruthy();
		expect(specimen.get("foo")).toBe("bar");
	});

	test("clear - Properties are removed from the properties object", () => {
		specimen.set("included0", "a defined value");
		specimen.set("included1", NUMBER_VALUE);
		specimen.set("included2", OBJECT_VALUE);
		specimen.set("included3", null);
		specimen.set("included4", undefined);

		expect(specimen.keys()).toEqual(["included0", "included1", "included2", "included3", "included4"]);

		specimen.clear();

		expect(specimen.keys()).toEqual([]);
	});

	test("keys - Property keys valid based on what is currently in the properties object", () => {
		specimen.set("included0", "a defined value");
		specimen.set("included1", NUMBER_VALUE);
		specimen.set("included2", OBJECT_VALUE);
		specimen.set("included3", null);
		specimen.set("included4", undefined);

		expect(specimen.keys()).toEqual(["included0", "included1", "included2", "included3", "included4"]);
	});

	test("includes - Property values identified by key evaluate as included when they are present regardless of being null or undefined", () => {
		specimen.set("included0", "a defined value");
		specimen.set("included1", NUMBER_VALUE);
		specimen.set("included2", OBJECT_VALUE);
		specimen.set("included3",  null);
		specimen.set("included4",  undefined);

		expect(specimen.includes("included0")).toBeTruthy();
		expect(specimen.includes("included1")).toBeTruthy();
		expect(specimen.includes("included2")).toBeTruthy();
		expect(specimen.includes("included3")).toBeTruthy();
		expect(specimen.includes("included4")).toBeTruthy();
		expect(specimen.includes("included5")).toBeFalsy();
		expect(specimen.includes("included6")).toBeFalsy();	
	});

	test("isDefined - Property values identified by key evaluate as defined when they are present and not null of undefined", () => {
		specimen.set("defined0", "a defined value");
		specimen.set("defined1", NUMBER_VALUE);
		specimen.set("defined2", OBJECT_VALUE);
		specimen.set("notDefined0",  null);
		specimen.set("notDefined1",  undefined);

		expect(specimen.isDefined("defined0")).toBeTruthy();
		expect(specimen.isDefined("defined1")).toBeTruthy();
		expect(specimen.isDefined("defined2")).toBeTruthy();
		expect(specimen.isDefined("notDefined0")).toBeFalsy();
		expect(specimen.isDefined("notDefined1")).toBeFalsy();
	});

	test("isTruthy - Defined property values identified by key evaluate as truthy when they are truthy", () => {
		specimen.set("truthy0", "a truthy value");
		specimen.set("truthy1", NUMBER_VALUE);
		specimen.set("truthy2", OBJECT_VALUE);
		specimen.set("truthy3", true);

		specimen.set("falsy0", false);
		specimen.set("falsy1", 0);
		specimen.set("falsy2", -0);
		specimen.set("falsy3", "");
		specimen.set("falsy4", null);
		specimen.set("falsy5", undefined);
		specimen.set("falsy6", NaN);

		expect(specimen.isTruthy("truthy0")).toBeTruthy();
		expect(specimen.isTruthy("truthy1")).toBeTruthy();
		expect(specimen.isTruthy("truthy2")).toBeTruthy();
		expect(specimen.isTruthy("truthy3")).toBeTruthy();

		expect(specimen.isTruthy("falsy0")).toBeFalsy();
		expect(specimen.isTruthy("falsy1")).toBeFalsy();
		expect(specimen.isTruthy("falsy2")).toBeFalsy();
		expect(specimen.isTruthy("falsy3")).toBeFalsy();
		expect(specimen.isTruthy("falsy4")).toBeFalsy();
		expect(specimen.isTruthy("falsy5")).toBeFalsy();
		expect(specimen.isTruthy("falsy6")).toBeFalsy();
	});

	test("isFalsy - Defined property values identified by key evaluate as falsy when they are falsy", () => {
		specimen.set("truthy0", "a truthy value");
		specimen.set("truthy1", NUMBER_VALUE);
		specimen.set("truthy2", OBJECT_VALUE);
		specimen.set("truthy3", true);

		specimen.set("falsy0", false);
		specimen.set("falsy1", 0);
		specimen.set("falsy2", -0);
		specimen.set("falsy3", "");
		specimen.set("falsy4", null);
		specimen.set("falsy5", undefined);
		specimen.set("falsy6", NaN);

		expect(specimen.isFalsy("truthy0")).toBeFalsy();
		expect(specimen.isFalsy("truthy1")).toBeFalsy();
		expect(specimen.isFalsy("truthy2")).toBeFalsy();
		expect(specimen.isFalsy("truthy3")).toBeFalsy();

		expect(specimen.isFalsy("falsy0")).toBeTruthy();
		expect(specimen.isFalsy("falsy1")).toBeTruthy();
		expect(specimen.isFalsy("falsy2")).toBeTruthy();
		expect(specimen.isFalsy("falsy3")).toBeTruthy();
		expect(specimen.isFalsy("falsy4")).toBeTruthy();
		expect(specimen.isFalsy("falsy5")).toBeTruthy();
		expect(specimen.isFalsy("falsy6")).toBeTruthy();
	});

	test("getAsString - Defined property values identified by key evaluate as their string equivalents", () => {
		specimen.set("value-string", STRING_VALUE);
		specimen.set("value-number", NUMBER_VALUE);
		specimen.set("value-object", OBJECT_VALUE);

		expect(specimen.getAsString("value-string")).toBe(STRING_VALUE);
		expect(specimen.getAsString("value-number")).toBe(NUMBER_VALUE_AS_STRING);
		expect(specimen.getAsString("value-object")).toBe(OBJECT_VALUE_AS_STRING);
	});

	test("get - Defined property values identified by key evaluate as their original form", () => {
		specimen.set("value-string", STRING_VALUE);
		specimen.set("value-number", NUMBER_VALUE);
		specimen.set("value-object", OBJECT_VALUE);

		expect(specimen.get("value-string") === STRING_VALUE).toBeTruthy();
		expect(specimen.get("value-number") === NUMBER_VALUE).toBeTruthy();
		expect(specimen.get("value-object") === OBJECT_VALUE).toBeTruthy();
	});

	// TODO - Fully vet inherited properties object chains
	// TODO - Fully vet null guarding expectations

});
