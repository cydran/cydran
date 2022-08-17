import ScriptVisitor from "component/visitor/ScriptVisitor";
import DomImpl from "dom/DomImpl";
import InstanceServicesImpl from "context/InstanceServicesImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new ScriptVisitor(new InstanceServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
