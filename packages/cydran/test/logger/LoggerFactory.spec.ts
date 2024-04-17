import { test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import LoggerFactory from "log/LoggerFactory";
import Level from "log/Level";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import PROPS from "./loggerTestProps.json";

let wkProps: Properties = null;

beforeAll(() => {
	wkProps = new PropertiesAlternativeImpl();
	wkProps.load(PROPS);
});

afterAll(() => {
	wkProps = null;
});

beforeEach(() => {
	LoggerFactory.init(wkProps);
});

test("currentLevelAsString()", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
});

test("currentLevel()", () => {
	expect(LoggerFactory.currentLevel()).toEqual(Level.DEBUG);
});

test("updateLevel(name: string) - good", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"].reverse();
	const results: {}[] = [];
	enumStates.forEach((val) => {
		try {
			LoggerFactory.updateLevel(val);
			const current: string = LoggerFactory.currentLevelAsString();
			results.push({'in': val, 'result': current});
			expect(current).toEqual(val);
		} catch (err) {
			fail(`bad value passed: ${ val }`);
		}
	});
	console.table(results);

	const baseline: string = "TRACE";
	LoggerFactory.updateLevel(baseline);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);

	const badVal: string = "whacko";
	LoggerFactory.updateLevel(badVal);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
});

test("updateLevel(name: string) - bad", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	const baseline: string = "TRACE";
	LoggerFactory.updateLevel(baseline);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
	const badVal: string = "whacko";
	LoggerFactory.updateLevel(badVal);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
});
