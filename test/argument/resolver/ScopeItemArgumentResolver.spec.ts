import { mock, instance, when } from "ts-mockito";
import ScopeItemArgumentResolver from "argument/resolver/ScopeItemArgumentResolver";
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

beforeEach(() => {
	specimen = new ScopeItemArgumentResolver("name");
});

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
	expect(specimen).not.toBeNull();
});

test(`resolve item`, () => {
	expect(specimen.resolve(wkContext)).toEqual(specimenName);
});

test(`resolve unknown item`, () => {
	specimen = new ScopeItemArgumentResolver("bubba");
	expect(specimen.resolve(wkContext)).toBe(null);
});

test("postProcess()", () => {
  const wkSpy: ScopeItemArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});
