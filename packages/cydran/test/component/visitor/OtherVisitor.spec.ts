import OtherVisitor from "component/visitor/OtherVisitor";
import GlobalContextImpl from 'context/GlobalContextImpl';

let visitor: OtherVisitor = null;

beforeEach(() => {
	visitor = new OtherVisitor(new GlobalContextImpl());
});

afterEach(() => {
	visitor = null;
});

test("instance is good", () => {
	expect(visitor).not.toBeNull();
});
