import { test, expect, beforeEach, jest, afterEach } from "@jest/globals";
import Level from 'log/Level';
import ConsoleAppender from 'log/appender/ConsoleAppender';

const msg: string = "test payload";
let spec: ConsoleAppender = null;

beforeEach(() => {
	spec = new ConsoleAppender();
});

afterEach(() => {
	spec = null;
});

test("ConsoleAppender is not null", () => {
	expect(spec).not.toBeNull();
});

test("log @ DISABLED level", () => {
	const wkSpy: ConsoleAppender = jest.spyOn(spec, 'log');
	spec.log("TEST_CLASS", Level.DISABLED, "should not log", false);
	expect(wkSpy).toBeCalledTimes(1);
});

test("log @ INFO level w/ FULLSTACK", () => {
	const wkSpy: ConsoleAppender = jest.spyOn(spec, 'log');
	spec.log("TEST_CLASS", Level.INFO, "with full stack", true);
	expect(wkSpy).toBeCalledTimes(1);
});

test("log @ every level", () => {
	const wkSpy: ConsoleAppender = jest.spyOn(spec, 'log');
	Object.keys(Level)
		.filter(k => !/\d+/.test(k))
		.forEach(key => {
			const wkLvl: Level = Level[key];
			spec.log("TEST_CLASS", wkLvl, `level logged = ${ key }`, false);
			expect(wkSpy).toBeCalledTimes(1);
			wkSpy.mockClear();
		}
	);
});
