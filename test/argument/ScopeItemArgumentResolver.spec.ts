import { mock, instance, when } from "ts-mockito";
import ScopeItemArgumentResolver from "argument/ScopeItemArgumentResolver";
import Context from "context/Context";
import ScopeImpl from "scope/ScopeImpl";
import RootContextImpl from 'context/RootContextImpl';

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

	const mockMod: RootContextImpl = mock(RootContextImpl);
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
