import ScriptVisitor from "component/visitor/ScriptVisitor";
import ServicesImpl from "service/ServicesImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new ScriptVisitor(new ServicesImpl());
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
