import ScopeItemArgumentResolver from "argument/resolver/ScopeItemArgumentResolver";
import Context from "context/Context";
import GlobalContextImpl from 'context/GlobalContextImpl';

const specimenName: string = "XYZ";

let wkContext: Context;
let specimen: ScopeItemArgumentResolver;

beforeEach(() => {
	specimen = new ScopeItemArgumentResolver("name");
});

afterEach(() => {
	specimen = null;
});

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
	wkContext.getScope().add("name", specimenName);
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
