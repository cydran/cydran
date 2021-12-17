import DomImpl from "dom/DomImpl";

let dom: DomImpl = null;

beforeEach(() => {
	dom = new DomImpl();
});

afterEach(() => {
	dom = null;
});

test("instantiation of dom", () => {
	expect(dom).not.toBe(null);
});

test("createComment", () => {
	const commentText: string = "Yay! It's over!";
	const result: Comment = dom.createComment(commentText);
	expect(result).not.toBe(null);
	expect(result.textContent).toEqual(commentText);
});

test("createDocumentFragment", () => {
	const wkSpy: DomImpl = jest.spyOn(dom, 'createDocumentFragment');
	const result: DocumentFragment = dom.createDocumentFragment();
	expect(result).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("createTextNode", () => {
	const wkSpy: DomImpl = jest.spyOn(dom, 'createTextNode');
	const commentText: string = "Yay! It's over!";
	const result: Text = dom.createTextNode(commentText);
	expect(result).not.toBe(null);
	expect(result.textContent).toEqual(commentText);
	expect(wkSpy).toBeCalledTimes(1);
});

test("onReady", () => {
	const wkSpy: DomImpl = jest.spyOn(dom, 'onReady');
	const shout: string = "Booyah!";
	const wkFn: Function = () => shout;
	dom.onReady(wkFn);
	expect(wkSpy).toBeCalledTimes(1);
});

test("onReady - throw TypeError", () => {
	const shout: string = "Booyah!";
	expect(() => {dom.onReady(shout)}).toThrowError(TypeError);
});
