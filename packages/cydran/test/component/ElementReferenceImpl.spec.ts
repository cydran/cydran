import ElementReferenceImpl from 'component/ElementReferenceImpl';
import DomUtils from 'dom/DomUtils';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

let elRef: ElementReferenceImpl<HTMLElement> = null;
const CTXT: string = "some comment here";
const RDM_TXT: string = "random string";
const putChild: HTMLElement = DomUtils.createElement("p");
putChild.appendChild(DomUtils.createTextNode(RDM_TXT));

describe("ElementReferenceImpl", () => {

	beforeEach(() => {
		const root: HTMLElement = DomUtils.createElement("div");
		const child: HTMLElement = DomUtils.createElement("span");
		root.appendChild(child);
		elRef = new ElementReferenceImpl<HTMLElement>(child, CTXT);
	});

	afterEach(() => {
		elRef = null;
	});

	test("new ElementReferenceImpl - not null", () => {
		expect(elRef).not.toBeNull();
	});

	test("set/get", () => {
		const spyErI: ElementReferenceImpl<HTMLElement> = jest.spyOn(elRef, 'set') as unknown as ElementReferenceImpl<HTMLElement>;
		expect(elRef.get()).toBeNull();
		elRef.set(putChild);
		const result: HTMLElement = elRef.get();
		expect(result.nodeType).toEqual(Node.ELEMENT_NODE);
		expect(result.firstChild?.textContent).toEqual(RDM_TXT);
	});

});
