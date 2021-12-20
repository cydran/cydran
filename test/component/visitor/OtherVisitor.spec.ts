import OtherVisitor from "component/visitor/OtherVisitor";
import DomImpl from "dom/DomImpl";
import CydranContextImpl from "context/CydranContextImpl";

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor(new CydranContextImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBe(null);
});
