import { beforeEach, beforeAll, test, expect, afterEach, jest } from "@jest/globals";
import Context from "context/Context";
import { Properties } from 'properties/Property';
import PropertiesAlternativeImpl from 'properties/PropertiesAlternativeImpl';
import ObjectArgumentResolver from "argument/resolver/ObjectArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';

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
	const retval: Properties = new PropertiesAlternativeImpl();
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
	wkContext = new GlobalContextImpl().createChild();
	wkContext.getRegistry().registerConstant(idKey, props);
	wkContext.getProperties().load(props);
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
