import PropertyArgumentResolver from "argument/resolver/PropertyArgumentResolver";
import { Context } from "context/Context";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { describe, expect, test, beforeAll, beforeEach, afterEach } from '@jest/globals';

const propertyName: string = "cydran.test.xyz";

let wkContext: Context = null;

const ABC_NAME_KEY = "cydran.test.abc";
const ABC_NAME_VAL = "ABC";
const XYZ_NAME_KEY = "cydran.test.xyz";
const XYZ_NAME_VAL = "XYZ";

const wkProps: any = {
	[ABC_NAME_KEY]: ABC_NAME_VAL,
	[XYZ_NAME_KEY]: XYZ_NAME_VAL
};

describe("PropertyArgumentResolver", () => {

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
		expect(spec1.resolve(wkContext)).toEqual(ABC_NAME_VAL);

		const spec2: PropertyArgumentResolver = new PropertyArgumentResolver(XYZ_NAME_KEY);
		expect(spec2.resolve(wkContext)).toEqual(XYZ_NAME_VAL);
	});

	test("resolve unknown item", () => {
		const specimen: PropertyArgumentResolver = new PropertyArgumentResolver("bubba");
		expect(specimen.resolve(wkContext)).toBe(null);
	});

});
