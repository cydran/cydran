import { Context } from "context/Context";
import ContextArgumentResolver from "argument/resolver/ContextArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";
import { beforeAll, describe, expect, test } from '@jest/globals';

let wkContext: Context;

describe("ContextArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: ContextArgumentResolver = new ContextArgumentResolver();
		expect(specimen).not.toBeNull();
	});

	test("resolve", () => {
		const specimen: ContextArgumentResolver = new ContextArgumentResolver();
		expect(specimen.resolve(wkContext)).toEqual(wkContext);
	});

});
