import RegionVisitor from "component/visitor/RegionVisitor";
import ServicesImpl from "service/ServicesImpl";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new RegionVisitor(new ServicesImpl());
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
