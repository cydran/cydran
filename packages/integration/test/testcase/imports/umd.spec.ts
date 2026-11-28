/**
 * @jest-environment jsdom
 */
/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import * as fs from "fs";

const CYDRAN_SOURCE: string = fs.readFileSync("../cydran/dist/cydran.js", "utf8");

const CYDRAN_MIN_SOURCE: string = fs.readFileSync("../cydran/dist/cydran.min.js", "utf8");

const TESTSUPPORT_SOURCE: string = fs.readFileSync("../testsupport/dist/testsupport.js", "utf8");

const TESTSUPPORT_MIN_SOURCE: string = fs.readFileSync("../testsupport/dist/testsupport.min.js", "utf8");

const globalObject: any = window;

describe("UMD bundles", () => {
	afterEach(() => {
		delete globalObject["cydran"];
		delete globalObject["testsupport"];
	});

	test("cydran.js as a plain script sets only the cydran global", () => {
		const before: string[] = Object.getOwnPropertyNames(globalObject);

		Function(CYDRAN_SOURCE)();

		const added: string[] = Object.getOwnPropertyNames(globalObject).filter((name: string) => before.indexOf(name) === -1);
		expect(added).toEqual(["cydran"]);
		expect(globalObject["cydran"]["Component"]).toBeDefined();
		expect(globalObject["commonJsStrictGlobal"]).toBeUndefined();
	});

	test("noConflict() restores the global from before the bundle was loaded", () => {
		const previous: object = { previous: true };
		globalObject["cydran"] = previous;

		Function(CYDRAN_SOURCE)();

		const loaded: any = globalObject["cydran"];
		expect(loaded).not.toBe(previous);
		expect(loaded.noConflict()).toBe(loaded);
		expect(globalObject["cydran"]).toBe(previous);
	});

	test("cydran.min.js loads through CommonJS", () => {
		const exports: any = {};

		Function("exports", CYDRAN_MIN_SOURCE)(exports);

		expect(exports["Component"]).toBeDefined();
		expect(exports["create"]).toBeDefined();
	});

	test.each([
		["testsupport.js", TESTSUPPORT_SOURCE],
		["testsupport.min.js", TESTSUPPORT_MIN_SOURCE]
	])("%s lists only the dependencies it uses for AMD", (fileName: string, source: string) => {
		let dependencies: string[] = null;
		const define: any = (deps: string[]) => {
			dependencies = deps;
		};
		define["amd"] = true;

		Function("define", source)(define);

		expect(dependencies[0]).toEqual("exports");
		expect(dependencies.slice(1).sort()).toEqual(["@cydran/cydran", "@jest/globals", "@testing-library/dom", "jsdom"]);
	});

	test("testsupport.js as a plain script fails naming a dependency without a global", () => {
		Function(CYDRAN_SOURCE)();

		expect(() => Function(TESTSUPPORT_SOURCE)()).toThrow("testsupport: dependency jsdom is not available as a global");
		expect(globalObject["testsupport"]).toBeUndefined();
	});
});
