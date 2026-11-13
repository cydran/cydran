/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { describe, test, expect } from "@jest/globals";
import { memoryUsage } from 'node:process';
import gc from "expose-gc/function";

describe("Garbage Collection", () => {

	test("API should present", () => {
		expect(typeof gc).toBe('function');
	});

	test("gc() works", () => {
		let memoryEater: string[] = [];
		memoryEater = new Array(1e6).fill('some string');
		const heapBefore: number = memoryUsage().heapUsed;
		memoryEater = null as unknown as string[];

		gc();

		const heapAfter: number = memoryUsage().heapUsed;
		expect(heapAfter < heapBefore).toBeTruthy();
	});

});