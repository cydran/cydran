import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";
import { IllegalArgumentError } from "error/Errors";

let wkModule: Module;
let specimen: InstanceIdArgumentResolver;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

beforeEach(() => {
	specimen = new InstanceIdArgumentResolver();
});

afterEach(() => {
	specimen = null;
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const id: string = specimen.resolve(wkModule);
	expect(id).not.toBeNull();
	expect(id).toEqual("0-0-0");
});

test("resolve item as array", () => {
	const wkCount: number = 10;
	specimen = new InstanceIdArgumentResolver(wkCount);
	const ids: string[] = specimen.resolve(wkModule);
	console.table(ids);
	expect(ids.length).toEqual(wkCount);
});
