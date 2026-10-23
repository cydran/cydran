/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import emptyObject from "function/emptyObject";
import { test, expect } from '@jest/globals';

test("emptyObject", () => {
	const expected: Object = {};
	const result: Object = emptyObject();
	expect(result).toEqual(expected);
});
