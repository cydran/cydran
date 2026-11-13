/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import DomUtils from "dom/DomUtils";
import { describe, expect, jest, test } from '@jest/globals';

describe("DomUtils", () => {

	test("avaiable to use", () => {
		expect(DomUtils).not.toBeNull;
	});

	test("getDocument", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'getDocument');
		const doc: Document = DomUtils.getDocument();
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(doc).not.toBeNull();
		expect(doc).toBeInstanceOf(Document);
	});

	test("createElement", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'createElement');
		const spec: HTMLDivElement = DomUtils.createElement("div");
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(spec).not.toBeNull();
		expect(spec).toBeInstanceOf(HTMLDivElement);
	});

	test("createComment", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'createComment');
		const spec: Comment = DomUtils.createComment("something here");
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(spec).not.toBeNull();
		expect(spec).toBeInstanceOf(Comment);
	});

	test("createDocumentFragment", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'createDocumentFragment');
		const spec: DocumentFragment = DomUtils.createDocumentFragment();
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(spec).not.toBeNull();
		expect(spec).toBeInstanceOf(DocumentFragment);
	});

	test("createTextNode", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'createTextNode');
		const wkTxt: string = "whackadoodle";
		const spec: Text = DomUtils.createTextNode(wkTxt);
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(spec).not.toBeNull();
		expect(spec).toBeInstanceOf(Text);
		expect(spec.wholeText).toBe(wkTxt);
	});

	test("elementIsFocused", () => {
		const dSpy: DomUtils = jest.spyOn(DomUtils, 'elementIsFocused');
		let result: boolean = DomUtils.elementIsFocused(DomUtils.createElement("div"));
		expect(dSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual(false);

		const input: HTMLInputElement = DomUtils.createElement("input");
		input.setAttribute("name", "caller");
		input.focus();
		expect(DomUtils.elementIsFocused(input)).toBe(false);
	});

});