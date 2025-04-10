import InstanceIdArgumentResolver from "argument/resolver/InstanceIdArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { Context } from 'context/Context';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const context: Context = new GlobalContextImpl().createChild();
let specimen: InstanceIdArgumentResolver;

describe("InstanceIdArgumentResolver", () => {

	beforeEach(() => {
		specimen = new InstanceIdArgumentResolver();
	});

	afterEach(() => {
		specimen = null;
	});

	test("specimen is whole", () => {
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const id: string = specimen.resolve(context);
		expect(id).not.toBeNull();
		expect(id).toEqual("0-0-0");
	});

});
