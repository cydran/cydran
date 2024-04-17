import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { MutableProperties } from 'properties/Property';
import SimpleMap from 'interface/SimpleMap';

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

	//
	// Created tests - Group 1
	//



	//
	// Created tests - Group 2
	//

	//  * Set a property value
	//  * @param key - string value
	//  * @param value - any type of object
	//  * @returns
	// set(key: string, value: any): MutableProperties;

	//  * Load additional properties in
	//  * @param values - any type of object
	//  * @returns
	// load(values: any): MutableProperties;

	//  * Remove a specific property by key
	//  * @param key - string value
	//  * @returns
	// remove(key: string): MutableProperties;

	//  * Clear the current properties instance object of all values
	//  * @returns
	// clear(): MutableProperties;

	//  * Locks one or more properties.
	//  * @param keys keys of the properties to lock
	// lock(...keys: string[]): MutableProperties;

	//  * Unlocks one or more properties.
	//  * @param keys keys of the properties to unlock
	// unlock(...keys: string[]): MutableProperties;

	//  * Locks one or more properties.
	//  * @param keys keys of the properties to lock
	// pin(...keys: string[]): MutableProperties;

	//  * Unlocks one or more properties.
	//  * @param keys keys of the properties to unlock
	// unpin(...keys: string[]): MutableProperties;

	//  * Modifies a property by applying a function to the current value to derive a new value for the property.
	//  * @param key key of the property to modify
	//  * @param modifierFn Function with which to modify the property
	// modify<T>(key: string, modifierFn: (value: T) => T): MutableProperties;

	// mirror(source: Properties): MutableProperties;

	// addObserver(callback: (key: string, value: any) => void);

	// removeObserver(callback: (key: string, value: any) => void);

	// addPropertyObserver(key: string, callback: (value: any) => void);

	// removePropertyObserver(key: string, callback: (value: any) => void);

	// addGroupedPropertyObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	// removeGroupedPropertyObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	// snapshot(): MutableProperties;

	// keys(): string[];

	//  * Get the defined property object
	//  * @param key - property key value
	//  * @returns - typed property object
	// get<T>(key: string): T;

	//  * Indicates whether a property is defined.
	//  * @param key Property key
	// // TODO - Change name to exists
	// includes(key: string): boolean;

	//  * Meta information about the property
	//  * @param key - string value
	//  * @returns - object of meta-data
	// attributesOf(key: string): PropFlagVals;

	//  * Get a mutable inheriting child {@link Properties} object
	//  * @returns - properties object
	// extend(): MutableProperties;

	//  * Is the property indexed at the "key" defined
	//  * @param key - string value
	//  * @returns - property existence
	// isDefined(key: string): boolean;

	test("isDefined - Property values identified by key evaluate as defined when they are present and not null of undefined", () => {

	});

	test("isTruthy - Defined property values identified by key evaluate as truthy when they are truthy", () => {
		specimen.set("truthy0", "a truthy value");
		specimen.set("truthy1", 31337);
		specimen.set("truthy2", {});
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
		specimen.set("truthy1", 31337);
		specimen.set("truthy2", {});
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
		specimen.set("value-string", "This is a string");
		specimen.set("value-number", 31337);
		specimen.set("value-object", {});

		expect(specimen.getAsString("value-string")).toBe("This is a string");
		expect(specimen.getAsString("value-number")).toBe("31337");
		expect(specimen.getAsString("value-object")).toBe("[object Object]");
	});

	//  * 
	//  * @param key - string value
	//  * @returns - string value representation
	// getAsString(key: string): string;

	//  * Indicates whether a specific property is locked.
	//  * @param key - string value
	// isLocked(key: string): boolean;

	//  * Indicates whether a specific property is pinned.
	//  * @param key - string value
	// isPinned(key: string): boolean;

	//  * Get keys associated with a particular key family prefix; i.e. 'cydran.logging'
	//  * @param key - string value
	//  * @param immuteToo - should keys representing immutable properties be included in the result.  The default is false if no argument value is inlcuded (null, undefined)
	//  * @returns - array of property keys matching the equivilant to: value.indexOf(key) === 0
	// familyGroupKeysFrom(key: string, immuteToo: boolean): string[];

});
