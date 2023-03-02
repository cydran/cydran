import RegionVisitor from "component/visitor/RegionVisitor";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new RegionVisitor();
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
