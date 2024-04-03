import ElementOperationsImpl from 'component/ElementOperationsImpl';
import DomUtils from 'dom/DomUtils';

let opps: ElementOperationsImpl = null;
beforeEach(() => {
	const el: HTMLElement = DomUtils.createElement("div");
	opps = new ElementOperationsImpl(el);
});

afterEach(() => {
	opps = null;
});

test("new ElementOperationsImpl - not null", () => {
	expect(opps).not.toBeNull();
});

test("get", () => {
	const spyEoi: ElementOperationsImpl = jest.spyOn(opps, 'get');
	const result: HTMLElement = opps.get();
	expect(result).not.toBeNull();
	expect(spyEoi).toHaveBeenCalledTimes(1);
	expect(result.nodeType).toEqual(Node.ELEMENT_NODE);
	expect(result.nodeName).toEqual("DIV");
});

test("focus", () => {
	const spyEoi: ElementOperationsImpl = jest.spyOn(opps, 'focus');
	opps.focus()
	expect(spyEoi).toHaveBeenCalledTimes(1);
});

test("blur", () => {
	const spyEoi: ElementOperationsImpl = jest.spyOn(opps, 'blur');
	opps.blur()
	expect(spyEoi).toHaveBeenCalledTimes(1);
});