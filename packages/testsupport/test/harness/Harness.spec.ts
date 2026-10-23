/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Harness from "harness/Harness";
import { test, describe } from '@jest/globals';
import { Component } from '@cydran/cydran';

describe("Harness", () => {

	test("Multiple Resets", () => {
		const harness: Harness<Component> = new Harness<Component>();
		console.log("Starting Harness");
		harness.start();
		console.log("Resetting Harness 0");
		harness.reset();
		console.log("Resetting Harness 1");
		harness.reset();
		console.log("Resetting Harness 2");
		harness.reset();
	});

});
