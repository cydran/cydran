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

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

describe("No Behaviors", () => {

	test("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerSingletonGlobally("cydranSegmentDigester", LoggingSegmentDigester);

		harness.start();
		const segmentDigester: LoggingSegmentDigester = harness.getContext().getObject("cydranSegmentDigester");
		expect(harness.getDocument().body.innerHTML).toEqual("<!--SS--><!--SE--><div>Hello World!</div><!--SS--><!--SE-->");
		expect(segmentDigester.getEvents().length).toEqual(0);
	});

});
