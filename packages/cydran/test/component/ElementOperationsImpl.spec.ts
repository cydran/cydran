import ElementOperationsImpl from 'component/ElementOperationsImpl';
import DomUtils from 'dom/DomUtils';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

describe("ElementOperationsImpl", () => {

	let opps: ElementOperationsImpl<HTMLElement> = null;

	beforeEach(() => {
		const el: HTMLElement = DomUtils.createElement("div");
		opps = new ElementOperationsImpl<HTMLElement>(el);
	});

	afterEach(() => {
		opps = null;
	});

	test("new ElementOperationsImpl - not null", () => {
		expect(opps).not.toBeNull();
	});

	test("get", () => {
		const spyEoi: ElementOperationsImpl<HTMLElement> = jest.spyOn(opps, 'get') as unknown as ElementOperationsImpl<HTMLElement>;
		const result: HTMLElement = opps.get();
		expect(result).not.toBeNull();
		expect(spyEoi).toHaveBeenCalledTimes(1);
		expect(result.nodeType).toEqual(Node.ELEMENT_NODE);
		expect(result.nodeName).toEqual("DIV");
	});

	test("focus", () => {
		const spyEoi: ElementOperationsImpl<HTMLElement> = jest.spyOn(opps, 'focus') as unknown as ElementOperationsImpl<HTMLElement>;
		opps.focus()
		expect(spyEoi).toHaveBeenCalledTimes(1);
	});

	test("blur", () => {
		const spyEoi: ElementOperationsImpl<HTMLElement> = jest.spyOn(opps, 'blur') as unknown as ElementOperationsImpl<HTMLElement>;
		opps.blur()
		expect(spyEoi).toHaveBeenCalledTimes(1);
	});

});
