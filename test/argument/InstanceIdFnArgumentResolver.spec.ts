import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	const idFn: Function = specimen.resolve(wkModule);
	expect(idFn).not.toBeNull();
	expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
});
