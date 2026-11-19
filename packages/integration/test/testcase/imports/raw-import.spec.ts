/**
 * @jest-environment jsdom
 */
/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import * as fs from "fs";

test("Cydran should be defined and populated", () => {
	const specimen: any = Function(fs.readFileSync("node_modules/@cydran/cydran/dist/cydran.js", "utf8") + "\n\nreturn cydran;")();
	expect(specimen).not.toBeNull();
	expect(specimen["Component"]).toBeDefined();
});
