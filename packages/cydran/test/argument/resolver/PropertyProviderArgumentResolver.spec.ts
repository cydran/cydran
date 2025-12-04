import PropertyProviderArgumentResolver from "argument/resolver/PropertyProviderArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";
import { beforeAll, describe, expect, test } from '@jest/globals';
import { Context } from 'context/Context';
import { PropertyKeys } from 'CydranConstants';

let wkContext: Context;

describe("PropertyProviderArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
		expect(specimen).not.toBeNull();
	});

	test("resolve", () => {
		const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
		expect(specimen.resolve(wkContext)()).toEqual("debug");
	});

});
