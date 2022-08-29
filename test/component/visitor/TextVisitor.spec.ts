import TextVisitor from "component/visitor/TextVisitor";
import DomImpl from "dom/DomImpl";
import ServicesImpl from "service/ServicesImpl";

let visitor: TextVisitor = null;

beforeEach(() => {
	visitor = new TextVisitor(new ServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
