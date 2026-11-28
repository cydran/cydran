/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

// Run by esm.spec.ts in a child Jest that executes test files as ES modules (node --experimental-vm-modules), in the
// jsdom environment. Both packages are imported through their "import" export condition. A namespace without a
// "default" member is a real ES module: a CommonJS file imported from an ES module would have one.

import { expect, test } from "@jest/globals";
import * as testsupport from "@cydran/testsupport";
import * as cydran from "@cydran/cydran";

class Greeting extends cydran.Component {
	constructor() {
		super('<p data-testid="greeting">Hello from an ES module</p>');
	}
}

test("testsupport and cydran load as ES modules", () => {
	expect("default" in testsupport).toBe(false);
	expect("default" in cydran).toBe(false);
});

test("a harness starts a component and finds its text", () => {
	const harness = new testsupport.Harness(() => new Greeting());
	harness.start();
	harness.forTestId("greeting").expect().textContent().toEqual("Hello from an ES module");
	harness.stop();
});
