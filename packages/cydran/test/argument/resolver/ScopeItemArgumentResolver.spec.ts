import ScopeItemArgumentResolver from "argument/resolver/ScopeItemArgumentResolver";
import { Context } from "context/Context";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { describe, beforeEach, afterEach, beforeAll, test, expect } from '@jest/globals';

const specimenName: string = "XYZ";

let wkContext: Context;
let specimen: ScopeItemArgumentResolver;

describe("ScopeItemArgumentResolver", () => {

	beforeEach(() => {
		specimen = new ScopeItemArgumentResolver("name");
	});

	afterEach(() => {
		specimen = null;
	});

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
		wkContext.getScope().add("name", specimenName);
	});

	test(`specimen is whole`, () => {
		expect(specimen).not.toBeNull();
	});

	test(`resolve item`, () => {
		expect(specimen.resolve(wkContext)).toEqual(specimenName);
	});

	test(`resolve unknown item`, () => {
		specimen = new ScopeItemArgumentResolver("bubba");
		expect(specimen.resolve(wkContext)).toBe(null);
	});

});
