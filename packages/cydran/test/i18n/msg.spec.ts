/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import msg from 'i18n/msg';

test("msg() - Unknown error message", () => {
	const result = msg(0);
	expect(result).toEqual("ERROR-00000");
});

test("msg() - Known error message", () => {
	const result = msg(1);
	expect(result).toEqual("ERROR-00001: Something went really wrong");
});
