import { assertNullGuarded } from "test/TestUtils";
import ScopeImpl from 'scope/ScopeImpl';
import MediatorImpl from 'mediator/MediatorImpl';
import Mediator from 'mediator/Mediator';
import { clone, equals } from 'util/Utils';

const IDENTITY_FN: (input: any) => any = (input: any) => input;

const EMPTY_FN = function() { /**/ };
const expression: string = "expression";
const target: string = "target";

function getNewMediator() {
	const scope: ScopeImpl = new ScopeImpl();
	return new MediatorImpl(
		{},
		expression,
		scope,
		IDENTITY_FN,
		(value: any) => clone(100, value),
		(first: any, second: any) => equals(100, first, second));
}

let specimen: Mediator<any> = null;
beforeEach(() => {
	specimen = getNewMediator();
	specimen.watch({}, IDENTITY_FN);
});

afterEach(() => {
	specimen = null;
});

test("Constructor - Normal Instantation", () => {
	const specimen = getNewMediator();
	expect(specimen).not.toBeNull();
});

test("Constructor - null scope", () => {
	assertNullGuarded("scope", () => new MediatorImpl({}, null, new ScopeImpl(), IDENTITY_FN, null, null));
});

test("watch() - null watchContext", () => {
	const specimen = getNewMediator();
	assertNullGuarded("watchContext", () => specimen.watch(null, EMPTY_FN));
});

test("watch() - null target", () => {
	assertNullGuarded(target, () => getNewMediator().watch({}, null));
});

test("evaluate(): boolean", () => {
	const specimen: Mediator<any> = getNewMediator();
	const result = specimen.evaluate();
	expect(result).toEqual(false);
});

test("notify(): void", () => {
	const specimen: Mediator<any> = getNewMediator();
	const spyMmed = spy(specimen);
	specimen.notify();
	verify(spyMmed.notify()).once();
});

test("dispose(): void", () => {
	const specimen: Mediator<any> = getNewMediator();
	const spyMmed = spy(specimen);
	specimen.$dispose();
	verify(spyMmed.$dispose()).once();

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

test("invoke(): void", () => {
	const wkSpy = jest.spyOn(specimen, 'invoke');
	specimen.invoke();
	expect(wkSpy).toBeCalledTimes(1);
});

test("get(): T", () => {
	const testName: string = "Bubba";
	const wkFn: () => string = () => testName;
	specimen.set(wkFn);
	const wkSpy = jest.spyOn(specimen, 'get');
	const result: () => string = specimen.get();
	expect(wkSpy).toBeCalledTimes(1);
	expect(result).toEqual(wkFn);
	expect(result()).toEqual(testName);
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
