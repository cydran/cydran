import OtherVisitor from "component/visitor/OtherVisitor";
import CydranContext from "context/CydranContext";
import DomImpl from "dom/DomImpl";
import CydranContextImpl from "context/CydranContextImpl";

let visitor: OtherVisitor = null;
let cydranContext: CydranContext = null;

function getCydranContext(): CydranContext {
	return new CydranContext();
}

beforeEach(() => {
	cydranContext = new CydranContextImpl(new DomImpl());
	visitor = new OtherVisitor(cydranContext);
});

afterEach(() => {
	visitor = null;
	cydranContext = null;
});

test("instance is good", () => {
	expect(visitor).not.toBe(null);
});
