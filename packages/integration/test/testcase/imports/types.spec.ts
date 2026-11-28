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

import * as path from "path";
import { execFileSync } from "child_process";

const TSC: string = path.resolve("node_modules", "typescript", "bin", "tsc");

const FIXTURES: string = path.resolve(__dirname, "types");

const COMMON_OPTIONS: string[] = [
	"--noEmit",
	"--strict",
	"--target",
	"es2020",
	"--lib",
	"es2021,dom",
	"--types",
	"node",
	"--skipLibCheck",
	"false"
];

/**
 * Type-checks one fixture as a consumer of @cydran/cydran and returns tsc's exit status and output.
 */
function check(fixture: string, moduleOption: string, resolution: string): { status: number; output: string } {
	let status: number = 0;
	let output: string = "";

	try {
		execFileSync(
			process.execPath,
			[TSC, ...COMMON_OPTIONS, "--module", moduleOption, "--moduleResolution", resolution, path.join(FIXTURES, fixture)],
			{
				encoding: "utf8",
				stdio: "pipe"
			}
		);
	} catch (error) {
		status = (error as any).status;
		output = String((error as any).stdout) + String((error as any).stderr);
	}

	return { status: status, output: output };
}

describe("Types for consumers of the package", () => {
	test("an ES module consumer type-checks with moduleResolution node16", () => {
		expect(check("consumer.mts", "node16", "node16")).toEqual({ status: 0, output: "" });
	}, 60000);

	test("a consumer type-checks with moduleResolution bundler", () => {
		expect(check("consumer.ts", "esnext", "bundler")).toEqual({ status: 0, output: "" });
	}, 60000);

	test("a name that is not exported fails to type-check", () => {
		const result: { status: number; output: string } = check("missing.mts", "node16", "node16");

		expect(result.status).not.toEqual(0);
		expect(result.output).toContain("has no exported member 'NotExported'");
	}, 60000);
});
