import TextVisitor from "component/visitor/TextVisitor";
import DomImpl from "dom/DomImpl";
import CydranContextImpl from "context/CydranContextImpl";

let visitor: TextVisitor = null;

beforeEach(() => {
	visitor = new TextVisitor(new CydranContextImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
