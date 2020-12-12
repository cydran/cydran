import { LoggerServiceImpl } from "log/LoggerImpl";
import { Level } from "log/Level";

const ls: LoggerServiceImpl = LoggerServiceImpl.INSTANCE;

test("LoggerService setLevel - TRACE", () => {
	ls.setLevel(Level.TRACE);
	expect(ls.isTrace()).toEqual(true);
});

test("LoggerService setLevel - DEBUG", () => {
	ls.setLevel(Level.DEBUG);
	expect(ls.isDebug()).toEqual(true);
});

test("LoggerService setLevel - INFO", () => {
	ls.setLevel(Level.INFO);
	expect(ls.isInfo()).toEqual(true);
});

test("LoggerService setLevel - WARN", () => {
	ls.setLevel(Level.WARN);
	expect(ls.isWarn()).toEqual(true);
});

test("LoggerService setLevel - ERROR", () => {
	ls.setLevel(Level.ERROR);
	expect(ls.isError()).toEqual(true);
});

test("LoggerService setLevel - FATAL", () => {
	ls.setLevel(Level.FATAL);
	expect(ls.isFatal()).toEqual(true);
});

test("LoggerService setLevel - DISABLED", () => {
	ls.setLevel(Level.DISABLED);
	expect(ls.isDisabled()).toEqual(true);
});
