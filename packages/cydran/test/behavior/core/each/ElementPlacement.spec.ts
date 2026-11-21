/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { assertNullGuarded } from "test/TestUtils";
import ElementPlacement from "behavior/core/each/ElementPlacement";
import ElementPopulator from "behavior/core/each/ElementPopulator";
import FragmentPopulator from "behavior/core/each/FragmentPopulator";
import { afterEach, describe, expect, test } from "@jest/globals";

function createElement(html: string): HTMLElement {
	const holder: HTMLElement = document.createElement("div");
	holder.innerHTML = html;

	return holder.firstElementChild as HTMLElement;
}

function childNames(element: HTMLElement): string[] {
	return Array.from(element.children).map((child: Element) => child.getAttribute("name"));
}

describe("ElementPlacement", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	test("constructor - null element", () => {
		assertNullGuarded("element", () => new ElementPlacement(null as unknown as HTMLElement));
	});

	test("clear() - removes every child", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li>text<!-- c --><li name="b"></li></ul>');

		new ElementPlacement(element).clear();

		expect(element.childNodes.length).toEqual(0);
	});

	test("append() - adds at the end", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li></ul>');

		new ElementPlacement(element).append(createElement('<li name="b"></li>'));

		expect(childNames(element)).toEqual(["a", "b"]);
	});

	test("append() - null node", () => {
		assertNullGuarded("node", () => new ElementPlacement(createElement("<ul></ul>")).append(null as unknown as Node));
	});

	test("insertBefore() - inserts before the reference", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li><li name="c"></li></ul>');

		new ElementPlacement(element).insertBefore(createElement('<li name="b"></li>'), element.children[1]);

		expect(childNames(element)).toEqual(["a", "b", "c"]);
	});

	test("insertBefore() - null reference appends", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li></ul>');

		new ElementPlacement(element).insertBefore(createElement('<li name="b"></li>'), null as unknown as Node);

		expect(childNames(element)).toEqual(["a", "b"]);
	});

	test("insertBefore() - null node", () => {
		assertNullGuarded("node", () =>
			new ElementPlacement(createElement("<ul></ul>")).insertBefore(null as unknown as Node, null as unknown as Node));
	});

	test("remove() - removes the node", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li><li name="b"></li></ul>');

		new ElementPlacement(element).remove(element.children[0]);

		expect(childNames(element)).toEqual(["b"]);
	});

	test("remove() - null node", () => {
		assertNullGuarded("node", () => new ElementPlacement(createElement("<ul></ul>")).remove(null as unknown as Node));
	});

	test("createPopulator() - a select gets an element populator that inserts immediately", () => {
		const element: HTMLElement = createElement("<select></select>");
		const populator = new ElementPlacement(element).createPopulator();

		populator.appendChild(createElement('<option name="a"></option>'));

		expect(populator).toBeInstanceOf(ElementPopulator);
		expect(childNames(element)).toEqual(["a"]);
	});

	test("createPopulator() - other elements get a fragment populator that inserts on populate", () => {
		const element: HTMLElement = createElement('<ul><li name="a"></li></ul>');
		const populator = new ElementPlacement(element).createPopulator();

		populator.appendChild(createElement('<li name="b"></li>'));
		populator.appendChild(createElement('<li name="c"></li>'));

		expect(populator).toBeInstanceOf(FragmentPopulator);
		expect(childNames(element)).toEqual(["a"]);

		populator.populate();

		expect(childNames(element)).toEqual(["a", "b", "c"]);
	});

	test("isFocused() - true when the active element is inside", () => {
		const element: HTMLElement = createElement('<div><input name="a"></div>');
		document.body.appendChild(element);
		(element.firstElementChild as HTMLInputElement).focus();

		expect(new ElementPlacement(element).isFocused()).toBe(true);
	});

	test("isFocused() - false when the active element is outside", () => {
		const element: HTMLElement = createElement('<div><input name="a"></div>');
		const outside: HTMLInputElement = document.createElement("input");
		document.body.appendChild(element);
		document.body.appendChild(outside);
		outside.focus();

		expect(new ElementPlacement(element).isFocused()).toBe(false);
	});
});
