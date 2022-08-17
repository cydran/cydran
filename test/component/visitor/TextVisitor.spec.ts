import TextVisitor from "component/visitor/TextVisitor";
import DomImpl from "dom/DomImpl";
import InstanceServicesImpl from "context/InstanceServicesImpl";

let visitor: TextVisitor = null;

beforeEach(() => {
	visitor = new TextVisitor(new InstanceServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
