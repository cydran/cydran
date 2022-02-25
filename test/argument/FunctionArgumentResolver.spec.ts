import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import FunctionArgumentResolver from "argument/FunctionArgumentResolver";
import { IllegalArgumentError } from "error/Errors";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver((): string => {return "whatever";});
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(() => { return 2 * 2; });
	expect(specimen.resolve(wkModule)).toEqual(4);
});

test("resolve bad item", () => {
	expect(() => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver("bubba");
	}).toThrowError(IllegalArgumentError);
});
