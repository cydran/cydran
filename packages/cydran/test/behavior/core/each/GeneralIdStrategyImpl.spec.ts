import GeneratedIdStrategyImpl from "behavior/core/each/GeneratedIdStrategyImpl";
import { asString } from "util/AsFunctions";
import DEFAULT_ID_KEY from "const/DefaultIdKey";

let instance: GeneratedIdStrategyImpl = null;

beforeEach(() => {
	instance = new GeneratedIdStrategyImpl(DEFAULT_ID_KEY);
});

afterEach(() => {
	instance = null;
});

test("instance is good", () => {
	expect(instance).not.toBeNull();
	expect(instance).not.toBeUndefined();
});

test("init", () => {
	const wkSpy: GeneratedIdStrategyImpl = jest.spyOn(instance, 'init');
	instance.init();
	expect(wkSpy).toBeCalledTimes(1);
});

test("check - good", () => {
	const wkVal: number = 123;
	const item: {} = {[DEFAULT_ID_KEY]: wkVal};
	expect(instance.check(item)).toBeTruthy();
	expect(item[DEFAULT_ID_KEY]).toEqual(wkVal);
});

test("check - bad", () => {
	const wkVal: number = 123;
	const item: {} = {[`${DEFAULT_ID_KEY}0`]: wkVal};
	expect(instance.check(item)).toBeFalsy();
});

test("extract", () => {
	const wkVal: number = 123;
	const item: {} = {[DEFAULT_ID_KEY]: wkVal};
	const result: string = instance.extract(item);
	expect(result).toEqual(asString(wkVal));
});

test("enrich", () => {
	const wkSpy: GeneratedIdStrategyImpl = jest.spyOn(instance, 'enrich');
	instance.enrich({}, 0);
	expect(wkSpy).toBeCalledTimes(1);
});
