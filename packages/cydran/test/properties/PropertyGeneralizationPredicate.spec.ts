import { describe, test, expect } from '@jest/globals';
import { beforeEach } from 'node:test';
import PropertyGeneralizationPredicate from 'properties/PropertyGeneralizationPredicate';

describe("PropertyGeneralizationPredicate", () => {

	let specimen: (key: string, value: any) => boolean = null as unknown as (key: string, value: any) => boolean;
	let currentKeys: string[] = [];
	const presentPredicate = (key: string) => currentKeys.includes(key);

	beforeEach(() => {
		specimen = null as unknown as (key: string, value: any) => boolean;
		currentKeys = [];
	});

	test("No Prefix - Value always present", () => {
		currentKeys = ["foo.bar.baz.level", "foo.bar.level", "foo.level", "level"];

		specimen = new PropertyGeneralizationPredicate("foo.bar.baz.level", null, presentPredicate).getPredicate();

		expect(specimen).not.toBeNull();
		expect(specimen("foo.bar.baz.level", "value")).toBeTruthy();
		expect(specimen("foo.bar.level", "value")).toBeFalsy();
		expect(specimen("foo.level", "value")).toBeFalsy();
		expect(specimen("level", "value")).toBeFalsy();
	});

	test("No Prefix - Selectively present", () => {
		currentKeys = ["foo.level"];

		specimen = new PropertyGeneralizationPredicate("foo.bar.baz.level", null, presentPredicate).getPredicate();

		expect(specimen).not.toBeNull();
		expect(specimen("foo.bar.baz.level", "value")).toBeTruthy();
		expect(specimen("foo.bar.level", "value")).toBeTruthy();
		expect(specimen("foo.level", "value")).toBeTruthy();
		expect(specimen("level", "value")).toBeFalsy();
	});

	test("No Prefix - Selectively present", () => {
		currentKeys = ["foo.level"];

		specimen = new PropertyGeneralizationPredicate("foo.bar.baz.level", null, presentPredicate).getPredicate();

		expect(specimen).not.toBeNull();
		expect(specimen("foo.bar.baz.level", "value")).toBeTruthy();
		expect(specimen("foo.bar.level", "value")).toBeTruthy();
		expect(specimen("foo.level", "value")).toBeTruthy();
		expect(specimen("level", "value")).toBeFalsy();
	});

	test("Property missing", () => {
		currentKeys = ["foo.level"];

		specimen = new PropertyGeneralizationPredicate("foo.bar.baz.level", "foo", presentPredicate).getPredicate();

		expect(specimen).not.toBeNull();
		expect(specimen("foo.bar.baz.level", "value")).toBeTruthy();
		expect(specimen("foo.bar.level", "value")).toBeTruthy();
		expect(specimen("foo.level", "value")).toBeTruthy();
		expect(specimen("level", "value")).toBeFalsy();
	});

	test("Null preferredKey, non-null prefix, non-null presentPredicate", () => {
		expectThrown(() => new PropertyGeneralizationPredicate(null, "foo", presentPredicate), "NullValueError", "preferredKey shall not be null");		
	});

	test("non-null preferredKey, non-null prefix, null presentPredicate", () => {
		expectThrown(() => new PropertyGeneralizationPredicate("foo", "foo", null), "NullValueError", "predicate shall not be null");		
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
