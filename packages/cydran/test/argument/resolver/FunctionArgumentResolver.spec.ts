import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Context from "context/Context";
import FunctionArgumentResolver from "argument/resolver/FunctionArgumentResolver";
import { IllegalArgumentError } from "error/Errors";
import GlobalContextImpl from 'context/GlobalContextImpl';

const whatEvFn = (): string => {return "whatever";};
let wkContext: Context;

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
});

test("specimen is whole", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(whatEvFn);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(() => { return 2 * 2; });
	expect(specimen.resolve(wkContext)).toEqual(4);
});

test("resolve bad item", () => {
	expect(() => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver("bubba");
	}).toThrowError(IllegalArgumentError);
});

test("postProcess()", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(whatEvFn);
  const wkSpy: FunctionArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});
