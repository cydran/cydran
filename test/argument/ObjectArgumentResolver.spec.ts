import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ObjectArgumentResolver from "argument/ObjectArgumentResolver";

const idKey: string = "cydran_props";
let props: Properties;

let wkModule: Module;

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
	const mockMod: ModuleImpl = mock(ModuleImpl);
	when(mockMod.get(idKey)).thenReturn(props);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: ObjectArgumentResolver = new ObjectArgumentResolver("whatever");
	expect(specimen).not.toBe(null);
});

test("resolve item", () => {
	const spec1: ObjectArgumentResolver = new ObjectArgumentResolver(idKey);
	expect(spec1.resolve(wkModule)).toEqual(props);
});

test("resolve unknown item", () => {
	const specimen: ObjectArgumentResolver = new ObjectArgumentResolver("bubba");
	expect(specimen.resolve(wkModule)).toBe(null);
});
