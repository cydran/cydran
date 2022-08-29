import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Context from "context/Context";
import ContextImpl from "context/ContextImpl";
import FunctionArgumentResolver from "argument/FunctionArgumentResolver";
import { IllegalArgumentError } from "error/Errors";

let wkContext: Context;

beforeAll(() => {
	const mockMod: ContextImpl = mock(ContextImpl);
	wkContext = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver((): string => {return "whatever";});
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
