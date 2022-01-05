import LoggerServiceImpl from 'log/LoggerServiceImpl';
import Level from 'log/Level';
import { SelectorError } from "error/Errors";
import { Properties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import PropertyKeys from "const/PropertyKeys";

let ls: LoggerServiceImpl = null;
beforeAll(() => {
	const simpProps: {} = {
		[PropertyKeys.CYDRAN_LOGGING_LEVEL]: "warn"
	};
	const wkprops: Properties = new PropertiesImpl();
	wkprops.load(simpProps);
	ls = LoggerServiceImpl.INSTANCE(wkprops);
});

afterAll(() => {
	ls = null;
});

test("constructor works", () => {
	expect(ls.isWarn()).toBe(true);
});

test("setlevelByName - bad value", () => {
	expect(ls.isTrace()).toBe(false);
	expect(ls.isWarn()).toBe(true);
	ls.setLevelByName("bubba");
	expect(ls.isWarn()).toBe(true);
});

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
