/**
 * @jest-environment node
 */
/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { JSDOM } from "jsdom";

const CHILD: string = path.resolve(__dirname, "esm", "cydran-module.mjs");

const ESM_TEST_DIRECTORY: string = path.resolve(__dirname, "esm");

/**
 * A Jest configuration that runs harness.esm.mjs as an ES module in the jsdom environment.
 */
const ESM_JEST_CONFIG: object = {
	rootDir: ESM_TEST_DIRECTORY,
	testMatch: ["**/harness.esm.mjs"],
	testEnvironment: "jsdom",
	setupFiles: ["<rootDir>/setup.cjs"],
	transform: {},
	moduleFileExtensions: ["js", "mjs", "cjs"]
};

/**
 * The names the UMD bundle provides through CommonJS, loaded into a jsdom window as Cydran needs a DOM.
 */
function umdNames(): string[] {
	const dom: JSDOM = new JSDOM("<!DOCTYPE html><html><body></body></html>", { runScripts: "outside-only" });
	const exports: any = {};
	dom.window["__exports"] = exports;
	dom.window.eval("(function (exports) {\n" + fs.readFileSync("../cydran/dist/cydran.js", "utf8") + "\n})(window.__exports);");

	return Object.keys(exports).sort();
}

describe("ES module bundle", () => {
	let result: any = null;

	beforeAll(() => {
		result = JSON.parse(execFileSync(process.execPath, [CHILD], { encoding: "utf8" }));
	}, 30000);

	test("import of @cydran/cydran resolves to dist/cydran.mjs", () => {
		expect(result.resolved.endsWith("/dist/cydran.mjs")).toBe(true);
	});

	test("named imports are the framework's", () => {
		expect(result.component).toEqual("function");
		expect(result.create).toEqual("function");
	});

	test("files under dist resolve", () => {
		expect(result.minResolved.endsWith("/dist/cydran.min.js")).toBe(true);
	});

	test("files outside dist are not exported", () => {
		expect(result.sourceError).toEqual("ERR_PACKAGE_PATH_NOT_EXPORTED");
	});

	test("the ES module and the UMD bundle export the same names", () => {
		expect(result.names).toEqual(umdNames());
	});
});

describe("ES module bundle of testsupport", () => {
	test("runs in Jest's ES module mode", () => {
		const jest: string = path.resolve("node_modules", "jest", "bin", "jest.js");
		let status: number = 0;
		let output: string = "";

		try {
			execFileSync(process.execPath, ["--experimental-vm-modules", jest, "--config", JSON.stringify(ESM_JEST_CONFIG)], {
				encoding: "utf8",
				stdio: "pipe"
			});
		} catch (error) {
			status = (error as any).status;
			output = String((error as any).stdout) + String((error as any).stderr);
		}

		expect(output).toEqual("");
		expect(status).toEqual(0);
	}, 60000);
});
