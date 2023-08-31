import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import PropertyArgumentResolver from "argument/resolver/PropertyArgumentResolver";
import Context from "context/Context";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import RootContextImpl from 'context/RootContextImpl';

const propertyName: string = "cydran.test.xyz";
let props: Properties;

let wkContext: Context;

const ABC_NAME_KEY = "cydran.test.abc";
const ABC_NAME_VAL = "ABC";
const XYZ_NAME_KEY = "cydran.test.xyz";
const XYZ_NAME_VAL = "XYZ";

function initProperties(): void {
	const wkProps: any = {
		[ABC_NAME_KEY]: ABC_NAME_VAL,
		[XYZ_NAME_KEY]: XYZ_NAME_VAL
	};
	const retval: Properties = new PropertiesImpl();
	retval.load(wkProps);
	return retval;
}

beforeAll(() => {
	props = initProperties();
	const mockMod: RootContextImpl = mock(RootContextImpl);
	when(mockMod.getProperties()).thenReturn(props);
	wkContext = instance(mockMod);
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
	expect(spec1.resolve(wkContext)).toEqual(ABC_NAME_VAL);

	const spec2: PropertyArgumentResolver = new PropertyArgumentResolver(XYZ_NAME_KEY);
	expect(spec2.resolve(wkContext)).toEqual(XYZ_NAME_VAL);
});

test("resolve unknown item", () => {
	const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("bubba");
	expect(specimen.resolve(wkContext)).toBe(null);
});

test("postProcess()", () => {
  const wkSpy: PropertyArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});

