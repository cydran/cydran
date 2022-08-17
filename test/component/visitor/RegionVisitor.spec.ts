import RegionVisitor from "component/visitor/RegionVisitor";
import DomImpl from "dom/DomImpl";
import InstanceServicesImpl from "context/InstanceServicesImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new RegionVisitor(new InstanceServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
