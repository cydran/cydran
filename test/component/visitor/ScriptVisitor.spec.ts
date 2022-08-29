import ScriptVisitor from "component/visitor/ScriptVisitor";
import DomImpl from "dom/DomImpl";
import ServicesImpl from "service/ServicesImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new ScriptVisitor(new ServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
