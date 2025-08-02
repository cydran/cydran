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

	test("extract - bad", () => {
		instance = new ExpressionIdStrategyImpl("(function() { throw new Error(); })()", getLogger('test-logger', `Id Function: ${wkExpVal}`));

		let thrown: Error = null as unknown as Error;

		try {
			instance.extract({});
		} catch (e) {
			thrown = e;
		}

		expect(thrown).not.toBeNull();
	});

});
