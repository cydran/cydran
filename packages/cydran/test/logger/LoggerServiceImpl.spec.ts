import { beforeAll, afterAll, beforeEach, test, expect } from "@jest/globals";
import LoggerServiceImpl from 'log/LoggerServiceImpl';
import Level from 'log/Level';
import { enumKeys } from 'util/Utils';
import PROPS from "./loggerTestProps.json";
import PropertiesImpl from 'properties/PropertiesImpl';

let ls: LoggerServiceImpl = null;

beforeAll(() => {
	const wkProps: PropertiesImpl = new PropertiesImpl();
	wkProps.load(PROPS);
	ls = new LoggerServiceImpl(wkProps);
});

afterAll(() => {
	ls = null;
});

beforeEach(() => {
	ls.setLevel(Level.WARN);
});

test("constructor works", () => {
	expect(ls).not.toBeNull();
	expect(ls.willMeet(Level.WARN)).toBe(true);
});

test("setLevelByName - bad value", () => {
	expect(ls.willMeet(Level.TRACE)).toBe(false);
	expect(ls.willMeet(Level.WARN)).toBe(true);
	ls.setLevelByName("bubba");
	expect(ls.getLevel()).toBe(Level.WARN);
	expect(ls.willMeet(Level.WARN)).toBe(true);
});

test("LoggerService setLevel", () => {
	enumKeys(Level).forEach(k => {
		// tslint:disable-next-line
		console.log(`Setting level: ${ k }`);
		const wkLvl: Level = Level[k];
		ls.setLevel(wkLvl);
		expect(ls.willMeet(wkLvl)).toEqual(true);
		expect(ls.getLevel()).toEqual(wkLvl);
	});
});
