import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import PropertyArgumentResolver from "argument/PropertyArgumentResolver";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import { Properties } from 'properties/Property';
import PropertiesImpl from 'properties/PropertiesImpl';

const propertyName: string = "cydran.test.xyz";
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
	when(mockMod.getProperties()).thenReturn(props);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("whatever");
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const spec1: PropertyArgumentResolver = new PropertyArgumentResolver(ABC_NAME_KEY);
	expect(spec1.resolve(wkModule)).toEqual(ABC_NAME_VAL);

	const spec2: PropertyArgumentResolver = new PropertyArgumentResolver(XYZ_NAME_KEY);
	expect(spec2.resolve(wkModule)).toEqual(XYZ_NAME_VAL);
});

test("resolve unknown item", () => {
	const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("bubba");
	expect(specimen.resolve(wkModule)).toBe(null);
});
