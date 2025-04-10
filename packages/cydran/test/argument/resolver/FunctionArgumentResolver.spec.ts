import { Context } from "context/Context";
import FunctionArgumentResolver from "argument/resolver/FunctionArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { beforeAll, describe, expect, test } from '@jest/globals';

const whatEvFn = (): string => { return "whatever"; };
let wkContext: Context;

describe("FunctionArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(whatEvFn);
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(() => 2 * 2);
		expect(specimen.resolve(wkContext)).toEqual(4);
	});

});
