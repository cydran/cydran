import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Context from "context/Context";
import ContextImpl from "context/ContextImpl";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ObjectArgumentResolver from "argument/ObjectArgumentResolver";

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

beforeAll(() => {
	props = initProperties();
	const mockMod: ContextImpl = mock(ContextImpl);
	when(mockMod.get(idKey)).thenReturn(props);
	wkContext = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: ObjectArgumentResolver = new ObjectArgumentResolver("whatever");
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const spec1: ObjectArgumentResolver = new ObjectArgumentResolver(idKey);
	expect(spec1.resolve(wkContext)).toEqual(props);
});

test("resolve unknown item", () => {
	const specimen: ObjectArgumentResolver = new ObjectArgumentResolver("bubba");
	expect(specimen.resolve(wkContext)).toBe(null);
});
