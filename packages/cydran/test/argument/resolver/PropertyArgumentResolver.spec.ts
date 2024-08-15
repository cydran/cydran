import PropertyArgumentResolver from "argument/resolver/PropertyArgumentResolver";
import Context from "context/Context";
import { Properties } from 'properties/Property';
import Registry from 'registry/Registry';
import GlobalContextImpl from 'context/GlobalContextImpl';

const propertyName: string = "cydran.test.xyz";

let props: Properties = null;
let wkContext: Context = null;
let registry: Registry = null;

const ABC_NAME_KEY = "cydran.test.abc";
const ABC_NAME_VAL = "ABC";
const XYZ_NAME_KEY = "cydran.test.xyz";
const XYZ_NAME_VAL = "XYZ";

const wkProps: any = {
	[ABC_NAME_KEY]: ABC_NAME_VAL,
	[XYZ_NAME_KEY]: XYZ_NAME_VAL
};

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
	wkContext.getProperties().load(wkProps);
});

let specimen: PropertyArgumentResolver;
beforeEach(() => {
	specimen = new PropertyArgumentResolver("whatever");
});

afterEach(() => {
	specimen = null;
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const spec1: PropertyArgumentResolver = new PropertyArgumentResolver(ABC_NAME_KEY);
	expect(spec1.resolve(wkContext, props, registry)).toEqual(ABC_NAME_VAL);

	const spec2: PropertyArgumentResolver = new PropertyArgumentResolver(XYZ_NAME_KEY);
	expect(spec2.resolve(wkContext, props, registry)).toEqual(XYZ_NAME_VAL);
});

test("resolve unknown item", () => {
	const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("bubba");
	expect(specimen.resolve(wkContext, props, registry)).toBe(null);
});

test("postProcess()", () => {
  const wkSpy: PropertyArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, props, registry, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, props, registry, arg2, arg3);
});

