import { mock, instance, when } from "ts-mockito";
import ScopeItemArgumentResolver from "argument/ScopeItemArgumentResolver";
import Context from "context/Context";
import ContextImpl from "context/ContextImpl";
import ScopeImpl from "scope/ScopeImpl";

const specimenName: string = "XYZ";

let wkContext: Context;
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

	const mockMod: ContextImpl = mock(ContextImpl);
	when(mockMod.getScope()).thenReturn(scope);
	wkContext = instance(mockMod);
});

test(`specimen is whole`, () => {
	specimen = new ScopeItemArgumentResolver("name");
	expect(specimen).not.toBeNull();
});

test(`resolve item`, () => {
	specimen = new ScopeItemArgumentResolver("name");
	expect(specimen.resolve(wkContext)).toEqual(specimenName);
});

test(`resolve unknown item`, () => {
	specimen = new ScopeItemArgumentResolver("bubba");
	expect(specimen.resolve(wkContext)).toBe(null);
});
