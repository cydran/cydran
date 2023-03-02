import { mock, spy, verify } from "ts-mockito";
import ScopeImpl from 'scope/ScopeImpl';

import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import IndexedEvaluator from 'eval/IndexedEvaluator';
import { asString } from 'util/AsFunctions';

interface Model {

	value: string;

}

let wkProps: Properties = null;

const expression: string = "v().value + $index + p(0) + s().scopeValue()" as const;
let scope: ScopeImpl = null;
let modelInstance: Model = null;
let valueInstance: any = null;

beforeAll(() => {
	wkProps = new PropertiesImpl();
	wkProps.load(PROPS);
	LoggerFactory.init(wkProps);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
	scope.add("scopeValue", () => "Gamma");
});

afterAll(() => {
	wkProps = null;
});

let specimen: IndexedEvaluator = null;

beforeEach(() => {
	modelInstance = {
		value: "foo"
	};

	valueInstance = {};

	specimen = new IndexedEvaluator(expression, scope, asString, LoggerFactory.getLogger(`Getter: ${expression}`));
});

afterEach(() => {
	modelInstance = null;
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
