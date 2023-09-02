import ScopeImpl from 'scope/ScopeImpl';

import LoggerFactory from "log/LoggerFactory";
import ComparisonEvaluator from 'eval/ComparisonEvaluator';

interface Model {
	value: string;
}

const expression: string = "a + b + p(0) + s().scopeItem" as const;
let scope: ScopeImpl = null;

beforeAll(() => {
	scope = new ScopeImpl();
	scope.add("scopeItem", 8);
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
