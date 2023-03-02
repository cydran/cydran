import ScriptVisitor from "component/visitor/ScriptVisitor";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new ScriptVisitor();
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
