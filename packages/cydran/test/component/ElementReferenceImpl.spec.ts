import ElementReferenceImpl from 'component/ElementReferenceImpl';
import DomUtils from 'dom/DomUtils';

let elRef: ElementReferenceImpl = null;
const CTXT: string = "some comment here";
const RDM_TXT: string ="random string";
const putChild: HTMLElement = DomUtils.createElement("p");
putChild.appendChild(DomUtils.createTextNode(RDM_TXT));

beforeEach(() => {
	const root: HTMLElement = DomUtils.createElement("div");
	const child: HTMLElement = DomUtils.createElement("span");
	root.appendChild(child);
	elRef = new ElementReferenceImpl(child, CTXT);
});

afterEach(() => {
	elRef = null;
});

test("new ElementReferenceImpl - not null", () => {
	expect(elRef).not.toBeNull();
});
test("set/get", () => {
	const spyErI: ElementReferenceImpl = jest.spyOn(elRef, 'set');
	expect(elRef.get()).toBeNull();
	elRef.set(putChild);
	const result: HTMLElement = elRef.get();
	expect(result.nodeType).toEqual(Node.ELEMENT_NODE);
	expect(result.firstChild?.textContent).toEqual(RDM_TXT);
});