/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import InvalidIdStrategyImpl from "behavior/core/each/InvalidIdStrategyImpl";
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

let instance: InvalidIdStrategyImpl = null;

describe("InvalidIdStrategyImpl", () => {

	beforeEach(() => {
		instance = new InvalidIdStrategyImpl();
	});

	afterEach(() => {
		instance = null;
	});

	test("instance is good", () => {
		expect(instance).not.toBeNull();
		expect(instance).not.toBeUndefined();
	});

	test("init", () => {
		expect(() => { instance.init(); }).toThrowError(Error);
	});

	test("check", () => {
		expect(instance.check({})).toBeTruthy();
	});

	test("extract", () => {
		expect(instance.extract({})).toBeNull();
	});

});
