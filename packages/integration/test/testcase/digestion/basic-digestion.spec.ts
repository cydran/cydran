/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';
import LoggingSegmentDigester from "./LoggingSegmentDigester";

const TEMPLATE: string = `<div>
	<p data-testid="the-value">{{m().value}}</p>
	<button c-onclick="m().update()">Change Value</button>
</div>`;

class TestComponent extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "Old";
	}

	public update(): void {
		this.value = "New";
	}

}

describe("Basic Digestion", () => {

	test("Test digest update", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");

		harness.forTestId("the-value").expect().textContent().toEqual("Old");
		harness.forText("Change Value").get().click();
		harness.forTestId("the-value").expect().textContent().toEqual("New");

		expect(segmentDigester.getEvents()).toEqual([
			"0-0-6 - Evaluating - m().value",
			"0-0-6 - Changed - m().value",
			"0-0-6 - Evaluating - m().value"
		]);
	});

});
