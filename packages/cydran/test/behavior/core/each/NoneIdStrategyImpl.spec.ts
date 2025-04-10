import NoneIdStrategyImpl from "behavior/core/each/NoneIdStrategyImpl";
import { asString } from "util/AsFunctions";
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

let instance: NoneIdStrategyImpl = null;
const wkId: string = "xyz_test";

describe("NoneIdStrategyImpl", () => {

	beforeEach(() => {
		instance = new NoneIdStrategyImpl(wkId);
	});

	afterEach(() => {
		instance = null;
	});

	test("instance is good", () => {
		expect(instance).not.toBeNull();
		expect(instance).not.toBeUndefined();
	});

	test("check - good", () => {
		const wkVal: number = 123;
		const item: {} = { [wkId]: wkVal };
		expect(instance.check(item)).toBeTruthy();
		expect(item[wkId]).toEqual(wkVal);
	});

	test("check - bad", () => {
		const wkVal: number = 123;
		const item: {} = { [`${wkId}0`]: wkVal };
		expect(instance.check(item)).toBeFalsy();
	});

	test("extract", () => {
		const wkVal: number = 123;
		const item: {} = { [wkId]: wkVal };
		expect(instance.extract(item)).toEqual(asString(wkVal));
	});

	test("enrich", () => {
		const wkVal: number = 123;
		const item: {} = { [wkId]: wkVal };
		expect(() => { instance.enrich(item, 0) }).toThrowError(Error);
	});

});
