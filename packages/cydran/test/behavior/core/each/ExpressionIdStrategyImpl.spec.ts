import { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } from "@jest/globals";
import ExpressionIdStrategyImpl from "behavior/core/each/ExpressionIdStrategyImpl";
import { DEFAULT_ID_KEY } from "CydranConstants";

import PROPS from "../../../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import getLogger from 'log/getLogger';

import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

let wkProps: MutableProperties = null;

describe("ExpressionIdStrategyImpl", () => {

	beforeAll(() => {
		wkProps = new PropertiesImpl();
		wkProps.load(PROPS);
	});

	afterAll(() => {
		wkProps = null;
	});

	let instance: ExpressionIdStrategyImpl = null;
	const wkExpVal: string = "Bob";

	beforeEach(() => {
		instance = new ExpressionIdStrategyImpl(wkExpVal, getLogger('test-logger', `Id Function: ${wkExpVal}`));
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
		const item: {} = { [DEFAULT_ID_KEY]: wkVal };
		expect(instance.check(item)).toBeFalsy();
	});

	test.skip("extract - bad", () => {
		// TODO: not sure how to make this fail
		instance = new ExpressionIdStrategyImpl(null, getLogger('test-logger', `Id Function: ${wkExpVal}`));
		const result: any = instance.extract({});
		console.log(`result: ${result}`);
		expect(() => { instance.extract({}); }).toThrowError(Error);
	});

});
