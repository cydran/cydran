import { test, expect, beforeAll, afterAll, beforeEach, afterEach, describe } from "@jest/globals";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import IndexedEvaluator from 'eval/IndexedEvaluator';
import { asString } from 'util/AsFunctions';
import getLogger from 'log/getLogger';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

interface Model {

	value: string;

}

let wkProps: MutableProperties = null;

const expression: string = "v().value + $index + p(0) + s().scopeValue()" as const;
let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: any = null as unknown as any;

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

describe("IndexedEvaluator", () => {

	beforeAll(() => {
		wkProps = new PropertiesImpl();
		wkProps.load(PROPS);
		scope = new ScopeImpl();
		scope.setMFn(() => modelInstance);
		scope.setVFn(() => valueInstance);
		scope.add("scopeValue", () => "Gamma");
	});

	afterAll(() => {
		wkProps = null;
	});

	let specimen: IndexedEvaluator<Object> = null;

	beforeEach(() => {
		modelInstance = {
			value: "foo"
		};

		valueInstance = {};

		specimen = new IndexedEvaluator(expression, scope, asString, getLogger('test-logger', `Getter: ${expression}`));
	});

	afterEach(() => {
		modelInstance = null as unknown as Model;
		valueInstance = null;
		specimen = null;
	});

	test("new IndexedEvaluator", () => {
		expect(specimen).not.toBeNull();
	});

	test("test", () => {
		expect(specimen.test(modelInstance, 0, [() => "Alpha"])).toEqual("foo0AlphaGamma");
		modelInstance.value = "bar";
		expect(specimen.test(modelInstance, 1, [() => "Beta"])).toEqual("bar1BetaGamma");
	});

});
