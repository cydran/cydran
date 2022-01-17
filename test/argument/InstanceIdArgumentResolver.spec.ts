import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";
import { IllegalArgumentError } from "error/Errors";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: InstanceIdArgumentResolver = new InstanceIdArgumentResolver();
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: InstanceIdArgumentResolver = new InstanceIdArgumentResolver();
	const id: string = specimen.resolve(wkModule);
	expect(id).not.toBeNull();
	expect(id).toEqual("0-0-0");
});
