import OtherVisitor from "component/visitor/OtherVisitor";
import ServicesImpl from "service/ServicesImpl";

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor(new ServicesImpl());
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
