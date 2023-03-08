import TextVisitor from "component/visitor/TextVisitor";

let visitor: TextVisitor = null;

beforeEach(() => {
	visitor = new TextVisitor();
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
