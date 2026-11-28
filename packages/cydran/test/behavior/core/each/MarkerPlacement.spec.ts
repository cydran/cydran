/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { assertNullGuarded } from "test/TestUtils";
import MarkerPlacement from "behavior/core/each/MarkerPlacement";
import ElementPopulator from "behavior/core/each/ElementPopulator";
import FragmentPopulator from "behavior/core/each/FragmentPopulator";
import { afterEach, describe, expect, test } from "@jest/globals";

interface Fixture {

	parent: HTMLElement;

	specimen: MarkerPlacement;

}

function createElement(html: string): HTMLElement {
	const holder: HTMLElement = document.createElement("div");
	holder.innerHTML = html;

	return holder.firstElementChild as HTMLElement;
}

/**
 * Creates a parent holding: before, top marker, the given items, bottom marker, after.
 */
function createFixture(tag: string, itemNames: string[]): Fixture {
	const child: string = tag === "select" ? "option" : "li";
	const parent: HTMLElement = document.createElement(tag);
	const top: Comment = document.createComment("ES");
	const bottom: Comment = document.createComment("EE");
	parent.appendChild(createElement(`<${child} name="before"></${child}>`));
	parent.appendChild(top);

	for (const name of itemNames) {
		parent.appendChild(createElement(`<${child} name="${name}"></${child}>`));
	}

	parent.appendChild(bottom);
	parent.appendChild(createElement(`<${child} name="after"></${child}>`));

	return { parent: parent, specimen: new MarkerPlacement(top, bottom) };
}

function childNames(element: HTMLElement): string[] {
	return Array.from(element.children).map((child: Element) => child.getAttribute("name"));
}

describe("MarkerPlacement", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	test("constructor - null top", () => {
		assertNullGuarded("top", () => new MarkerPlacement(null as unknown as Comment, document.createComment("EE")));
	});

	test("constructor - null bottom", () => {
		assertNullGuarded("bottom", () => new MarkerPlacement(document.createComment("ES"), null as unknown as Comment));
	});

	test("clear() - removes only the nodes between the markers", () => {
		const { parent, specimen } = createFixture("ul", ["a", "b"]);
		parent.insertBefore(document.createTextNode("text"), parent.childNodes[2]);

		specimen.clear();

		expect(childNames(parent)).toEqual(["before", "after"]);
		expect(parent.childNodes.length).toEqual(4);
	});

	test("clear() - nothing between the markers", () => {
		const { parent, specimen } = createFixture("ul", []);

		specimen.clear();

		expect(childNames(parent)).toEqual(["before", "after"]);
	});

	test("append() - adds before the bottom marker", () => {
		const { parent, specimen } = createFixture("ul", ["a"]);

		specimen.append(createElement('<li name="b"></li>'));

		expect(childNames(parent)).toEqual(["before", "a", "b", "after"]);
	});

	test("append() - null node", () => {
		assertNullGuarded("node", () => createFixture("ul", []).specimen.append(null as unknown as Node));
	});

	test("insertBefore() - inserts before the reference", () => {
		const { parent, specimen } = createFixture("ul", ["a", "c"]);

		specimen.insertBefore(createElement('<li name="b"></li>'), parent.children[2]);

		expect(childNames(parent)).toEqual(["before", "a", "b", "c", "after"]);
	});

	test("insertBefore() - null reference adds before the bottom marker", () => {
		const { parent, specimen } = createFixture("ul", ["a"]);

		specimen.insertBefore(createElement('<li name="b"></li>'), null as unknown as Node);

		expect(childNames(parent)).toEqual(["before", "a", "b", "after"]);
	});

	test("insertBefore() - null node", () => {
		assertNullGuarded("node", () =>
			createFixture("ul", []).specimen.insertBefore(null as unknown as Node, null as unknown as Node));
	});

	test("remove() - removes the node", () => {
		const { parent, specimen } = createFixture("ul", ["a", "b"]);

		specimen.remove(parent.children[1]);

		expect(childNames(parent)).toEqual(["before", "b", "after"]);
	});

	test("remove() - null node", () => {
		assertNullGuarded("node", () => createFixture("ul", []).specimen.remove(null as unknown as Node));
	});

	test("createPopulator() - inside a select, an element populator inserts each node before the bottom marker", () => {
		const { parent, specimen } = createFixture("select", ["a"]);
		const populator = specimen.createPopulator();

		populator.appendChild(createElement('<option name="b"></option>'));

		expect(populator).toBeInstanceOf(ElementPopulator);
		expect(childNames(parent)).toEqual(["before", "a", "b", "after"]);
	});

	test("createPopulator() - elsewhere, a fragment populator inserts before the bottom marker on populate", () => {
		const { parent, specimen } = createFixture("ul", ["a"]);
		const populator = specimen.createPopulator();

		populator.appendChild(createElement('<li name="b"></li>'));
		populator.appendChild(createElement('<li name="c"></li>'));

		expect(populator).toBeInstanceOf(FragmentPopulator);
		expect(childNames(parent)).toEqual(["before", "a", "after"]);

		populator.populate();

		expect(childNames(parent)).toEqual(["before", "a", "b", "c", "after"]);
	});

	test("isFocused() - true when the active element is between the markers", () => {
		const { parent, specimen } = createFixture("div", []);
		const input: HTMLInputElement = document.createElement("input");
		document.body.appendChild(parent);
		specimen.append(input);
		input.focus();

		expect(specimen.isFocused()).toBe(true);
	});

	test("isFocused() - true when the active element is nested in a node between the markers", () => {
		const { parent, specimen } = createFixture("div", []);
		const holder: HTMLElement = createElement("<p><input></p>");
		document.body.appendChild(parent);
		specimen.append(holder);
		(holder.firstElementChild as HTMLInputElement).focus();

		expect(specimen.isFocused()).toBe(true);
	});

	test("isFocused() - false when the active element is a sibling outside the markers", () => {
		const { parent, specimen } = createFixture("div", []);
		const outside: HTMLInputElement = document.createElement("input");
		specimen.append(document.createElement("input"));
		parent.appendChild(outside);
		document.body.appendChild(parent);
		outside.focus();

		expect(specimen.isFocused()).toBe(false);
	});
});
