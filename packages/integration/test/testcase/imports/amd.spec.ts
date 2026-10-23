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
	const exports: any = {};

	const define: Function = function(deps: any[], callback: Function) {
		callback(exports);
	};

	define["amd"] = true;
	const fnPrefix = "var define = arguments[0];\n";
	Function(fnPrefix + fs.readFileSync("../cydran/dist/cydran.js", "utf8"))(define);

	expect(exports).not.toBeNull();
	expect(exports["Component"]).toBeDefined();
});
