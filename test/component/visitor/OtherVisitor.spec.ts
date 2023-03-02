import OtherVisitor from "component/visitor/OtherVisitor";

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor();
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
