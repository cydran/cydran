/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Stage, create } from "@cydran/cydran";
import { describe, test, expect } from '@jest/globals';

describe.skip("Bug 492", () => {

	test("set production mode to true", () => {
		document.body.innerHTML = '<div id="app"></div>';
		const stage: Stage = create("#app", { "cydran.strict.enabled": true, "cydran.logging.level": "WARN" });
		stage.start();

		expect(stage.getContext().getProperties().isTruthy('cydran.strict.enabled')).toEqual(true);
	});

	test("expect default mode to be strict (strict mode == false)", () => {
		document.body.innerHTML = '<div id="app"></div>';
		const stage: Stage = create("#app", { "cydran.logging.level": "WARN" });
		stage.start();


		expect(stage.getContext().getProperties().isTruthy('cydran.strict.enabled')).toEqual(true);
	});

});
