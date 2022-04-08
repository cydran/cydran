import { mock, spy, verify } from "ts-mockito";
import ScopeImpl from 'scope/ScopeImpl';

import PROPS from "../logger/loggerTestProps.json";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import ComparisonEvaluator from 'eval/ComparisonEvaluator';

interface Model {

	value: string;

}

let factory: LoggerFactory = null;
let properties: Properties = null;

const expression: string = "a + b + p(0) + s().scopeItem" as const;
let scope: ScopeImpl = null;

beforeAll(() => {
	properties = new PropertiesImpl();
	properties.load(PROPS);
	factory = new LoggerFactoryImpl(properties);
	scope = new ScopeImpl();
	scope.add("scopeItem", 8);
});

afterAll(() => {
	properties = null;
	factory = null;
});

let specimen: ComparisonEvaluator = null;

beforeEach(() => {
	specimen = new ComparisonEvaluator(expression, scope, factory.getLogger(`Getter: ${expression}`));
});

afterEach(() => {
	specimen = null;
});

test("new ComparisonEvaluator", () => {
	expect(specimen).not.toBeNull();
});

test("test", () => {
	expect(specimen.compare(1, 2, [() => 4])).toEqual(15);
});
