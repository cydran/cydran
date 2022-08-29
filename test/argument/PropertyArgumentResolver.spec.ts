import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import PropertyArgumentResolver from "argument/PropertyArgumentResolver";
import Context from "context/Context";
import ContextImpl from "context/ContextImpl";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';

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
	const mockMod: ContextImpl = mock(ContextImpl);
	when(mockMod.getProperties()).thenReturn(props);
	wkContext = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("whatever");
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
