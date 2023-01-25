import TextVisitor from "component/visitor/TextVisitor";
import ServicesImpl from "service/ServicesImpl";

let visitor: TextVisitor = null;

beforeEach(() => {
	visitor = new TextVisitor(new ServicesImpl());
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
