import { mock, instance, when } from "ts-mockito";
import ScopeItemArgumentResolver from "argument/ScopeItemArgumentResolver";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import ScopeImpl from "scope/ScopeImpl";

const specimenName: string = "XYZ";

let wkModule: Module;
let scope: ScopeImpl;
let specimen: ScopeItemArgumentResolver;

function initScopeItems(): void {
	const retval: ScopeImpl = new ScopeImpl();
	retval.add("name", specimenName);
	return retval;
}

afterEach(() => {
	specimen = null;
});

beforeAll(() => {
	scope = initScopeItems();

	const mockMod: ModuleImpl = mock(ModuleImpl);
	when(mockMod.getScope()).thenReturn(scope);
	wkModule = instance(mockMod);
});

test(`specimen is whole`, () => {
	specimen = new ScopeItemArgumentResolver("name");
	expect(specimen).not.toBe(null);
});

test(`resolve item`, () => {
	specimen = new ScopeItemArgumentResolver("name");
	expect(specimen.resolve(wkModule)).toEqual(specimenName);
});

test(`resolve unkown item`, () => {
	specimen = new ScopeItemArgumentResolver("bubba");
	expect(specimen.resolve(wkModule)).toBe(null);
});
