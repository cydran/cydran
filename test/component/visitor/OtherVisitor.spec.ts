import OtherVisitor from "component/visitor/OtherVisitor";
import DomImpl from "dom/DomImpl";
import ServicesImpl from "service/ServicesImpl";

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor(new ServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
