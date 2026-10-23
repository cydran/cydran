/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import IntervalImpl from "interval/IntervalImpl";
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

let spec: IntervalImpl = null;

describe("IntervalImpl", () => {

	beforeEach(() => {
		spec = new IntervalImpl({}, () => { }, 500, () => { });
	});

	afterEach(() => {
		spec = null;
	});

	test("not null", () => {
		expect(spec).not.toBeNull();
	});

});
