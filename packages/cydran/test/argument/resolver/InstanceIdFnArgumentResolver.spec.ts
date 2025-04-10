import { Context } from "context/Context";
import InstanceIdFnArgumentResolver from "argument/resolver/InstanceIdFnArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const context: Context = new GlobalContextImpl().createChild();

let specimen: InstanceIdFnArgumentResolver;

describe("InstanceIdFnArgumentResolver", () => {

	beforeEach(() => {
		specimen = new InstanceIdFnArgumentResolver();
	});

	afterEach(() => {
		specimen = null;
	});

	test("specimen is whole", () => {
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const idFn: Function = specimen.resolve(context);
		expect(idFn).not.toBeNull();
		expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
	});

});