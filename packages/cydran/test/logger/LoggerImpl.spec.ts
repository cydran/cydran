import { beforeAll, afterEach, beforeEach, test, expect, jest } from "@jest/globals";
import Logger from 'log/Logger';
import LoggerImpl from 'log/LoggerImpl';
import LoggerFactory from 'log/LoggerFactory';
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import PROPS from "./loggerTestProps.json";

beforeAll(() => {
	const wkProps = new PropertiesAlternativeImpl();
	wkProps.load(PROPS);
	LoggerFactory.init(wkProps);
});

afterEach(() => {
	specimen = null;
});

const logName: string = "test";
const HELLO: string = "Hello World";
const helloFn: () => any = () => HELLO;
let specimen: LoggerImpl;

beforeEach(() => {
	specimen = LoggerFactory.getLogger(logName, "trace");
});

afterEach(() => {
	specimen = null;
});

test("getName(): string", () => {
	const result: string = specimen.getName().trim();
	expect(result).toEqual(logName);
});


test("trace('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'trace', null);
	specimen.trace(HELLO);
	expect(wkSpy).toBeCalledWith(HELLO);
});

test("ifTrace()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifTrace', null);
	specimen.ifTrace(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});

test("debug('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'debug', null);
	specimen.debug(HELLO);
	expect(wkSpy).toBeCalledWith(HELLO);
});

test("ifDebug()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifDebug', null);
	specimen.ifDebug(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});

test("info('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'info', null);
	specimen.info(HELLO);
	expect(wkSpy).toBeCalledWith(HELLO);
});

test("ifInfo()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifInfo', null);
	specimen.ifInfo(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});

test("warn('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'warn', null);
	specimen.warn(HELLO);
	expect(wkSpy).toBeCalledWith(HELLO);
});

test("ifWarn()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifWarn', null);
	specimen.ifWarn(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});

test("error('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'error', null);
	specimen.error(HELLO, null);
	expect(wkSpy).toBeCalledWith(HELLO, null);
});

test("ifError()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifError', null);
	specimen.ifError(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});

test("fatal('Hello World')", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'fatal', null);
	specimen.fatal(HELLO, null);
	expect(wkSpy).toBeCalledWith(HELLO, null);
});

test("ifFatal()", () => {
	const wkSpy: Logger = jest.spyOn(specimen, 'ifFatal', null);
	specimen.ifFatal(helloFn);
	expect(wkSpy).toBeCalledWith(helloFn);
});
