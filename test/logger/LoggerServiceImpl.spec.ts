import LoggerServiceImpl from 'log/LoggerServiceImpl';
import Level from 'log/Level';
import { enumKeys } from 'util/Utils';

const ls: LoggerServiceImpl = new LoggerServiceImpl();

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
	expect(ls.willMeet(Level.WARN)).toBe(true);
});

test("LoggerService setLevel", () => {
	enumKeys(Level).forEach(k => {
		// tslint:disable-next-line
		console.log(`Setting level: ${ k }`);
		const wkLvl: Level = Level[k];
		ls.setLevel(wkLvl);
		expect(ls.willMeet(wkLvl)).toEqual(true);
	});
});
