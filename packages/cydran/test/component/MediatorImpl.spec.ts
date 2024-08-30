import { test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { assertNullGuarded } from "test/TestUtils";
import ScopeImpl from 'scope/ScopeImpl';
import MediatorImpl from 'mediator/MediatorImpl';
import Mediator from 'mediator/Mediator';
import { clone, equals } from 'util/Utils';

import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import LoggerFactory from "log/LoggerFactory";

const IDENTITY_FN: (input: any) => any = (input: any) => input;

const EMPTY_FN = function() { /**/ };
const expression: string = "m().value";
const callback: string = "callback";
const model: any = {};
const item: any = {};

function getNewMediator() {
	const scope: ScopeImpl = new ScopeImpl();
	scope.setMFn(() => model);
	scope.setVFn(() => item);
	return new MediatorImpl<{}>(expression, scope, IDENTITY_FN, (value: any) => clone(100, value), (first: any, second: any) => equals(100, first, second));
}

let specimen: Mediator<any> = null;

beforeEach(() => {
	const wkProps: PropertiesImpl = new PropertiesImpl();
	wkProps.load(PROPS);
	LoggerFactory.init(wkProps);
	specimen = getNewMediator();
	specimen.watch({}, IDENTITY_FN);
});

afterEach(() => {
	specimen = null;
});

test("Constructor - Normal Instantation", () => {
	expect(specimen).not.toBeNull();
});

test("Constructor - null scope", () => {
	assertNullGuarded("scope", () => new MediatorImpl({}, null, new ScopeImpl(), IDENTITY_FN, null, null));
});

test("watch() - null targetThis", () => {
	assertNullGuarded("targetThis", () => specimen.watch(null, EMPTY_FN));
});

test("watch() - null callback", () => {
	assertNullGuarded(callback, () => specimen.watch({}, null));
});

test("evaluate(): boolean", () => {
	const result = specimen.evaluate();
	expect(result).toEqual(false);
});

test("notify(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'notify');
	specimen.notify();
	expect(wkSpy).toBeCalledTimes(1);
});

test("release(): void", () => {
	const wkSpy = jest.spyOn(specimen, '$release');
	specimen.$release();
	expect(wkSpy).toBeCalledTimes(1);
});

test("tell(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'tell');
	const msgName: string = "testmsg";
	const payload: any = {'name': msgName};
	specimen.tell(msgName, payload);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getExpression(): string", () => {
	const wkSpy = jest.spyOn(specimen, 'getExpression');
	const result: string = specimen.getExpression();
	expect(wkSpy).toBeCalledTimes(1);
	expect(result).toEqual(expression);
});

test("get(): T", () => {
	const value: string = "Bubba";
	specimen.set(value);

	expect(model["value"]).toEqual("Bubba");

	const result: string = specimen.get();
	expect(result).toEqual(value);
});

test("evaluate(): boolean", () => {
	const testName1: string = "Bubba";
	specimen.set(testName1);
	const result: () => string = specimen.get();
	expect(result).toEqual(testName1);
	expect(specimen.evaluate()).toBe(false);

	specimen.mount();

	const testName2: string = "Sally";
	specimen.set(testName2);
	const wkSpy = jest.spyOn(specimen, 'evaluate');
	expect(specimen.evaluate()).toBe(true);
	expect(wkSpy).toBeCalledTimes(1);
});

test("initialize(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'initialize');
	specimen.initialize();
	expect(wkSpy).toBeCalledTimes(1);
});

test("mount(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'mount');
	specimen.mount();
	expect(wkSpy).toBeCalledTimes(1);
});

test("unmount(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'unmount');
	specimen.unmount();
	expect(wkSpy).toBeCalledTimes(1);
});

test("remount(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'remount');
	specimen.remount();
	expect(wkSpy).toBeCalledTimes(1);
});

test("notify(): void", () => {
	const testName1: string = "Bubba";
	specimen.set(testName1);
	const result: () => string = specimen.get();
	expect(result).toEqual(testName1);

	specimen.mount();

	const testName2: string = "Sally";
	specimen.set(testName2);
	specimen.evaluate();
	const wkSpy = jest.spyOn(specimen, 'notify');
	specimen.notify();
	expect(wkSpy).toBeCalledTimes(1);
});
