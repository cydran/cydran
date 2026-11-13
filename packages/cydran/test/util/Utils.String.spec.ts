/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { startsWith, endsWith } from "util/Utils";

test("endsWith empty string", () => {
	expect(endsWith("", "e test")).toBeFalsy();
});

test("endsWith non-empty string", () => {
	expect(endsWith("This is a test", "a test")).toBeTruthy();
});

test("startsWith empty string", () => {
	expect(startsWith("", "This ")).toBeFalsy();
});

test("startsWith non-empty string", () => {
	expect(startsWith("This is a test", "This ")).toBeTruthy();
});
