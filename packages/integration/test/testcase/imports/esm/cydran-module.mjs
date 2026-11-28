/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

// Run by esm.spec.ts as a plain Node ES module. Provides the DOM globals Cydran reads at load time from jsdom, imports
// @cydran/cydran through its package exports, and prints what it found as JSON.

import { JSDOM } from "jsdom";

// A URL gives the page a real origin, as Jest's jsdom environment does. Without one, jsdom's localStorage getter throws,
// and Node versions without a localStorage global of their own read it below.
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", { url: "http://localhost/" });

for (const name of Object.getOwnPropertyNames(dom.window)) {
	if (!(name in globalThis)) {
		globalThis[name] = dom.window[name];
	}
}

globalThis.window = dom.window;
globalThis.self = dom.window;

const cydran = await import("@cydran/cydran");

let sourceError = null;

try {
	import.meta.resolve("@cydran/cydran/src/index.ts");
} catch (error) {
	sourceError = error.code;
}

console.log(
	JSON.stringify({
		resolved: import.meta.resolve("@cydran/cydran"),
		minResolved: import.meta.resolve("@cydran/cydran/dist/cydran.min.js"),
		sourceError: sourceError,
		component: typeof cydran.Component,
		create: typeof cydran.create,
		names: Object.keys(cydran).sort()
	})
);
