import { beforeAll, afterAll, beforeEach, afterEach, test, expect } from "@jest/globals";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import Evaluator from 'eval/Evaluator';

interface Model {

	value: boolean;

}

let properties: Properties = null;

const expression: string = "m().value || v().value || s().scopeValue()" as const;
let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;
let scopeValue: boolean = false;

beforeAll(() => {
	properties = new PropertiesAlternativeImpl();
	properties.load(PROPS);
	LoggerFactory.init(properties);
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

	specimen = new Evaluator(expression, scope, LoggerFactory.getLogger(`Getter: ${expression}`));
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
