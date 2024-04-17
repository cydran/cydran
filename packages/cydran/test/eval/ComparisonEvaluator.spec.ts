import { test, expect, beforeAll, afterAll, beforeEach, afterEach} from "@jest/globals";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import ComparisonEvaluator from 'eval/ComparisonEvaluator';

interface Model {

	value: string;

}

let properties: Properties = null;

const expression: string = "a + b + p(0) + s().scopeItem" as const;
let scope: ScopeImpl = null;

beforeAll(() => {
	properties = new PropertiesAlternativeImpl();
	properties.load(PROPS);
	LoggerFactory.init(properties);
	scope = new ScopeImpl();
	scope.add("scopeItem", 8);
});

afterAll(() => {
	properties = null;
});

let specimen: ComparisonEvaluator = null;

beforeEach(() => {
	specimen = new ComparisonEvaluator(expression, scope, LoggerFactory.getLogger(`Getter: ${expression}`));
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
