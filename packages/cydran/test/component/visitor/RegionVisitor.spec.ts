import LegacyRegionVisitor from "component/visitor/LegacyRegionVisitor";

let visitor: ScriptVisitor = null;

beforeEach(() => {
	visitor = new LegacyRegionVisitor();
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
