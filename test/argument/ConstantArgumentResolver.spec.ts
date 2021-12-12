import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import ConstantArgumentResolver from "argument/ConstantArgumentResolver";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: ConstantArgumentResolver = new ConstantArgumentResolver(null);
	expect(specimen).not.toBe(null);
});

test("resolve item", () => {
	const obj1: Object = null;
	const s1: ConstantArgumentResolver = new ConstantArgumentResolver(obj1);
	expect(s1.resolve(wkModule)).toBe(null);

	const obj2: Object = { bubba: "licious" };
	const s2: ConstantArgumentResolver = new ConstantArgumentResolver(obj2);
	expect(s2.resolve(wkModule)).toEqual(obj2);

	const obj3: string = "bubbalicious";
	const s3: ConstantArgumentResolver = new ConstantArgumentResolver(obj3);
	expect(s3.resolve(wkModule)).toEqual(obj3);

	const obj4: Function = (a1: string): string => { return a1.toUpperCase(); };
	const s4: ConstantArgumentResolver = new ConstantArgumentResolver(obj4);
	const fnA1: string = "silly";
	expect(s4.resolve(wkModule)(fnA1)).toEqual(fnA1.toUpperCase());
});
