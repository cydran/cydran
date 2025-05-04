import { beforeEach, beforeAll, describe, test, expect, afterEach, jest } from "@jest/globals";
import { Context } from "context/Context";
import ObjectArgumentResolver from "argument/resolver/ObjectArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import SimpleMap from 'interface/SimpleMap';

const idKey: string = "cydranProps";
let props: SimpleMap<unknown>;
let wkContext: Context;

const ABC_NAME_KEY = "cydran.test.abc";
const ABC_NAME_VAL = "ABC";
const XYZ_NAME_KEY = "cydran.test.xyz";
const XYZ_NAME_VAL = "XYZ";

function initProperties(): SimpleMap<string> {
	return {
		[ABC_NAME_KEY]: ABC_NAME_VAL,
		[XYZ_NAME_KEY]: XYZ_NAME_VAL
	};
}

let specimen: ObjectArgumentResolver;

describe("ObjectArgumentResolver", () => {

	beforeEach(() => {
		specimen = new ObjectArgumentResolver("whatever", []);
	});

	afterEach(() => {
		specimen = null;
	});

	beforeAll(() => {
		props = initProperties();
		wkContext = new GlobalContextImpl().createChild();
		wkContext.registerConstant(idKey, props);
		wkContext.getProperties().load(props);
	});

	test("specimen is whole", () => {
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		specimen = new ObjectArgumentResolver(idKey, []);
		expect(specimen.resolve(wkContext)).toEqual(props);
	});

	test("resolve unknown item", () => {
		specimen = new ObjectArgumentResolver("bubba", []);
		expect(specimen.resolve(wkContext)).toBe(null);
	});

});
