import { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } from "@jest/globals";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import Evaluator from 'eval/Evaluator';
import getLogger from 'log/getLogger';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

interface Model {

	value: boolean;

}

let properties: MutableProperties = null;

const expression: string = "m().value || v().value || s().scopeValue()" as const;
let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;
let scopeValue: boolean = false;

describe("Evaluator", () => {

	beforeAll(() => {
		properties = new PropertiesImpl();
		properties.load(PROPS);
		scope = new ScopeImpl();
		scope.setMFn(() => modelInstance);
		scope.setVFn(() => valueInstance);
		scope.add("scopeValue", () => scopeValue);
	});

	afterAll(() => {
		properties = null;
	});

	let specimen: Evaluator = null;

	beforeEach(() => {
		modelInstance = {
			value: false
		};

		valueInstance = {
			value: false
		};

		specimen = new Evaluator(expression, scope);
	});

	afterEach(() => {
		modelInstance = null as unknown as Model;
		valueInstance = null as unknown as Model;
		specimen = null;
	});

	test("new Evaluator", () => {
		expect(specimen).not.toBeNull();
	});

	test("test()", () => {
		expect(specimen.test()).toEqual(false);

		modelInstance.value = false;
		valueInstance.value = false;
		scopeValue = true;
		expect(specimen.test()).toEqual(true);

		modelInstance.value = false;
		valueInstance.value = true;
		scopeValue = false;
		expect(specimen.test()).toEqual(true);

		modelInstance.value = true;
		valueInstance.value = false;
		scopeValue = false;
		expect(specimen.test()).toEqual(true);
	});

});
