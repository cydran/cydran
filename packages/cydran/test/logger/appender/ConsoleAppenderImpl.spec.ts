import { test, expect, beforeAll, jest, describe } from "@jest/globals";
import Level from 'log/Level';
import PropertiesImpl from "properties/PropertiesImpl";
import { PropertyKeys } from "CydranConstants";
import ConsoleAppenderImpl from 'log/appender/ConsoleAppenderImpl';

const msg: string = "test payload";
let cos: ConsoleAppenderImpl = null;

describe("ConsoleAppenderImpl", () => {

	beforeAll(() => {
		const p: {} = {
			[PropertyKeys.CYDRAN_LOG_LEVEL]: "trace"
		};
		const wkprops: PropertiesImpl = new PropertiesImpl();
		wkprops.load(p);
		cos = new ConsoleAppenderImpl(wkprops);
	});

	test("ConsoleAppenderImpl is not null", () => {
		expect(cos).not.toBeNull();
	});

	test("log @ DISABLED level", () => {
		const wkSpy: ConsoleAppenderImpl = jest.spyOn(cos, 'log');
		cos.log("TEST_CLASS", Level.DISABLED, "should not log", false);
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("log @ INFO level w/ FULLSTACK", () => {
		const wkSpy: ConsoleAppenderImpl = jest.spyOn(cos, 'log');
		cos.log("TEST_CLASS", Level.INFO, "with full stack", true);
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("log @ every level", () => {
		const wkSpy: ConsoleAppenderImpl = jest.spyOn(cos, 'log');
		Object.keys(Level)
			.filter(k => !/\d+/.test(k))
			.forEach(key => {
				const wkLvl: Level = Level[key];
				cos.log("TEST_CLASS", wkLvl, `level logged = ${key}`, false);
				expect(wkSpy).toBeCalledTimes(1);
				wkSpy.mockClear();
			}
			);
	});

});
