/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Level from "log/Level";

const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"];

test("availability of each level", () => {
	enumStates.forEach(val => {
		try {
			const specimen: Level = Level[val];
			expect(specimen).not.toBeNull();
		} catch (err) {
			fail(`bad value passed: ${ val }`);
		}
	});
});

test("failure with bad level", () => {
	expect(Level["Whack"]).toBe(undefined);
});
