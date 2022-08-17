import OtherVisitor from "component/visitor/OtherVisitor";
import DomImpl from "dom/DomImpl";
import InstanceServicesImpl from "context/InstanceServicesImpl";

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor(new InstanceServicesImpl(new DomImpl()));
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
