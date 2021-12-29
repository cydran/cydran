import ScriptVisitor from "component/visitor/ScriptVisitor";
import DomImpl from "dom/DomImpl";
import CydranContextImpl from "context/CydranContextImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new ScriptVisitor(new CydranContextImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
