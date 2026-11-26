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

// The same v() guarantees as each-same-key-replacement.spec.ts, for the <c-each> element: v() follows in-place
// edits and same-key replacement, and c-model on v() writes into the item in the parent's array.

const TEMPLATE: string = `<div>
	<ul><c-each items="m().items">
		<template c-type="item">
			<li><span data-testid="name">{{v().name}}</span><input data-testid="input" c-model="v().name"></li>
		</template>
	</c-each></ul>
	<p data-testid="model">{{m().items.map(i => i.name).join(",")}}</p>
	<button c-onclick="m().replaceAll()">Replace all</button>
	<button c-onclick="m().replaceFirst()">Replace first</button>
	<button c-onclick="m().renameFirst()">Rename first</button>
</div>`;

interface Item {

	name: string;

}

class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(TEMPLATE);
		this.items = [{ name: "One" }, { name: "Two" }];
	}

	public replaceAll(): void {
		this.items = this.items.map((item: Item) => ({ ...item, name: item.name + "+" }));
	}

	public renameFirst(): void {
		this.items[0].name = "Edited";
	}

	public replaceFirst(): void {
		this.items[0] = { ...this.items[0], name: "First" };
	}

}

function start(): Harness<TestComponent> {
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
	harness.start();

	return harness;
}

describe("<c-each> element item values", () => {
	test("replacing every item with a same-key copy updates each item's v()", () => {
		const harness: Harness<TestComponent> = start();
		harness.forText("Replace all").get().click();

		harness.forTestId("model").expect().textContent().toEqual("One+,Two+");
		expect(
			harness
				.forTestId("name")
				.getAll()
				.map((el: HTMLElement) => el.textContent)
		).toEqual(["One+", "Two+"]);
	});

	test("replacing one item with a same-key copy updates that item's v()", () => {
		const harness: Harness<TestComponent> = start();
		harness.forText("Replace first").get().click();

		harness.forTestId("model").expect().textContent().toEqual("First,Two");
		expect(
			harness
				.forTestId("name")
				.getAll()
				.map((el: HTMLElement) => el.textContent)
		).toEqual(["First", "Two"]);
	});

	test("after a same-key replacement, c-model on v() writes to the new item", () => {
		const harness: Harness<TestComponent> = start();
		harness.forText("Replace all").get().click();
		const input: HTMLInputElement = harness.forTestId("input").getAll()[0] as HTMLInputElement;
		input.value = "Typed";
		input.dispatchEvent(new (harness.getWindow() as unknown as typeof globalThis).Event("input", { bubbles: true }));

		harness.forTestId("model").expect().textContent().toEqual("Typed,Two+");
	});

	test("an in-place edit of an item is shown", () => {
		const harness: Harness<TestComponent> = start();
		harness.forText("Rename first").get().click();

		expect(
			harness
				.forTestId("name")
				.getAll()
				.map((el: HTMLElement) => el.textContent)
		).toEqual(["Edited", "Two"]);
	});

	test("typing into an item's c-model input updates the parent's array", () => {
		const harness: Harness<TestComponent> = start();
		const input: HTMLInputElement = harness.forTestId("input").getAll()[1] as HTMLInputElement;
		input.value = "Typed";
		input.dispatchEvent(new (harness.getWindow() as unknown as typeof globalThis).Event("input", { bubbles: true }));

		harness.forTestId("model").expect().textContent().toEqual("One,Typed");
	});
});
