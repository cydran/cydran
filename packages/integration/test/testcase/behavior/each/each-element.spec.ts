/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from "@jest/globals";

interface Item {

	id?: string;

	key?: string;

	sku?: string;

	name: string;

	special?: boolean;

}

const ITEM_SLOT: string = '<template c-type="item"><li data-testid="item">{{v().name}}</li></template>';

class ListComponent extends Component {

	public items: Item[];

	public others: Item[];

	public choice: string;

	public removed: Item[];

	constructor(template: string) {
		super(template);
		this.items = [
			{ sku: "a", name: "A" },
			{ sku: "b", name: "B" },
			{ sku: "c", name: "C" }
		];
		this.others = [{ sku: "x", name: "X" }];
		this.choice = "b";
		this.removed = [];
	}

	public remove(item: Item): void {
		this.removed.push(item);
		this.items = this.items.filter((candidate: Item) => candidate !== item);
	}

}

function start(template: string, strict: boolean = false): Harness<ListComponent> {
	const harness: Harness<ListComponent> = new Harness<ListComponent>(() => new ListComponent(template), {
		"cydran.strict.enabled": strict
	});
	harness.start();

	return harness;
}

function sync(harness: Harness<ListComponent>, change: (component: ListComponent) => void): void {
	change(harness.getComponent());
	harness.getComponent().$c().sync();
}

function texts(element: Element): string[] {
	return Array.from(element.children).map((child: Element) => child.textContent.trim());
}

function list(harness: Harness<ListComponent>, testId: string = "list"): HTMLElement {
	return harness.forTestId(testId).get();
}

function errorOf(activity: () => void): Error {
	let thrown: Error = null;

	try {
		activity();
	} catch (e) {
		thrown = e as Error;
	}

	return thrown;
}

describe("Behavior / Each element", () => {
	describe("rendering in place", () => {
		test("items become children of the surrounding element and no <c-each> is left", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items">${ITEM_SLOT}</c-each></ul>`
			);

			expect(texts(list(harness))).toEqual(["A", "B", "C"]);
			expect(Array.from(list(harness).children).every((child: Element) => child.tagName === "LI")).toBe(true);
			expect(harness.getDocument().querySelector("c-each")).toBeNull();
		});

		test("static siblings keep their place across add, remove and reorder", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><li>Start</li><c-each items="m().items">${ITEM_SLOT}</c-each><li>End</li></ul>`
			);

			expect(texts(list(harness))).toEqual(["Start", "A", "B", "C", "End"]);

			sync(harness, (c: ListComponent) => c.items.push({ sku: "d", name: "D" }));
			expect(texts(list(harness))).toEqual(["Start", "A", "B", "C", "D", "End"]);

			sync(harness, (c: ListComponent) => c.items.splice(0, 1));
			expect(texts(list(harness))).toEqual(["Start", "B", "C", "D", "End"]);

			sync(harness, (c: ListComponent) => c.items.reverse());
			expect(texts(list(harness))).toEqual(["Start", "D", "C", "B", "End"]);

			sync(harness, (c: ListComponent) => (c.items = []));
			expect(texts(list(harness))).toEqual(["Start", "End"]);
		});

		test("two lists in one parent render and update independently", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items">${ITEM_SLOT}</c-each><li>-</li><c-each items="m().others">${ITEM_SLOT}</c-each></ul>`
			);

			expect(texts(list(harness))).toEqual(["A", "B", "C", "-", "X"]);

			sync(harness, (c: ListComponent) => c.others.push({ sku: "y", name: "Y" }));
			expect(texts(list(harness))).toEqual(["A", "B", "C", "-", "X", "Y"]);

			sync(harness, (c: ListComponent) => c.items.pop());
			expect(texts(list(harness))).toEqual(["A", "B", "-", "X", "Y"]);
		});
	});

	describe("settings", () => {
		test("mode expression keys items by the expression", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items" mode="expression" expression="v().sku">${ITEM_SLOT}</c-each></ul>`
			);

			expect(texts(list(harness))).toEqual(["A", "B", "C"]);
			expect(harness.getComponent().items[0].id).toBeUndefined();
		});

		test("mode generated with idkey stores the generated id under that key", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items" mode="generated" idkey="key">${ITEM_SLOT}</c-each></ul>`
			);

			expect(texts(list(harness))).toEqual(["A", "B", "C"]);
			expect(harness.getComponent().items[0].key).toBeDefined();
			expect(harness.getComponent().items[0].id).toBeUndefined();
		});

		test("mode none uses the ids the items already have", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items.map((item, index) => ({ id: String(index), name: item.name }))" mode="none">${ITEM_SLOT}</c-each></ul>`
			);

			expect(texts(list(harness))).toEqual(["A", "B", "C"]);
		});

		test("defaults are mode generated with idkey id", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items">${ITEM_SLOT}</c-each></ul>`
			);

			expect(harness.getComponent().items[0].id).toBeDefined();
		});

		test("an invalid mode fails like the attribute form", () => {
			const element: Error = errorOf(() =>
				start(`<ul><c-each items="m().items" mode="sometimes">${ITEM_SLOT}</c-each></ul>`, true));
			const attribute: Error = errorOf(() => start(`<ul c-each="m().items" c-each-mode="sometimes">${ITEM_SLOT}</ul>`, true));

			expect(element).not.toBeNull();
			expect(element.name).toEqual(attribute.name);
		});

		describe.each([
			["attribute", (settings: string, content: string) => `<ul c-each="m().items" ${settings}>${content}</ul>`, "c-each-"],
			[
				"element",
				(settings: string, content: string) => `<ul><c-each items="m().items" ${settings}>${content}</c-each></ul>`,
				""
			]
		])("conditional settings (%s form)", (
			form: string,
			template: (settings: string, content: string) => string,
			prefix: string
		) => {
			const ALT_WITHOUT_TEST: string = '<template c-type="alt"><li>ALT</li></template>';
			const ITEM_WITH_TEST: string = '<template c-type="item" c-test="v().special"><li>{{v().name}}</li></template>';

			test("mode expression without an id expression is rejected", () => {
				const error: Error = errorOf(() => start(template(`${prefix}mode="expression"`, ITEM_SLOT), true));

				expect(error?.name).toEqual("ValidationError");
				expect(error.message).toContain("expression must be defined as mode equals expression");
			});

			test("an id expression with another mode is rejected", () => {
				const error: Error = errorOf(() =>
					start(template(`${prefix}mode="generated" ${prefix}expression="v().sku"`, ITEM_SLOT), true));

				expect(error?.name).toEqual("ValidationError");
				expect(error.message).toContain("expression must not be defined unless mode equals expression");
			});

			test("an alt slot without c-test is rejected", () => {
				const error: Error = errorOf(() => start(template("", ITEM_SLOT + ALT_WITHOUT_TEST), true));

				expect(error?.name).toEqual("ValidationError");
				expect(error.message).toContain("test must be defined as type equals alt");
			});

			test("c-test on a slot other than alt is rejected", () => {
				const error: Error = errorOf(() => start(template("", ITEM_WITH_TEST), true));

				expect(error?.name).toEqual("ValidationError");
				expect(error.message).toContain("test must not be defined unless type equals alt");
			});

			test("the same settings pass without validation", () => {
				expect(
					errorOf(() => start(template(`${prefix}mode="generated" ${prefix}expression="v().sku"`, ITEM_SLOT), false))
				).toBeNull();
			});
		});
	});

	describe("items", () => {
		test("a watched list renders an appended item", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="m().items">${ITEM_SLOT}</c-each></ul>`
			);

			sync(harness, (c: ListComponent) => c.items.push({ sku: "d", name: "D" }));

			expect(texts(list(harness))).toEqual(["A", "B", "C", "D"]);
		});

		test("an immutable list keeps the items it rendered at mount", () => {
			const harness: Harness<ListComponent> = start(
				`<ul data-testid="list"><c-each items="[[m().items]]">${ITEM_SLOT}</c-each></ul>`
			);

			sync(harness, (c: ListComponent) => c.items.push({ sku: "d", name: "D" }));

			expect(texts(list(harness))).toEqual(["A", "B", "C"]);
		});

		test("a missing items attribute fails and names items", () => {
			const error: Error = errorOf(() => start(`<ul><c-each mode="none">${ITEM_SLOT}</c-each></ul>`));

			expect(error.name).toEqual("TemplateError");
			expect(error.message).toContain("items");
		});

		test("an empty items attribute fails and names items", () => {
			const error: Error = errorOf(() => start(`<ul><c-each items="">${ITEM_SLOT}</c-each></ul>`));

			expect(error.name).toEqual("TemplateError");
			expect(error.message).toContain("items");
		});
	});

	describe("slots", () => {
		const SLOTS: string = `<ul data-testid="list"><c-each items="m().items" mode="expression" expression="v().sku">
			<template c-type="first"><li>FIRST</li></template>
			<template c-type="empty"><li>EMPTY</li></template>
			<template c-type="alt" c-test="v().special"><li>ALT {{v().name}}</li></template>
			<template c-type="item"><li>{{v().name}}</li></template>
			<template c-type="last"><li>LAST</li></template>
		</c-each></ul>`;

		test("first, alt, item and last render around the items", () => {
			const harness: Harness<ListComponent> = start(SLOTS);

			sync(
				harness,
				(c: ListComponent) =>
					(c.items = [
						{ sku: "a", name: "A" },
						{ sku: "s", name: "S", special: true }
					])
			);

			expect(texts(list(harness))).toEqual(["FIRST", "A", "ALT S", "LAST"]);
		});

		test("an empty array renders only the empty slot", () => {
			const harness: Harness<ListComponent> = start(SLOTS);

			sync(harness, (c: ListComponent) => (c.items = []));

			expect(texts(list(harness))).toEqual(["EMPTY"]);
		});

		test("reordering moves the existing item elements", () => {
			const harness: Harness<ListComponent> = start(SLOTS);
			const before: Element[] = Array.from(list(harness).children);

			sync(harness, (c: ListComponent) => c.items.reverse());

			const after: Element[] = Array.from(list(harness).children);
			expect(texts(list(harness))).toEqual(["FIRST", "C", "B", "A", "LAST"]);
			expect(after[1]).toBe(before[3]);
			expect(after[3]).toBe(before[1]);
		});

		test.each([
			["non-whitespace text", `text${ITEM_SLOT}`],
			["an element other than a template", `<li>x</li>${ITEM_SLOT}`],
			["no item slot", '<template c-type="empty"><li>E</li></template>'],
			[
				"two empty slots",
				`${ITEM_SLOT}<template c-type="empty"><li>E</li></template><template c-type="empty"><li>E</li></template>`
			]
		])("invalid content (%s) fails with a TemplateError", (label: string, content: string) => {
			const error: Error = errorOf(() => start(`<ul><c-each items="m().items">${content}</c-each></ul>`, true));

			expect(error.name).toEqual("TemplateError");
			expect(error.message).toContain("<c-each> element is invalid");
		});

		test("m() in an item is the parent component", () => {
			const harness: Harness<ListComponent> = start(
				'<ul data-testid="list"><c-each items="m().items" mode="expression" expression="v().sku"><template c-type="item"><li><button c-onclick="m().remove(v())">{{v().name}}</button></li></template></c-each></ul>'
			);

			harness.forText("B").get().click();

			expect(harness.getComponent().removed.map((item: Item) => item.name)).toEqual(["B"]);
			expect(texts(list(harness))).toEqual(["A", "C"]);
		});
	});

	describe("placement rules", () => {
		test("<c-each> as the top-level element fails with a TemplateError", () => {
			const error: Error = errorOf(() => start(`<c-each items="m().items">${ITEM_SLOT}</c-each>`));

			expect(error.name).toEqual("TemplateError");
			expect(error.message).toContain("top-level");
		});

		test("the attribute form still renders options inside a select bound with c-model", () => {
			const harness: Harness<ListComponent> = start(
				'<div><select data-testid="list" c-each="m().items" c-each-mode="expression" c-each-expression="v().sku" c-model="m().choice"><template c-type="item"><option value="{{v().sku}}">{{v().name}}</option></template></select></div>'
			);
			const select: HTMLSelectElement = list(harness) as HTMLSelectElement;

			expect(texts(select)).toEqual(["A", "B", "C"]);
			expect(select.value).toEqual("b");
		});

		test("both forms in one template render and update independently", () => {
			const harness: Harness<ListComponent> = start(`<div>
				<table><tbody data-testid="rows" c-each="m().others"><template c-type="item"><tr><td>{{v().name}}</td></tr></template></tbody></table>
				<ul data-testid="list"><c-each items="m().items">${ITEM_SLOT}</c-each></ul>
			</div>`);

			expect(texts(list(harness, "rows"))).toEqual(["X"]);
			expect(texts(list(harness))).toEqual(["A", "B", "C"]);

			sync(harness, (c: ListComponent) => c.items.pop());

			expect(texts(list(harness, "rows"))).toEqual(["X"]);
			expect(texts(list(harness))).toEqual(["A", "B"]);
		});
	});
});
