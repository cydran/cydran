import LoggerServiceImpl from 'log/LoggerServiceImpl';
import Level from 'log/Level';
import { enumKeys } from 'util/Utils';

const ls: LoggerServiceImpl = new LoggerServiceImpl();

beforeEach(() => {
	ls.setLevel(Level.WARN);
});

test("constructor works", () => {
	expect(ls).not.toBeNull();
	expect(ls.isWarn()).toBe(true);
});

test("setlevelByName - bad value", () => {
	expect(ls.isTrace()).toBe(false);
	expect(ls.isWarn()).toBe(true);
	ls.setLevelByName("bubba");
	expect(ls.isWarn()).toBe(true);
});

test("LoggerService setLevel", () => {
	enumKeys(Level).forEach(k => {
		console.log(`Setting level: ${ k }`);
		const wkLvl: Level = Level[k];
		ls.setLevel(wkLvl);
		expect(ls.willMeet(wkLvl)).toEqual(true);
	});
});
