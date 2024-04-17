import { beforeAll, afterAll, beforeEach, afterEach, test, expect, jest } from "@jest/globals";
import ExpressionIdStrategyImpl from "behavior/core/each/ExpressionIdStrategyImpl";
import DEFAULT_ID_KEY from "const/DefaultIdKey";

import PROPS from "../../../logger/loggerTestProps.json";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";

let wkProps: Properties = null;

beforeAll(() => {
	wkProps = new PropertiesAlternativeImpl();
	wkProps.load(PROPS);
});

afterAll(() => {
	wkProps = null;
});

let instance: ExpressionIdStrategyImpl = null;
const wkExpVal: () => any = () => "Bob" as const;

beforeEach(() => {
	instance = new ExpressionIdStrategyImpl(wkExpVal, LoggerFactory.getLogger(`Id Function: ${ wkExpVal }`));
});

afterEach(() => {
	instance = null;
});

test("instance is good", () => {
	expect(instance).not.toBeNull();
	expect(instance).not.toBeUndefined();
});

test("check", () => {
	const wkVal: number = 123;
	const item: {} = {[DEFAULT_ID_KEY]: wkVal};
	expect(instance.check(item)).toBeFalsy();
});

test("enrich", () => {
	const wkSpy: ExpressionIdStrategyImpl = jest.spyOn(instance, 'enrich');
	instance.enrich({}, 0);
	expect(wkSpy).toBeCalledTimes(1);
});

test("init", () => {
	const wkSpy: ExpressionIdStrategyImpl = jest.spyOn(instance, 'init');
	instance.init();
	expect(wkSpy).toBeCalledTimes(1);
});

test("extract - good", () => {
	const result: any = instance.extract({});
	console.log(`result: ${ result }`);
	expect(result()).toEqual("Bob");
});

test.skip("extract - bad", () => {
	// TODO: not sure how to make this fail
	instance = new ExpressionIdStrategyImpl(null);
	const result: any = instance.extract({});
	console.log(`result: ${ result }`);
	expect(() => { instance.extract({}); }).toThrowError(Error);
});
