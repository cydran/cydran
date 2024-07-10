import { describe, test, expect } from '@jest/globals';
import propertyMapGenerator from 'properties/propertyMapGenerator';
import AdvancedMap from 'pattern/AdvancedMap';

describe.skip("propertyMapGenerator", () => {

	test("With Prefix - Substring", () => {
		const result: AdvancedMap<string[]> = propertyMapGenerator("foo.bar.baz.bat.level", "foo.bar");
		expect(result).not.toBeNull();
		expect(result.keys()).toEqual(["foo.bar.level", "foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.level")).toEqual(["foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.baz.level")).toEqual(["foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.baz.bat.level")).toEqual([]);
	});

	test("With Prefix - Same as preferredKey", () => {
		const result: AdvancedMap<string[]> = propertyMapGenerator("foo.bar", "foo.bar");
		expect(result).not.toBeNull();
		expect(result.keys()).toEqual(["foo.bar"]);
		expect(result.get("foo.bar")).toEqual([]);
	});

	test("With Prefix - Mismatch", () => {
		expectThrown(() => propertyMapGenerator("foo.bar", "baz.bat"), "PrefixMismatchError",
			"preferredKey must start with the prefix");
	});

	test("With Prefix - Null preferredKey", () => {
		// TODO - Implement
	});

	test("Without Prefix - Single", () => {
		// TODO - Implement
	});

	test("Without Prefix - Multiple", () => {
		const result: AdvancedMap<string[]> = propertyMapGenerator("foo.bar.baz.bat.level", null);
		expect(result).not.toBeNull();
		expect(result.keys()).toEqual(["level", "foo.level", "foo.bar.level", "foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("level")).toEqual(["foo.level", "foo.bar.level", "foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("foo.level")).toEqual(["foo.bar.level", "foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.level")).toEqual(["foo.bar.baz.level", "foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.baz.level")).toEqual(["foo.bar.baz.bat.level"]);
		expect(result.get("foo.bar.baz.bat.level")).toEqual([]);
	});

	test("Without Prefix - Null preferredKey, null prefix", () => {
		expectThrown(() => propertyMapGenerator(null, null), "NullValueError", "preferredKey shall not be null");
	});

	test("Without Prefix - Null preferredKey, non-null prefix", () => {
		expectThrown(() => propertyMapGenerator(null, "prefix"), "NullValueError", "preferredKey shall not be null");
	});

	function expectThrown(work: () => void, expectedType: string, expectedMessage: string): void {
		let thrown: Error = null as unknown as Error;

		try {
			work();
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
		expect(thrown.name).toEqual(expectedType);
		expect(thrown.message).toEqual(expectedMessage);
	}

});
