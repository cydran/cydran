import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Context from "context/Context";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ObjectArgumentResolver from "argument/resolver/ObjectArgumentResolver";
import RootContextImpl from 'context/RootContextImpl';

const idKey: string = "cydran_props";
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

let specimen: ObjectArgumentResolver;

beforeEach(() => {
	specimen = new ObjectArgumentResolver("whatever");
});

afterEach(() => {
	specimen = null;
});

beforeAll(() => {
	props = initProperties();
	const mockMod: RootContextImpl = mock(RootContextImpl);
	when(mockMod.getObject(idKey)).thenReturn(props);
	wkContext = instance(mockMod);
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
specimen = new ObjectArgumentResolver(idKey);
	expect(specimen.resolve(wkContext)).toEqual(props);
});

test("resolve unknown item", () => {
	specimen = new ObjectArgumentResolver("bubba");
	expect(specimen.resolve(wkContext)).toBe(null);
});

test("postProcess()", () => {
  const wkSpy: ObjectArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});
